import {formatPeso} from '@/lib/shop';

/** Subtotal / deal savings / total block, shared by cart, checkout and orders. */
export function OrderSummary({
  subtotal,
  discount,
  total,
  itemCount
}: {
  subtotal: number;
  discount: number;
  total: number;
  itemCount?: number;
}) {
  return (
    <dl className="space-y-2 text-lg">
      <div className="flex justify-between gap-4">
        <dt className="text-ink-soft">
          Subtotal{itemCount !== undefined && ` (${itemCount} item${itemCount === 1 ? '' : 's'})`}
        </dt>
        <dd className="tabular-nums">{formatPeso(subtotal)}</dd>
      </div>
      {discount > 0 && (
        <div className="flex justify-between gap-4 text-leaf">
          <dt>Bundle deal savings</dt>
          <dd className="tabular-nums">−{formatPeso(discount)}</dd>
        </div>
      )}
      <div className="flex justify-between gap-4 border-t-2 border-dashed border-ink/30 pt-3 text-xl font-extrabold">
        <dt>Total</dt>
        <dd className="font-display text-3xl font-normal text-cocoa tabular-nums">{formatPeso(total)}</dd>
      </div>
    </dl>
  );
}
