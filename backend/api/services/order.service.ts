import {orderRepository} from '../repositories/order.repository';
import {userRepository} from '../repositories/user.repository';
import {ApiError} from '../utils/error';
import {ErrorCodes} from '../constants/errorCodes';
import {priceLines} from '../utils/pricing';
import {checkPickupTime} from '../utils/pickupTime';
import {NEXT_STATUSES, ORDER_STATUSES, OrderStatus} from '../models/Order.model';
import type {CreateOrderDto} from '../dtos/order.dto';

type OrderLike = {
  _id: unknown;
  orderNumber: string;
  status: OrderStatus;
  statusHistory?: {status: OrderStatus; at: Date}[];
  items: {menuItem: unknown; name: string; unitPrice: number; quantity: number; lineTotal: number}[];
  subtotal: number;
  discount: number;
  total: number;
  pickupAt: Date;
  notes?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: {street: string; barangay: string; city: string; province: string; landmark?: string} | null;
  createdAt: Date;
};

export function toOrderView(order: OrderLike) {
  return {
    id: String(order._id),
    orderNumber: order.orderNumber,
    status: order.status,
    statusHistory: (order.statusHistory ?? []).map(entry => ({status: entry.status, at: entry.at})),
    items: order.items.map(item => ({
      menuItemId: String(item.menuItem),
      name: item.name,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.lineTotal
    })),
    subtotal: order.subtotal,
    discount: order.discount,
    total: order.total,
    pickupAt: order.pickupAt,
    notes: order.notes ?? '',
    customer: {
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
      address: order.customerAddress
        ? {
            street: order.customerAddress.street,
            barangay: order.customerAddress.barangay,
            city: order.customerAddress.city,
            province: order.customerAddress.province,
            landmark: order.customerAddress.landmark ?? ''
          }
        : null
    },
    nextStatuses: NEXT_STATUSES[order.status],
    createdAt: order.createdAt
  };
}

/** Admin list filters. */
const STATUS_GROUPS: Record<string, OrderStatus[] | null> = {
  active: ['received', 'preparing', 'ready'],
  completed: ['completed'],
  cancelled: ['cancelled'],
  all: null
};

export const orderService = {
  async create(customerId: string, dto: CreateOrderDto) {
    const pickupAt = new Date(dto.pickupAt);
    const pickupProblem = checkPickupTime(pickupAt);
    if (pickupProblem) throw new ApiError(400, ErrorCodes.INVALID_PICKUP_TIME, pickupProblem);

    const customer = await userRepository.findById(customerId);
    if (!customer) throw new ApiError(401, ErrorCodes.UNAUTHORIZED, 'Please sign in again');
    // Shop safety: only customers with a mobile number and address can order.
    if (!customer.phone || !customer.address?.street || !customer.address.barangay || !customer.address.city) {
      throw new ApiError(400, ErrorCodes.PROFILE_INCOMPLETE, 'Add your mobile number and address before ordering');
    }

    // Merge duplicate lines, then look up the real prices (never trust the browser's).
    const quantities = new Map<string, number>();
    for (const line of dto.items) {
      quantities.set(line.menuItemId, (quantities.get(line.menuItemId) ?? 0) + line.quantity);
    }
    const menuItems = await orderRepository.findMenuItems([...quantities.keys()]);
    const byId = new Map(menuItems.map(item => [String(item._id), item]));

    for (const id of quantities.keys()) {
      const item = byId.get(id);
      if (!item) {
        throw new ApiError(409, ErrorCodes.ITEM_UNAVAILABLE, 'An item in your cart is no longer on the menu', {menuItemId: id});
      }
      if (!item.isAvailable) {
        throw new ApiError(409, ErrorCodes.ITEM_UNAVAILABLE, `${item.name} is sold out right now`, {
          menuItemId: id,
          name: item.name
        });
      }
    }

    const lines = [...quantities.entries()].map(([id, quantity]) => {
      const item = byId.get(id)!;
      return {
        id,
        categoryId: String(item.category),
        unitPrice: item.price,
        quantity,
        deal: item.deal ? {quantity: item.deal.quantity, price: item.deal.price} : null,
        name: item.name
      };
    });
    const {subtotal, discount, total} = priceLines(lines);

    const order = await orderRepository.create({
      orderNumber: await orderRepository.nextOrderNumber(),
      customer: customer._id,
      customerName: `${customer.firstName} ${customer.lastName}`.trim(),
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerAddress: {
        street: customer.address.street,
        barangay: customer.address.barangay,
        city: customer.address.city,
        province: customer.address.province,
        landmark: customer.address.landmark ?? ''
      },
      items: lines.map(line => ({
        menuItem: line.id as never,
        name: line.name,
        unitPrice: line.unitPrice,
        quantity: line.quantity,
        lineTotal: line.unitPrice * line.quantity
      })),
      subtotal,
      discount,
      total,
      fulfillment: 'pickup',
      pickupAt,
      notes: dto.notes,
      paymentMethod: 'pay_at_pickup',
      status: 'received',
      statusHistory: [{status: 'received', at: new Date()}]
    });

    return toOrderView(order.toObject());
  },

  async listMine(customerId: string) {
    const orders = await orderRepository.listForCustomer(customerId);
    return orders.map(toOrderView);
  },

  async getMine(customerId: string, orderId: string) {
    const order = await orderRepository.findById(orderId);
    // Same "not found" for someone else's order, so ids can't be probed.
    if (!order || String(order.customer) !== customerId) {
      throw new ApiError(404, ErrorCodes.NOT_FOUND, 'Order not found');
    }
    return toOrderView(order);
  },

  async listForAdmin(group: string) {
    const statuses = group in STATUS_GROUPS ? STATUS_GROUPS[group] : STATUS_GROUPS.active;
    const [orders, counts] = await Promise.all([orderRepository.list(statuses), orderRepository.countByStatus()]);
    const countMap = Object.fromEntries(ORDER_STATUSES.map(status => [status, 0])) as Record<OrderStatus, number>;
    for (const {_id, count} of counts) countMap[_id] = count;
    return {orders: orders.map(toOrderView), counts: countMap};
  },

  async updateStatus(orderId: string, to: OrderStatus) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new ApiError(404, ErrorCodes.NOT_FOUND, 'Order not found');
    if (!NEXT_STATUSES[order.status].includes(to)) {
      throw new ApiError(409, ErrorCodes.INVALID_STATUS_CHANGE, `Can't change a ${order.status} order to ${to}`);
    }
    const updated = await orderRepository.updateStatus(orderId, order.status, to);
    if (!updated) {
      throw new ApiError(409, ErrorCodes.INVALID_STATUS_CHANGE, 'This order was just updated by someone else. Please refresh.');
    }
    return toOrderView(updated);
  }
};
