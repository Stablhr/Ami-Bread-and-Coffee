import { z } from "zod";
import { FULFILLMENT_TYPES, PAYMENT_METHODS } from "../constants/statuses.js";

export const orderItemInputSchema = z.object({
  menuItemId: z.string().uuid(),
  quantity: z.number().int().min(1).max(5),
});

export const createOrderSchema = z
  .object({
    fulfillmentType: z.enum(FULFILLMENT_TYPES),
    pickupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    customerName: z.string().min(1).max(120),
    customerPhone: z.string().min(7).max(20),
    customerEmail: z.string().email().optional().nullable(),
    deliveryAddress: z.string().max(500).optional().nullable(),
    deliveryZoneId: z.string().uuid().optional().nullable(),
    paymentMethod: z.enum(PAYMENT_METHODS),
    items: z.array(orderItemInputSchema).min(1).max(20),
    notes: z.string().max(500).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillmentType === "DELIVERY" && !data.deliveryZoneId) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Delivery zone is required", path: ["deliveryZoneId"] });
    }
  });

export const updateOrderStatusSchema = z.object({
  status: z.enum(["RECEIVED", "IN_THE_OVEN", "READY", "COMPLETED", "CANCELLED"]),
});

export const cancelOrderSchema = z.object({
  reason: z.string().max(500).optional(),
});
