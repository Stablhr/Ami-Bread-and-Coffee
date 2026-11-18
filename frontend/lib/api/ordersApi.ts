import {httpClient} from './httpClient';
import type {MenuCategory} from './menuApi';
import type {Address} from './authApi';

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  statusHistory: {status: OrderStatus; at: string}[];
  items: {menuItemId: string; name: string; unitPrice: number; quantity: number; lineTotal: number}[];
  subtotal: number;
  discount: number;
  total: number;
  pickupAt: string;
  notes: string;
  customer: {name: string; email: string; phone: string; address: Address | null};
  nextStatuses: OrderStatus[];
  createdAt: string;
};

export type NewOrder = {
  items: {menuItemId: string; quantity: number}[];
  /** ISO time with offset, e.g. 2026-11-18T09:30:00+08:00 */
  pickupAt: string;
  notes: string;
};

// Customer
export async function placeOrder(input: NewOrder) {
  const res = await httpClient.post<{order: Order}>('/orders', input);
  return res.data.order;
}

export async function getMyOrders() {
  const res = await httpClient.get<{orders: Order[]}>('/orders/mine');
  return res.data;
}

export async function getMyOrder(id: string) {
  const res = await httpClient.get<{order: Order}>(`/orders/${id}`);
  return res.data.order;
}

// Admin
export type AdminOrderFilter = 'active' | 'completed' | 'cancelled' | 'all';

export async function getAdminOrders(status: AdminOrderFilter) {
  const res = await httpClient.get<{orders: Order[]; counts: Record<OrderStatus, number>}>('/admin/orders', {
    params: {status}
  });
  return res.data;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const res = await httpClient.patch<{order: Order}>(`/admin/orders/${id}/status`, {status});
  return res.data.order;
}

/** Live menu for the browser (cart price/availability check). */
export async function getLiveMenu() {
  const res = await httpClient.get<{categories: MenuCategory[]}>('/menu');
  return res.data.categories;
}
