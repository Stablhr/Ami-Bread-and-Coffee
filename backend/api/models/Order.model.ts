import mongoose, {Schema, Types} from 'mongoose';

export const ORDER_STATUSES = ['received', 'preparing', 'ready', 'completed', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Which status can follow which. Admin moves orders forward or cancels them. */
export const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  received: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['completed', 'cancelled'],
  completed: [],
  cancelled: []
};

export interface OrderLine {
  menuItem: Types.ObjectId;
  /** Snapshot at order time, so later menu edits don't change old orders. */
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderAddress {
  street: string;
  barangay: string;
  city: string;
  province: string;
  landmark: string;
}

export interface OrderDocument extends mongoose.Document {
  orderNumber: string;
  customer: Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  /** Snapshot of the customer's address when they ordered. */
  customerAddress?: OrderAddress | null;
  items: OrderLine[];
  /** Sum of unitPrice × quantity, in whole pesos. */
  subtotal: number;
  /** Bundle deal savings (e.g. any 3 scones for ₱220). */
  discount: number;
  total: number;
  fulfillment: 'pickup';
  pickupAt: Date;
  notes: string;
  paymentMethod: 'pay_at_pickup';
  status: OrderStatus;
  statusHistory: {status: OrderStatus; at: Date}[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderLineSchema = new Schema<OrderLine>(
  {
    menuItem: {type: Schema.Types.ObjectId, ref: 'MenuItem', required: true},
    name: {type: String, required: true},
    unitPrice: {type: Number, required: true, min: 0},
    quantity: {type: Number, required: true, min: 1},
    lineTotal: {type: Number, required: true, min: 0}
  },
  {_id: false}
);

const OrderSchema = new Schema<OrderDocument>(
  {
    orderNumber: {type: String, required: true, unique: true},
    customer: {type: Schema.Types.ObjectId, ref: 'User', required: true, index: true},
    customerName: {type: String, required: true},
    customerEmail: {type: String, required: true},
    customerPhone: {type: String, required: true},
    customerAddress: {
      type: new Schema<OrderAddress>(
        {street: String, barangay: String, city: String, province: String, landmark: {type: String, default: ''}},
        {_id: false}
      ),
      default: null
    },
    items: {type: [OrderLineSchema], required: true},
    subtotal: {type: Number, required: true, min: 0},
    discount: {type: Number, required: true, min: 0, default: 0},
    total: {type: Number, required: true, min: 0},
    fulfillment: {type: String, enum: ['pickup'], default: 'pickup'},
    pickupAt: {type: Date, required: true},
    notes: {type: String, default: ''},
    paymentMethod: {type: String, enum: ['pay_at_pickup'], default: 'pay_at_pickup'},
    status: {type: String, enum: ORDER_STATUSES, default: 'received', index: true},
    statusHistory: {
      type: [{status: {type: String, enum: ORDER_STATUSES}, at: Date, _id: false}],
      default: []
    }
  },
  {timestamps: true}
);

OrderSchema.index({status: 1, createdAt: -1});

export const OrderModel = mongoose.model<OrderDocument>('Order', OrderSchema, 'orders');
