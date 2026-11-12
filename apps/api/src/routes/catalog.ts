import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

export const catalogRouter = Router();

const listMenuQuery = z.object({
  category: z.string().trim().min(1).optional(),
  q: z.string().trim().min(1).optional()
});

function toMenuItemResponse(item: {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  weightLabel: string | null;
  dealQuantity: number | null;
  dealPrice: number | null;
  imageUrl: string | null;
  active: boolean;
  defaultDailyCap: number;
  maxPerOrder: number;
  stockComponents: unknown;
  ingredients: string[];
  allergens: string[];
  tags: string[];
  sortOrder: number;
  category: { slug: string; name: string };
}) {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    category: item.category.slug,
    categoryName: item.category.name,
    description: item.description,
    price: item.price,
    weightLabel: item.weightLabel,
    deal:
      item.dealQuantity && item.dealPrice
        ? { quantity: item.dealQuantity, price: item.dealPrice }
        : null,
    imageUrl: item.imageUrl,
    active: item.active,
    defaultDailyCap: item.defaultDailyCap,
    maxPerOrder: item.maxPerOrder,
    stockComponents: item.stockComponents,
    ingredients: item.ingredients,
    allergens: item.allergens,
    tags: item.tags,
    sortOrder: item.sortOrder
  };
}

catalogRouter.get("/categories", async (_req, res) => {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    select: { slug: true, name: true, description: true, sortOrder: true }
  });
  res.json({ data: categories });
});

catalogRouter.get("/menu", async (req, res) => {
  const parsed = listMenuQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }

  const { category, q } = parsed.data;

  const items = await prisma.menuItem.findMany({
    where: {
      active: true,
      ...(category ? { category: { slug: category, active: true } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } }
            ]
          }
        : {})
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { category: { select: { slug: true, name: true } } }
  });

  res.json({ data: items.map(toMenuItemResponse) });
});

catalogRouter.get("/menu/:slug", async (req, res) => {
  const item = await prisma.menuItem.findFirst({
    where: { slug: req.params.slug, active: true },
    include: { category: { select: { slug: true, name: true } } }
  });

  if (!item) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }

  res.json({ data: toMenuItemResponse(item) });
});
