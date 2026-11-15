import {z} from 'zod';

const objectId = z.string().regex(/^[a-f0-9]{24}$/i, 'Choose a category');

const shortText = (max: number) => z.string().trim().min(1).max(max);

/**
 * Photo URLs we accept: our own uploaded images (/api/images/<id>) or the
 * starter photos shipped with the website (/products/<file>).
 */
const imageUrl = z
  .string()
  .regex(
    /^\/(api\/images\/[a-f0-9]{24}|products\/[a-z0-9-]+\.(webp|jpe?g|png))$/i,
    'Invalid photo'
  );

const list = (label: string) =>
  z.array(shortText(80)).max(30, `Too many ${label}`).default([]);

export const menuItemDto = z
  .object({
    categoryId: objectId,
    name: shortText(80),
    description: z.string().trim().max(500).default(''),
    price: z.number().int('Use whole pesos').min(0).max(100000),
    deal: z
      .object({
        quantity: z.number().int().min(2).max(50),
        price: z.number().int('Use whole pesos').min(0).max(100000)
      })
      .nullable()
      .default(null),
    isFavorite: z.boolean().default(false),
    isAvailable: z.boolean().default(true),
    imageUrl: imageUrl.nullable().default(null),
    ingredients: list('ingredients'),
    allergens: list('allergens')
  })
  .strict();

export const updateMenuItemDto = menuItemDto.partial().strict();

export type MenuItemDto = z.infer<typeof menuItemDto>;
export type UpdateMenuItemDto = z.infer<typeof updateMenuItemDto>;
