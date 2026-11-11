export const ROLES = ["CUSTOMER", "STAFF", "OWNER"] as const;
export type Role = (typeof ROLES)[number];

export const ORDER_STATUSES = [
  "RECEIVED",
  "IN_THE_OVEN",
  "READY",
  "COMPLETED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "UNPAID",
  "AWAITING_CONFIRMATION",
  "PAID",
  "REFUNDED",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
