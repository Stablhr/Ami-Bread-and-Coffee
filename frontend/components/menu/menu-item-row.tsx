import Image from 'next/image';
import Link from 'next/link';
import {ChevronRight} from 'lucide-react';
import {Heart} from '@/components/brand/doodles';
import {QuickAdd} from '@/components/cart/add-to-cart';
import type {MenuItem} from '@/lib/api/menuApi';
import {isUploadedImage, resolveImageUrl} from '@/lib/images';
import {formatPeso} from '@/lib/shop';
import {cn} from '@/lib/utils';

/**
 * One line of the printed menu: name ········ price.
 * The whole line opens the item's page (photo, ingredients, allergens).
 */
export function MenuItemRow({item, categoryKey}: {item: MenuItem; categoryKey: string}) {
  const photo = resolveImageUrl(item.imageUrl);

  return (
    <li className={cn('flex items-center gap-2', !item.isAvailable && 'opacity-60')}>
      <Link
        href={`/menu/${item.slug}`}
        className="group -ml-2 flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-paper-deep/70"
      >
        {photo && (
          <span className="relative size-11 shrink-0 overflow-hidden rounded-full border-2 border-ink/70 bg-paper-deep">
            <Image
              src={photo}
              alt=""
              fill
              sizes="44px"
              unoptimized={isUploadedImage(item.imageUrl)}
              className="object-cover"
            />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-3">
            <span className="font-hand text-[1.4rem] leading-tight tracking-wide text-ink underline-offset-4 group-hover:text-cocoa group-hover:underline">
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
          </span>
          {item.description && (
            <span className="mt-0.5 line-clamp-1 block max-w-prose text-base text-ink-soft">{item.description}</span>
          )}
          {!item.isAvailable && (
            <span className="mt-1 inline-block rounded-full border border-tomato px-2.5 text-sm font-bold text-tomato">
              Sold out today
            </span>
          )}
        </span>
        <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-ink/40 group-hover:text-cocoa" />
      </Link>
      <QuickAdd item={item} categoryKey={categoryKey} />
    </li>
  );
}
