import Link from 'next/link';
import {Heart} from '@/components/brand/doodles';
import {ProductPhoto} from './product-photo';
import type {MenuItem} from '@/lib/api/menuApi';
import {formatPeso} from '@/lib/shop';
import {cn} from '@/lib/utils';

/**
 * Photo cards for limited-time drinks and bakes, like the shop's posters.
 * Each card opens the item's page.
 */
export function SpecialsShelf({items, className}: {items: MenuItem[]; className?: string}) {
  return (
    <ul className={cn('grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4', className)}>
      {items.map((item, index) => (
        <li key={item.id} className={index % 2 === 0 ? 'rotate-[-0.8deg]' : 'rotate-[0.8deg]'}>
          <Link
            href={`/menu/${item.slug}`}
            className={cn(
              'group block bg-linen p-2.5 pb-4 shadow-[0_14px_30px_-16px_rgb(43_36_32/0.55)] transition-transform hover:-translate-y-1 hover:rotate-0',
              !item.isAvailable && 'opacity-60'
            )}
          >
            <ProductPhoto
              url={item.imageUrl}
              alt=""
              sizes="(min-width: 1024px) 260px, 45vw"
              className="w-full rounded-none border-0"
            />
            <p className="mt-3 px-1 font-hand text-xl leading-tight text-ink group-hover:text-cocoa md:text-2xl">
              {item.name}
              {item.isFavorite && <Heart title="Customer favorite" className="ml-1.5 inline size-4 text-cocoa" />}
            </p>
            <p className="px-1 font-display text-2xl text-cocoa">
              {formatPeso(item.price)}
              {!item.isAvailable && <span className="ml-2 font-sans text-sm font-bold text-tomato">Sold out</span>}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
