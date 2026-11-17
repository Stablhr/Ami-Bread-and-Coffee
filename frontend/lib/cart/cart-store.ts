'use client';

import {useCallback, useSyncExternalStore} from 'react';

/**
 * The shopping cart, kept in this browser (localStorage) so it survives a
 * refresh. Prices here are only for display — the backend re-prices every
 * order from the live menu at checkout.
 */
export type CartLine = {
  menuItemId: string;
  slug: string;
  name: string;
  unitPrice: number;
  imageUrl: string | null;
  deal: {quantity: number; price: number} | null;
  /** Menu section, used to combine bundle deals (e.g. mixed scones). */
  categoryKey: string;
  quantity: number;
};

export const MAX_PER_ITEM = 30;
const STORAGE_KEY = 'ami-cart-v1';
const EMPTY: CartLine[] = [];

let cache: CartLine[] | null = null;
const listeners = new Set<() => void>();

function read(): CartLine[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? (parsed as CartLine[]).filter(line => line && line.menuItemId && line.quantity > 0) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(lines: CartLine[]) {
  cache = lines;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Private mode / storage full: the cart still works until the page closes.
  }
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep several open tabs in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

const clamp = (quantity: number) => Math.max(0, Math.min(MAX_PER_ITEM, Math.floor(quantity)));

export function useCart() {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY);

  const add = useCallback((line: Omit<CartLine, 'quantity'>, quantity = 1) => {
    const current = read();
    const existing = current.find(entry => entry.menuItemId === line.menuItemId);
    write(
      existing
        ? current.map(entry =>
            entry.menuItemId === line.menuItemId ? {...entry, ...line, quantity: clamp(entry.quantity + quantity)} : entry
          )
        : [...current, {...line, quantity: clamp(quantity)}]
    );
  }, []);

  const setQuantity = useCallback((menuItemId: string, quantity: number) => {
    const next = clamp(quantity);
    write(
      next === 0
        ? read().filter(entry => entry.menuItemId !== menuItemId)
        : read().map(entry => (entry.menuItemId === menuItemId ? {...entry, quantity: next} : entry))
    );
  }, []);

  const remove = useCallback((menuItemId: string) => {
    write(read().filter(entry => entry.menuItemId !== menuItemId));
  }, []);

  const clear = useCallback(() => write([]), []);

  /** Refresh names/prices/photos from the live menu (keeps quantities). */
  const sync = useCallback((updates: Map<string, Partial<CartLine>>) => {
    const current = read();
    let changed = false;
    const next = current.map(entry => {
      const update = updates.get(entry.menuItemId);
      if (!update) return entry;
      const merged = {...entry, ...update};
      if (JSON.stringify(merged) !== JSON.stringify(entry)) changed = true;
      return merged;
    });
    if (changed) write(next);
  }, []);

  const count = lines.reduce((sum, line) => sum + line.quantity, 0);

  return {lines, count, add, setQuantity, remove, clear, sync};
}
