import {z} from 'zod';
import {ORDER_STATUSES} from '../models/Order.model';

const objectId = z.string().regex(/^[a-f0-9]{24}$/i, 'Invalid item');

export const createOrderDto = z
  .object({
    items: z
      .array(
        z.object({
          menuItemId: objectId,
          quantity: z.number().int().min(1).max(30)
        })
      )
      .min(1, 'Your cart is empty')
      .max(40, 'Too many different items'),
    pickupAt: z.string().datetime({offset: true, message: 'Choose a pickup time'}),
    notes: z.string().trim().max(300).default('')
  })
  .strict();

export const updateOrderStatusDto = z
  .object({
    status: z.enum(ORDER_STATUSES)
  })
  .strict();

export type CreateOrderDto = z.infer<typeof createOrderDto>;
