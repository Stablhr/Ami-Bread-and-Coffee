'use client';

import {useEffect, useMemo} from 'react';
import {useCart, type CartLine} from './cart-store';
import {priceLines} from './pricing';
import {useLiveMenu} from '@/lib/hooks/orders/useOrders';

export type CheckedLine = CartLine & {
  /** false when the item is sold out or no longer on the menu */
  available: boolean;
};

/**
 * The cart, checked against the live menu: prices, names and photos are
 * refreshed, and sold-out / removed items are flagged.
 */
export function useCheckedCart() {
  const cart = useCart();
  const {data: categories, isPending: menuLoading, isError: menuError} = useLiveMenu();
  const {sync} = cart;

  const live = useMemo(() => {
    if (!categories) return null;
    const map = new Map<string, {slug: string; name: string; unitPrice: number; imageUrl: string | null; deal: CartLine['deal']; categoryKey: string; isAvailable: boolean}>();
    for (const category of categories) {
      for (const item of category.items) {
        map.set(item.id, {
          slug: item.slug,
          name: item.name,
          unitPrice: item.price,
          imageUrl: item.imageUrl,
          deal: item.deal,
          categoryKey: category.slug,
          isAvailable: item.isAvailable
        });
      }
    }
    return map;
  }, [categories]);

  // Save refreshed details back into the stored cart.
  useEffect(() => {
    if (!live) return;
    const updates = new Map<string, Partial<CartLine>>();
    for (const [id, item] of live) {
      updates.set(id, {
        slug: item.slug,
        name: item.name,
        unitPrice: item.unitPrice,
        imageUrl: item.imageUrl,
        deal: item.deal,
        categoryKey: item.categoryKey
      });
    }
    sync(updates);
  }, [live, sync]);

  const lines: CheckedLine[] = cart.lines.map(line => ({
    ...line,
    available: live ? Boolean(live.get(line.menuItemId)?.isAvailable) : true
  }));
  const orderable = lines.filter(line => line.available);
  const totals = priceLines(orderable);
  const hasUnavailable = lines.some(line => !line.available);

  return {...cart, lines, orderable, totals, hasUnavailable, menuLoading, menuError};
}
