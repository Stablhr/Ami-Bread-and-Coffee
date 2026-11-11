import { z } from "zod";

export const menuItemSchema = z.object({
  categoryId: z.string().uuid(),
  slug: z.string().min(2).max(80),
  name: z.string().min(1).max(120),
  description: z.string().max(2000).default(""),
  price: z.number().int().nonnegative(), // centavos
  imageUrl: z.string().url().optional().nullable(),
  active: z.boolean().default(true),
  defaultDailyCap: z.number().int().min(0).default(20),
  maxPerOrder: z.number().int().min(1).max(5).default(5),
  stockComponents: z
    .array(z.object({ menuItemId: z.string().uuid(), quantity: z.number().int().min(1) }))
    .optional()
    .nullable(),
  ingredients: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  sortOrder: z.number().int().default(0),
});

export const updateMenuItemSchema = menuItemSchema.partial();

export const categorySchema = z.object({
  slug: z.string().min(2).max(80),
  name: z.string().min(1).max(120),
  description: z.string().max(2000).optional().nullable(),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});
