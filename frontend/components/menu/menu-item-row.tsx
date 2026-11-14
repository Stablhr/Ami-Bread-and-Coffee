import {Heart} from '@/components/brand/doodles';
import type {MenuItem} from '@/lib/api/menuApi';
import {formatPeso} from '@/lib/shop';
import {cn} from '@/lib/utils';

/** One line of the printed menu: name ········ price */
export function MenuItemRow({item}: {item: MenuItem}) {
  return (
    <li className={cn('py-2', !item.isAvailable && 'opacity-60')}>
      <div className="flex items-baseline gap-3">
        <span className="font-hand text-[1.4rem] leading-tight tracking-wide text-ink">
          {item.name}
          {item.isFavorite && (
            <Heart title="Customer favorite" className="ml-1.5 inline size-4 -translate-y-0.5 text-cocoa" />
          )}
        </span>
        <span className="menu-leader" aria-hidden="true" />
        <span className="font-hand text-[1.4rem] font-bold tabular-nums text-ink">
          <span className="sr-only">Price: </span>
          {formatPeso(item.price)}
        </span>
      </div>
      {item.description && <p className="mt-0.5 max-w-prose text-base text-ink-soft">{item.description}</p>}
      {!item.isAvailable && (
        <p className="mt-1 inline-block rounded-full border border-tomato px-2.5 text-sm font-bold text-tomato">
          Sold out today
        </p>
      )}
    </li>
  );
}
