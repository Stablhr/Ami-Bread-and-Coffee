import type { MenuItem } from "@/lib/menu-data";

const CATALOG_BASE =
  process.env.NEXT_PUBLIC_CATALOG_API_URL ?? "http://localhost:4000";

export type ApiMenuItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  description: string;
  price: number;
  weightLabel: string | null;
  deal: { quantity: number; price: number } | null;
  imageUrl: string | null;
  active: boolean;
  defaultDailyCap: number;
  maxPerOrder: number;
  stockComponents: unknown;
  ingredients: string[];
  allergens: string[];
  tags: string[];
  sortOrder: number;
};

export type ApiCategory = {
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
};

async function catalogFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${CATALOG_BASE}${path}`, {
    ...init,
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(`Catalog request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  const body = await catalogFetch<{ data: ApiCategory[] }>("/api/v1/categories");
  return body.data;
}

export async function fetchMenu(category?: string): Promise<ApiMenuItem[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const body = await catalogFetch<{ data: ApiMenuItem[] }>(`/api/v1/menu${query}`);
  return body.data;
}

export async function fetchMenuItem(slug: string): Promise<ApiMenuItem | null> {
  try {
    const body = await catalogFetch<{ data: ApiMenuItem }>(`/api/v1/menu/${encodeURIComponent(slug)}`);
    return body.data;
  } catch {
    return null;
  }
}

export function apiItemToMenuItem(item: ApiMenuItem): MenuItem {
  return {
    slug: item.slug,
    name: item.name,
    category: item.category,
    price: item.price,
    description: item.description,
    ingredients: item.ingredients,
    allergens: item.allergens,
    tags: item.tags,
    deal: item.deal ?? undefined,
    weight: item.weightLabel ?? undefined
  };
}
