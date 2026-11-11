import { z } from "zod";

export const shopSettingsSchema = z.object({
  isOpen: z.boolean().optional(),
  bookingWindowDays: z.number().int().min(1).max(60).optional(),
  cutoffTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  sameDayOrdersEnabled: z.boolean().optional(),
  defaultDailyCap: z.number().int().min(0).optional(),
  maxQtyPerItem: z.number().int().min(1).max(10).optional(),
  freeDeliveryThreshold: z.number().int().min(0).optional(),
  smallOrderSurcharge: z.number().int().min(0).optional(),
  smallOrderThreshold: z.number().int().min(0).optional(),
  cashOnPickupEnabled: z.boolean().optional(),
  timezone: z.string().optional(),
  smsEnabled: z.boolean().optional(),
  emailEnabled: z.boolean().optional(),
  messengerUrl: z.string().url().optional().nullable(),
  shopPhone: z.string().optional().nullable(),
});
