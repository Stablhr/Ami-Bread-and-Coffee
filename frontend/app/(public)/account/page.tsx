'use client';

import Link from 'next/link';
import {ChevronRight, ClipboardList} from 'lucide-react';
import {RequireRole} from '@/components/auth/require-role';
import {AccountDetails} from '@/components/account/account-details';
import {Heart} from '@/components/brand/doodles';
import {SectionHeading} from '@/components/brand/section-heading';
import {StatusBadge} from '@/components/orders/status-badge';
import {buttonVariants} from '@/components/ui/button';
import {useMyOrders} from '@/lib/hooks/orders/useOrders';
import {formatPickup} from '@/lib/pickup';
import {formatPeso} from '@/lib/shop';

export default function AccountPage() {
  return (
    <RequireRole role="user">
      {user => (
        <div className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-16">
          <SectionHeading
            as="h1"
            kicker="hello again"
            title={`Hi, ${user.firstName}!`}
            description="Your Ami account: your details and your orders."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-[1fr_1.4fr]">
            <AccountDetails user={user} />

            <YourOrders />
          </div>

          <p className="mt-12 text-center font-script text-lg text-cocoa">
            thank you for being here <Heart className="inline size-4" />
          </p>
        </div>
      )}
    </RequireRole>
  );
}

function YourOrders() {
  const {data, isPending, isError} = useMyOrders();
  const orders = data?.orders ?? [];

  return (
    <section aria-labelledby="orders-heading" className="rounded-[1.75rem] border-2 border-ink bg-linen p-6">
      <h2 id="orders-heading" className="flex items-center gap-2 text-2xl">
        <ClipboardList aria-hidden="true" className="size-6 text-cocoa" />
        Your orders
      </h2>

      {isPending ? (
        <p className="mt-4 text-ink-soft">Loading your orders…</p>
      ) : isError ? (
        <p className="mt-4 font-bold text-tomato">We couldn&apos;t load your orders. Please refresh the page.</p>
      ) : orders.length === 0 ? (
        <>
          <p className="mt-3 font-hand text-xl text-ink">No orders yet.</p>
          <p className="mt-1 text-ink-soft">Add something from the menu to your cart and check out for pickup.</p>
          <Link href="/menu" className={`${buttonVariants()} mt-5`}>
            Browse the menu
          </Link>
        </>
      ) : (
        <ul className="mt-4 divide-y-2 divide-dashed divide-ink/20">
          {orders.map(order => (
            <li key={order.id}>
              <Link href={`/orders/${order.id}`} className="group flex items-center gap-3 py-4">
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-bold group-hover:text-cocoa group-hover:underline">{order.orderNumber}</span>
                    <StatusBadge status={order.status} />
                  </span>
                  <span className="mt-1 block text-ink-soft">
                    Pickup {formatPickup(order.pickupAt)} · {order.items.reduce((n, i) => n + i.quantity, 0)} items ·{' '}
                    {formatPeso(order.total)}
                  </span>
                </span>
                <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-ink/40 group-hover:text-cocoa" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
