/**
 * Order pricing. Mirrors frontend/lib/cart/pricing.ts (keep them in sync);
 * the backend result is the one that counts.
 *
 * Bundle deals ("any 3 for ₱220") apply across items that share the same
 * deal in the same menu section, so customers can mix scone flavors.
 */
export type PricedLine = {
  id: string;
  categoryId: string;
  unitPrice: number;
  quantity: number;
  deal: {quantity: number; price: number} | null;
};

export function priceLines(lines: PricedLine[]) {
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

  const groups = new Map<string, {deal: {quantity: number; price: number}; count: number; minUnit: number}>();
  for (const line of lines) {
    if (!line.deal) continue;
    const key = `${line.categoryId}|${line.deal.quantity}|${line.deal.price}`;
    const group = groups.get(key) ?? {deal: line.deal, count: 0, minUnit: line.unitPrice};
    group.count += line.quantity;
    group.minUnit = Math.min(group.minUnit, line.unitPrice);
    groups.set(key, group);
  }

  let discount = 0;
  for (const {deal, count, minUnit} of groups.values()) {
    const bundles = Math.floor(count / deal.quantity);
    const savingPerBundle = Math.max(0, deal.quantity * minUnit - deal.price);
    discount += bundles * savingPerBundle;
  }

  return {subtotal, discount, total: subtotal - discount};
}
