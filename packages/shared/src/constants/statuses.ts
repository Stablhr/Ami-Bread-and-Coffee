export const FULFILLMENT_TYPES = ["PICKUP", "DELIVERY"] as const;
export type FulfillmentType = (typeof FULFILLMENT_TYPES)[number];

export const PAYMENT_METHODS = [
  "CASH_ON_PICKUP",
  "GCASH",
  "MAYA",
  "BANK_TRANSFER",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
