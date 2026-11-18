import {Ban, Check, ChefHat, ClipboardCheck, ShoppingBag} from 'lucide-react';
import type {OrderStatus} from '@/lib/api/ordersApi';
import {STATUS_BADGE, STATUS_LABEL} from '@/lib/orders';
import {cn} from '@/lib/utils';

const ICON: Record<OrderStatus, typeof Check> = {
  received: ClipboardCheck,
  preparing: ChefHat,
  ready: ShoppingBag,
  completed: Check,
  cancelled: Ban
};

/** Colored pill with an icon AND a word, so status never relies on color alone. */
export function StatusBadge({status, className}: {status: OrderStatus; className?: string}) {
  const Icon = ICON[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-sm font-extrabold text-white',
        STATUS_BADGE[status],
        className
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
      {STATUS_LABEL[status]}
    </span>
  );
}

const STEPS: OrderStatus[] = ['received', 'preparing', 'ready', 'completed'];

/** Received → Being prepared → Ready for pickup → Picked up */
export function StatusTimeline({status}: {status: OrderStatus}) {
  if (status === 'cancelled') return null;
  const current = STEPS.indexOf(status);
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Order progress">
      {STEPS.map((step, index) => {
        const done = index <= current;
        return (
          <li key={step} className="flex flex-col items-center gap-2 text-center" aria-current={index === current ? 'step' : undefined}>
            <span
              className={cn(
                'flex size-10 items-center justify-center rounded-full border-2 font-bold',
                done ? 'border-cocoa bg-cocoa text-cream' : 'border-ink/30 bg-linen text-ink-soft'
              )}
            >
              {done ? <Check aria-hidden="true" className="size-5" /> : index + 1}
            </span>
            <span className={cn('text-sm leading-tight', done ? 'font-bold text-ink' : 'text-ink-soft')}>
              {STATUS_LABEL[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
