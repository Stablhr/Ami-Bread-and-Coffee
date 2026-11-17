'use client';

import Link from 'next/link';
import {ArrowRight, ShoppingBasket, Trash2} from 'lucide-react';
import {OrderSummary} from '@/components/cart/order-summary';
import {QuantityStepper} from '@/components/cart/quantity-stepper';
import {SectionHeading} from '@/components/brand/section-heading';
import {ProductPhoto} from '@/components/menu/product-photo';
import {buttonVariants} from '@/components/ui/button';
import {MAX_PER_ITEM} from '@/lib/cart/cart-store';
import {useCheckedCart} from '@/lib/cart/use-checked-cart';
import {formatPeso} from '@/lib/shop';
import {cn} from '@/lib/utils';

export default function CartPage() {
  const {lines, setQuantity, remove, totals, hasUnavailable, count} = useCheckedCart();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16">
      <SectionHeading as="h1" kicker="almost yours" title="Your cart" />

      {lines.length === 0 ? (
        <div className="mt-10 rounded-[1.75rem] border-2 border-dashed border-ink/50 bg-linen p-8 text-center">
          <ShoppingBasket aria-hidden="true" className="mx-auto size-12 text-cocoa" />
          <p className="mt-4 font-hand text-2xl">Your cart is empty.</p>
          <p className="mt-1 text-ink-soft">Browse the menu and tap the + next to anything you like.</p>
          <Link href="/menu" className={`${buttonVariants({size: 'lg'})} mt-6`}>
            Browse the menu
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
          <ul className="divide-y-2 divide-dashed divide-ink/20 rounded-[1.75rem] border-2 border-ink bg-linen px-5">
            {lines.map(line => (
              <li key={line.menuItemId} className={cn('flex flex-wrap items-center gap-4 py-5', !line.available && 'opacity-70')}>
                <ProductPhoto url={line.imageUrl} alt="" sizes="80px" className="w-20 shrink-0" />
                <div className="min-w-[9rem] flex-1">
                  <Link href={`/menu/${line.slug}`} className="font-hand text-2xl leading-tight text-ink hover:text-cocoa hover:underline">
                    {line.name}
                  </Link>
                  <p className="text-ink-soft">
                    {formatPeso(line.unitPrice)} each
                    {line.deal && ` · any ${line.deal.quantity} for ${formatPeso(line.deal.price)}`}
                  </p>
                  {!line.available && (
                    <p className="mt-1 font-bold text-tomato">Sold out right now. Please remove it to check out.</p>
                  )}
                </div>
                <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
                  {line.available ? (
                    <QuantityStepper
                      size="sm"
                      value={line.quantity}
                      max={MAX_PER_ITEM}
                      onChange={next => setQuantity(line.menuItemId, next)}
                      label={`Quantity of ${line.name}`}
                    />
                  ) : (
                    <span />
                  )}
                  <p className="min-w-20 text-right text-lg font-bold tabular-nums">
                    {formatPeso(line.unitPrice * line.quantity)}
                  </p>
                  <button
                    type="button"
                    onClick={() => remove(line.menuItemId)}
                    className="flex size-11 items-center justify-center rounded-full text-ink-soft hover:bg-tomato/10 hover:text-tomato"
                    aria-label={`Remove ${line.name} from cart`}
                  >
                    <Trash2 aria-hidden="true" className="size-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="rounded-[1.75rem] border-[3px] border-ink bg-linen p-6 shadow-[6px_6px_0_0_var(--ink)] lg:sticky lg:top-40">
            <h2 className="text-2xl">Order summary</h2>
            <div className="mt-5">
              <OrderSummary {...totals} itemCount={count} />
            </div>
            {hasUnavailable && (
              <p className="mt-4 font-bold text-tomato">Remove sold-out items to continue.</p>
            )}
            <Link
              href="/checkout"
              aria-disabled={hasUnavailable}
              className={cn(
                buttonVariants({size: 'lg'}),
                'mt-6 w-full',
                hasUnavailable && 'pointer-events-none opacity-50'
              )}
            >
              Checkout
              <ArrowRight aria-hidden="true" />
            </Link>
            <p className="mt-4 text-sm text-ink-soft">
              Pick-up only for now. You&apos;ll choose a pickup time and pay when you collect your order.
            </p>
            <Link href="/menu" className="mt-3 inline-block font-bold text-cocoa underline underline-offset-4">
              Keep browsing
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
