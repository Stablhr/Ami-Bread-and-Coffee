import {BrushTag} from '@/components/brand/brush-tag';
import {InkUnderline} from '@/components/brand/doodles';
import type {MenuCategory} from '@/lib/api/menuApi';
import {formatPeso} from '@/lib/shop';
import {MenuItemRow} from './menu-item-row';

/** A category heading with its ruled line and item rows, as on the printed menu. */
export function MenuCategoryBlock({category}: {category: MenuCategory}) {
  const deal = category.items.find(item => item.deal)?.deal;

  return (
    <section aria-labelledby={`cat-${category.slug}`} id={category.slug} className="break-inside-avoid">
      <h2 id={`cat-${category.slug}`} className="text-3xl md:text-[2.1rem]">
        {category.name}
      </h2>
      <InkUnderline className="mt-1.5 text-ink/80" />
      <ul className="mt-2">
        {category.items.map(item => (
          <MenuItemRow key={item.id} item={item} />
        ))}
      </ul>
      {deal && (
        <div className="mt-2 flex justify-center">
          <BrushTag>
            Any {deal.quantity} for {formatPeso(deal.price)}
          </BrushTag>
        </div>
      )}
      {category.note && !deal && (
        <p className="mt-2 text-center font-hand text-lg text-ink-soft">{category.note}</p>
      )}
    </section>
  );
}
