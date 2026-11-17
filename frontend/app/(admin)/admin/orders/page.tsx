'use client';

import {useMemo, useState} from 'react';
import {Clock, Mail, MessageSquareText, Phone, RefreshCw} from 'lucide-react';
import {FormMessage} from '@/components/auth/form-bits';
import {PageLoading} from '@/components/layout/page-loading';
import {StatusBadge} from '@/components/orders/status-badge';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import type {AdminOrderFilter, Order, OrderStatus} from '@/lib/api/ordersApi';
import {getFriendlyErrorMessage} from '@/lib/api/getFriendlyErrorMessage';
import {useAdminOrders, useUpdateOrderStatus} from '@/lib/hooks/orders/useOrders';
import {formatPhone, STATUS_ACTION} from '@/lib/orders';
import {formatPickup, formatPlacedAt} from '@/lib/pickup';
import {formatPeso} from '@/lib/shop';
import {cn} from '@/lib/utils';

const TABS: {value: AdminOrderFilter; label: string}[] = [
  {value: 'active', label: 'To do'},
  {value: 'completed', label: 'Picked up'},
  {value: 'cancelled', label: 'Cancelled'},
  {value: 'all', label: 'All'}
];

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<AdminOrderFilter>('active');
  const {data, isPending, isError, error, refetch, isFetching, dataUpdatedAt} = useAdminOrders(filter);
  const update = useUpdateOrderStatus();
  const [toCancel, setToCancel] = useState<Order | null>(null);
  const [cancelName, setCancelName] = useState('');

  const counts = data?.counts;
  const tabCount = (tab: AdminOrderFilter) => {
    if (!counts) return null;
    if (tab === 'active') return counts.received + counts.preparing + counts.ready;
    if (tab === 'completed') return counts.completed;
    if (tab === 'cancelled') return counts.cancelled;
    return Object.values(counts).reduce((a, b) => a + b, 0);
  };

  // To-do orders: soonest pickup first. Others: newest first (as sent).
  const orders = useMemo(() => {
    const list = data?.orders ?? [];
    return filter === 'active'
      ? [...list].sort((a, b) => new Date(a.pickupAt).getTime() - new Date(b.pickupAt).getTime())
      : list;
  }, [data, filter]);

  const move = (order: Order, status: OrderStatus) => {
    if (status === 'cancelled') {
      update.reset();
      setCancelName(order.orderNumber);
      setToCancel(order);
      return;
    }
    update.mutate({id: order.id, status});
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl font-extrabold">Orders</h1>
          <p className="mt-1 text-lg text-ink-soft">
            New orders appear here automatically.
            {dataUpdatedAt > 0 && ` Last checked ${new Date(dataUpdatedAt).toLocaleTimeString('en-PH', {hour: 'numeric', minute: '2-digit', second: '2-digit'})}.`}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw aria-hidden="true" className={cn(isFetching && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      <div role="tablist" aria-label="Order filter" className="mt-6 flex flex-wrap gap-2">
        {TABS.map(tab => {
          const selected = filter === tab.value;
          const count = tabCount(tab.value);
          return (
            <button
              key={tab.value}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setFilter(tab.value)}
              className={cn(
                'inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 font-bold',
                selected ? 'border-ink bg-ink text-cream' : 'border-ink/40 bg-linen text-ink hover:border-ink'
              )}
            >
              {tab.label}
              {count !== null && (
                <span className={cn('rounded-full px-2 text-sm', selected ? 'bg-cream text-ink' : 'bg-paper-deep')}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {update.isError && !toCancel && (
        <div className="mt-6">
          <FormMessage tone="error">{getFriendlyErrorMessage(update.error, 'Could not update the order.')}</FormMessage>
        </div>
      )}

      <div className="mt-6">
        {isPending ? (
          <PageLoading label="Loading orders…" />
        ) : isError ? (
          <FormMessage tone="error">{getFriendlyErrorMessage(error, 'Could not load orders.')}</FormMessage>
        ) : orders.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-ink/40 bg-linen p-8 text-center text-lg text-ink-soft">
            {filter === 'active' ? 'No orders to prepare right now.' : 'No orders here yet.'}
          </p>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                busy={update.isPending && update.variables?.id === order.id}
                onMove={status => move(order, status)}
              />
            ))}
          </ul>
        )}
      </div>

      <AlertDialog open={toCancel !== null} onOpenChange={open => !open && setToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel order {cancelName}?</AlertDialogTitle>
            <AlertDialogDescription>
              The customer will see it as cancelled. Please call them to let them know why. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {update.isError && (
            <p role="alert" className="font-bold text-tomato">
              {getFriendlyErrorMessage(update.error, 'Could not cancel the order.')}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={update.isPending}>Keep order</AlertDialogCancel>
            <Button
              className="border-tomato bg-tomato hover:bg-tomato/90"
              disabled={update.isPending}
              onClick={() =>
                toCancel &&
                update.mutate({id: toCancel.id, status: 'cancelled'}, {onSuccess: () => setToCancel(null)})
              }
            >
              {update.isPending ? 'Cancelling…' : 'Cancel order'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function OrderCard({order, busy, onMove}: {order: Order; busy: boolean; onMove: (status: OrderStatus) => void}) {
  const itemCount = order.items.reduce((n, item) => n + item.quantity, 0);
  const forward = order.nextStatuses.filter(status => status !== 'cancelled');
  const canCancel = order.nextStatuses.includes('cancelled');

  return (
    <li
      className={cn(
        'flex flex-col rounded-2xl border-2 bg-linen p-5',
        order.status === 'received' ? 'border-[#1d4ed8] shadow-[0_0_0_3px_rgb(29_78_216/0.15)]' : 'border-ink/80'
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-2 font-sans text-xl font-extrabold">
            {order.orderNumber}
            {order.status === 'received' && (
              <span className="rounded-full bg-[#1d4ed8] px-2 py-0.5 text-xs font-extrabold text-white">NEW</span>
            )}
          </p>
          <p className="text-sm text-ink-soft">Placed {formatPlacedAt(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <p className="mt-4 flex items-center gap-2 rounded-xl bg-paper-deep px-3 py-2 text-lg font-bold">
        <Clock aria-hidden="true" className="size-5 text-cocoa" />
        Pickup {formatPickup(order.pickupAt)}
      </p>

      <div className="mt-4">
        <p className="text-lg font-bold">{order.customer.name}</p>
        <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-ink-soft">
          <a href={`tel:${order.customer.phone}`} className="inline-flex items-center gap-1.5 font-bold text-cocoa underline underline-offset-4">
            <Phone aria-hidden="true" className="size-4" />
            {formatPhone(order.customer.phone)}
          </a>
          <a href={`mailto:${order.customer.email}`} className="inline-flex items-center gap-1.5 break-all hover:text-ink">
            <Mail aria-hidden="true" className="size-4" />
            {order.customer.email}
          </a>
        </p>
      </div>

      <ul className="mt-4 space-y-1 border-t-2 border-dashed border-ink/20 pt-3">
        {order.items.map(item => (
          <li key={item.menuItemId} className="flex justify-between gap-3">
            <span>
              <span className="font-bold">{item.quantity} ×</span> {item.name}
            </span>
            <span className="tabular-nums text-ink-soft">{formatPeso(item.lineTotal)}</span>
          </li>
        ))}
      </ul>
      {order.discount > 0 && (
        <p className="mt-1 flex justify-between text-leaf">
          <span>Bundle deal</span>
          <span>−{formatPeso(order.discount)}</span>
        </p>
      )}
      <p className="mt-2 flex justify-between border-t-2 border-ink/20 pt-2 text-lg font-extrabold">
        <span>
          Total · {itemCount} item{itemCount === 1 ? '' : 's'}
        </span>
        <span className="tabular-nums">{formatPeso(order.total)}</span>
      </p>
      <p className="text-sm text-ink-soft">Pay at pickup</p>

      {order.notes && (
        <p className="mt-3 flex gap-2 rounded-xl border-2 border-honey bg-honey/10 px-3 py-2">
          <MessageSquareText aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-cocoa" />
          <span>
            <span className="font-bold">Note:</span> {order.notes}
          </span>
        </p>
      )}

      {(forward.length > 0 || canCancel) && (
        <div className="mt-5 flex flex-wrap items-center gap-2 pt-1">
          {forward.map(status => (
            <Button key={status} disabled={busy} onClick={() => onMove(status)}>
              {busy ? 'Saving…' : STATUS_ACTION[status]}
            </Button>
          ))}
          {canCancel && (
            <Button variant="destructive" size="sm" disabled={busy} onClick={() => onMove('cancelled')} className="ml-auto">
              Cancel
            </Button>
          )}
        </div>
      )}
    </li>
  );
}
