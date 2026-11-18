'use client';

import {Suspense} from 'react';
import Link from 'next/link';
import {useParams, useSearchParams} from 'next/navigation';
import {Clock, MapPin, PartyPopper} from 'lucide-react';
import {FormMessage} from '@/components/auth/form-bits';
import {RequireRole} from '@/components/auth/require-role';
import {Heart} from '@/components/brand/doodles';
import {OrderSummary} from '@/components/cart/order-summary';
import {PageLoading} from '@/components/layout/page-loading';
import {StatusBadge, StatusTimeline} from '@/components/orders/status-badge';
import {buttonVariants} from '@/components/ui/button';
import {getFriendlyErrorMessage} from '@/lib/api/getFriendlyErrorMessage';
import {useMyOrder} from '@/lib/hooks/orders/useOrders';
import {formatPickup, formatPlacedAt} from '@/lib/pickup';
import {formatPeso, SHOP} from '@/lib/shop';

export default function OrderPage() {
  return (
    <RequireRole role="user">
      {() => (
        <Suspense fallback={<PageLoading />}>
          <OrderDetails />
        </Suspense>
      )}
    </RequireRole>
  );
}

function OrderDetails() {
  const {id} = useParams<{id: string}>();
  const justPlaced = useSearchParams().get('placed') === '1';
  const {data: order, isPending, isError, error} = useMyOrder(id);

  if (isPending) return <PageLoading label="Loading your order…" />;
  if (isError || !order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <FormMessage tone="error">{getFriendlyErrorMessage(error, 'We could not load this order.')}</FormMessage>
        <Link href="/account" className={`${buttonVariants({variant: 'outline'})} mt-6`}>
          Your orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      {justPlaced && (
        <div role="status" className="mb-8 rounded-[1.75rem] border-[3px] border-leaf bg-leaf/10 p-6 text-center">
          <PartyPopper aria-hidden="true" className="mx-auto size-10 text-leaf" />
          <p className="mt-3 font-display text-3xl text-ink">Thank you, your order is in!</p>
          <p className="mt-2 text-lg text-ink-soft">
            We&apos;ve sent it to the shop. Keep this page open to see when it&apos;s ready.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-hand text-lg tracking-[0.14em] text-ink-soft uppercase">Order</p>
          <h1 className="text-4xl">{order.orderNumber}</h1>
          <p className="mt-1 text-ink-soft">Placed {formatPlacedAt(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} className="text-base" />
      </div>

      <section className="mt-8 rounded-[1.75rem] border-2 border-ink bg-linen p-6">
        {order.status === 'cancelled' ? (
          <p className="text-lg font-bold text-tomato">
            This order was cancelled. If you weren&apos;t expecting this, please call us at {SHOP.phoneDisplay}.
          </p>
        ) : (
          <StatusTimeline status={order.status} />
        )}
        <dl className="mt-6 grid gap-4 border-t-2 border-dashed border-ink/20 pt-5 sm:grid-cols-2">
          <div className="flex gap-3">
            <dt>
              <Clock aria-hidden="true" className="size-6 text-cocoa" />
              <span className="sr-only">Pickup time</span>
            </dt>
            <dd>
              <span className="block font-bold">Pickup</span>
              {formatPickup(order.pickupAt)}
            </dd>
          </div>
          <div className="flex gap-3">
            <dt>
              <MapPin aria-hidden="true" className="size-6 text-cocoa" />
              <span className="sr-only">Where</span>
            </dt>
            <dd>
              <span className="block font-bold">{SHOP.name}</span>
              {SHOP.address.short}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-[1.75rem] border-2 border-ink bg-linen p-6">
        <h2 className="text-2xl">Items</h2>
        <ul className="mt-4 space-y-2 text-lg">
          {order.items.map(item => (
            <li key={item.menuItemId} className="flex justify-between gap-3">
              <span>
                {item.quantity} × {item.name}
              </span>
              <span className="tabular-nums">{formatPeso(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 border-t-2 border-ink/20 pt-4">
          <OrderSummary subtotal={order.subtotal} discount={order.discount} total={order.total} />
        </div>
        <p className="mt-4 text-ink-soft">Pay at the counter when you pick up.</p>
        {order.notes && (
          <p className="mt-3">
            <span className="font-bold">Your note:</span> {order.notes}
          </p>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/account" className={buttonVariants({variant: 'outline'})}>
          All your orders
        </Link>
        <Link href="/menu" className={buttonVariants({variant: 'ghost'})}>
          Back to the menu
        </Link>
      </div>
      <p className="mt-10 text-center font-script text-lg text-cocoa">
        thank you <Heart className="inline size-4" />
      </p>
    </div>
  );
}
