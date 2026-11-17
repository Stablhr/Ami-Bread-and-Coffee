import type {Metadata} from 'next';
import {Asterisk, Heart, OpenCircle, Swoosh} from '@/components/brand/doodles';
import {LogoGirl, Wordmark} from '@/components/brand/logo';
import {MenuCategoryBlock} from '@/components/menu/menu-category-block';
import {MenuUnavailable} from '@/components/menu/menu-unavailable';
import {SamplerBoxCard} from '@/components/menu/sampler-box-card';
import {SpecialsShelf} from '@/components/menu/specials-shelf';
import {GuestOrderNotice} from '@/components/cart/guest-order-notice';
import {getMenu, type MenuCategory} from '@/lib/api/menuApi';
import {SHOP} from '@/lib/shop';

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Sourdough breads, scones, toast, focaccia, coffee, pasta and snacks at Ami Bread & Coffee.'
};

/** Limited-time items, shown as photo cards above the printed menus. */
const SPECIALS_SLUG = 'seasonal-specials';

/** The two printed menus: the bakery sheet and the café sheet. */
const BAKERY_SLUGS = ['sourdough-breads', 'sampler-box', 'sourdough-scones', 'sourdough-toast', 'sourdough-focaccia'];

export default async function MenuPage() {
  const menu = await getMenu();

  return (
    <div className="relative overflow-hidden">
      <Swoosh className="pointer-events-none absolute -right-20 top-0 size-80 text-ink/[0.08]" />

      <div className="mx-auto max-w-6xl px-4 pt-12 md:px-8 md:pt-16">
        <div className="flex flex-col items-center text-center">
          <LogoGirl className="w-16" priority />
          <h1 className="sr-only">Our menu</h1>
          <Wordmark className="mt-3 w-44 md:w-56" />
          <p className="mt-3 font-script text-lg text-ink-soft">bread &amp; coffee</p>
          <p className="mt-6 max-w-xl text-lg text-ink-soft">
            Everything we bake and brew, with prices in pesos.{' '}
            <span className="whitespace-nowrap">
              <Heart className="inline size-4 -translate-y-0.5 text-cocoa" /> = customer favorite.
            </span>
          </p>
        </div>

        {menu.ok && menu.categories.length > 0 ? (
          <MenuSheets categories={menu.categories} />
        ) : (
          <div className="pb-20">
            <MenuUnavailable />
          </div>
        )}
      </div>
    </div>
  );
}

function MenuSheets({categories}: {categories: MenuCategory[]}) {
  const specials = categories.find(c => c.slug === SPECIALS_SLUG);
  const bakery = categories.filter(c => BAKERY_SLUGS.includes(c.slug));
  const cafe = categories.filter(c => !BAKERY_SLUGS.includes(c.slug) && c.slug !== SPECIALS_SLUG);

  return (
    <>
      {/* Jump links */}
      <nav aria-label="Menu sections" className="mt-8 py-3">
        <ul className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:justify-center">
          {categories.map(category => (
            <li key={category.slug} className="shrink-0">
              <a
                href={`#${category.slug}`}
                className="inline-flex min-h-11 items-center rounded-full border-2 border-ink bg-linen px-4 font-hand text-lg text-ink hover:bg-cocoa hover:text-cream"
              >
                {category.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-4 text-center text-ink-soft">Tap any item to see its photo, ingredients and allergens.</p>
      <GuestOrderNotice className="mt-4" />

      <div className="space-y-12 py-10 md:py-14">
        {specials && specials.items.length > 0 && (
          <section id={specials.slug} aria-labelledby="specials-heading" className="scroll-mt-28">
            <div className="text-center">
              <p className="font-script text-xl text-cocoa">just for now</p>
              <h2 id="specials-heading" className="mt-3 text-4xl">
                {specials.name}
              </h2>
              {specials.note && <p className="mt-2 font-hand text-xl text-ink-soft">{specials.note}</p>}
            </div>
            <SpecialsShelf items={specials.items} className="mt-8" />
          </section>
        )}
        {bakery.length > 0 && (
          <MenuSheet title="From the oven" categories={bakery} />
        )}
        {cafe.length > 0 && (
          <MenuSheet title="From the café" categories={cafe} />
        )}
      </div>
    </>
  );
}

function MenuSheet({title, categories}: {title: string; categories: MenuCategory[]}) {
  return (
    <section
      aria-label={title}
      className="relative rounded-[2rem] border-2 border-ink/80 bg-linen px-5 py-10 shadow-[0_2px_0_0_var(--paper-deep),0_30px_60px_-30px_rgb(43_36_32/0.45)] md:px-12 md:py-14"
    >
      <Asterisk className="absolute right-6 top-6 size-9 text-ink/80" />
      <OpenCircle className="absolute right-16 top-16 size-3.5 text-ink/70" />

      <p className="text-center font-script text-xl text-cocoa">{title}</p>

      <div className="mt-8 gap-x-14 md:columns-2 [&>*]:mb-10">
        {categories.map(category =>
          category.slug === 'sampler-box' && category.items[0] ? (
            <SamplerBoxCard
              key={category.slug}
              price={category.items[0].price}
              href={`/menu/${category.items[0].slug}`}
            />
          ) : (
            <MenuCategoryBlock key={category.slug} category={category} />
          )
        )}
      </div>

      <div className="mt-2 flex flex-col items-center justify-between gap-4 border-t-2 border-ink/70 pt-6 text-center md:flex-row md:text-left">
        <div className="font-hand text-lg leading-snug text-ink">
          <p className="tracking-[0.16em]">OPEN DAILY</p>
          <p>7:00 AM – 9:00 PM</p>
          <p className="text-ink-soft">{SHOP.address.line1}, {SHOP.address.line2}</p>
        </div>
        <p className="font-script text-lg text-ink">
          fresh from home <Heart className="inline size-4" />
        </p>
      </div>
    </section>
  );
}
