/**
 * Public menu API. Called from Server Components, so it uses fetch rather
 * than the browser Axios client.
 */
export type MenuItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  deal: {quantity: number; price: number} | null;
  isFavorite: boolean;
  isAvailable: boolean;
  imageUrl: string | null;
  ingredients: string[];
  allergens: string[];
};

export type MenuCategory = {
  id: string;
  slug: string;
  name: string;
  note: string | null;
  items: MenuItem[];
};

export type MenuResult = {ok: true; categories: MenuCategory[]} | {ok: false};

export const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api').replace(/\/+$/, '');

export async function getMenu(): Promise<MenuResult> {
  try {
    // Not cached: price and photo changes made in Admin show up right away.
    const res = await fetch(`${API_BASE}/menu`, {cache: 'no-store'});
    if (!res.ok) return {ok: false};
    const data = (await res.json()) as {categories: MenuCategory[]};
    return {ok: true, categories: data.categories};
  } catch {
    // Backend not running or unreachable: pages show a friendly fallback.
    return {ok: false};
  }
}
