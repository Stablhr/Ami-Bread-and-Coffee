import {z} from 'zod';

/** PH mobile: 09XXXXXXXXX or +639XXXXXXXXX (spaces/dashes allowed, stored without them). */
export const phMobile = z
  .string()
  .trim()
  .transform(value => value.replace(/[\s-]/g, ''))
  .refine(value => /^(09\d{9}|\+639\d{9})$/.test(value), 'Enter a mobile number like 0917 123 4567');

const text = (label: string, min: number, max: number) =>
  z.string().trim().min(min, `Enter your ${label}`).max(max, `${label} is too long`);

/**
 * Customer address. Collected so the shop knows who it is preparing food for
 * (and, later, where to deliver), which helps prevent prank and scam orders.
 */
export const addressSchema = z
  .object({
    street: text('house no. and street', 3, 120),
    barangay: text('barangay / subdivision', 2, 80),
    city: text('city / municipality', 2, 80),
    province: text('province', 2, 80),
    landmark: z.string().trim().max(120).default('')
  })
  .strict();

export type Address = z.infer<typeof addressSchema>;
