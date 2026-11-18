/**
 * Cart pricing. Mirrors backend/api/utils/pricing.ts (keep them in sync).
 * The backend recalculates on checkout; this is for showing totals.
 *
 * Bundle deals ("any 3 for ₱220") apply across items that share the same
 * deal in the same menu section, so customers can mix scone flavors.
 */
export type PricedLine = {
  categoryKey: string;
  unitPrice: number;
  quantity: number;
  deal: {quantity: number; price: number} | null;
};

export function priceLines(lines: PricedLine[]) {
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

  const groups = new Map<string, {deal: {quantity: number; price: number}; count: number; minUnit: number}>();
  for (const line of lines) {
    if (!line.deal) continue;
    const key = `${line.categoryKey}|${line.deal.quantity}|${line.deal.price}`;
    const group = groups.get(key) ?? {deal: line.deal, count: 0, minUnit: line.unitPrice};
    group.count += line.quantity;
    group.minUnit = Math.min(group.minUnit, line.unitPrice);
    groups.set(key, group);
  }

  let discount = 0;
  for (const {deal, count, minUnit} of groups.values()) {
    discount += Math.floor(count / deal.quantity) * Math.max(0, deal.quantity * minUnit - deal.price);
  }

  return {subtotal, discount, total: subtotal - discount};
}
