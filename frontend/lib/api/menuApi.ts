import {serverApiBase} from './config';

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


export async function getMenu(): Promise<MenuResult> {
  try {
    // Not cached: price and photo changes made in Admin show up right away.
    const res = await fetch(`${serverApiBase()}/menu`, {cache: 'no-store'});
    if (!res.ok) return {ok: false};
    const data = (await res.json()) as {categories: MenuCategory[]};
    return {ok: true, categories: data.categories};
  } catch {
    // Backend not running or unreachable: pages show a friendly fallback.
    return {ok: false};
  }
}

export type MenuItemDetail = MenuItem & {
  category: {name: string; slug: string; note: string | null};
};

export type MenuItemResult = {ok: true; item: MenuItemDetail} | {ok: false; notFound: boolean};

/** One product for its own page (/menu/[slug]). */
export async function getMenuItem(slug: string): Promise<MenuItemResult> {
  try {
    const res = await fetch(`${serverApiBase()}/menu/items/${encodeURIComponent(slug)}`, {cache: 'no-store'});
    if (res.status === 404) return {ok: false, notFound: true};
    if (!res.ok) return {ok: false, notFound: false};
    const data = (await res.json()) as {item: MenuItemDetail};
    return {ok: true, item: data.item};
  } catch {
    return {ok: false, notFound: false};
  }
}
