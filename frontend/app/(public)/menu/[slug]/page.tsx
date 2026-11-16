import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowLeft, MessageCircle, Phone, TriangleAlert} from 'lucide-react';
import {BrushTag} from '@/components/brand/brush-tag';
import {Asterisk, Heart, InkUnderline} from '@/components/brand/doodles';
import {LogoGirl} from '@/components/brand/logo';
import {MenuUnavailable} from '@/components/menu/menu-unavailable';
import {ProductPhoto} from '@/components/menu/product-photo';
import {buttonVariants} from '@/components/ui/button';
import {getMenu, getMenuItem, type MenuItemDetail} from '@/lib/api/menuApi';
import {isUploadedImage, resolveImageUrl} from '@/lib/images';
import {formatPeso, SHOP} from '@/lib/shop';

type PageProps = {params: Promise<{slug: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params;
  const result = await getMenuItem(slug);
  if (!result.ok) return {title: 'Menu'};
  const {item} = result;
  return {
    title: item.name,
    description: item.description || `${item.name}, ${formatPeso(item.price)} at ${SHOP.name}.`
  };
}

export default async function MenuItemPage({params}: PageProps) {
  const {slug} = await params;
  const [result, menu] = await Promise.all([getMenuItem(slug), getMenu()]);

  if (!result.ok) {
    if (result.notFound) notFound();
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 md:px-8">
        <BackToMenu />
        <MenuUnavailable />
      </div>
    );
  }

  const {item} = result;
  const others = menu.ok
    ? (menu.categories.find(c => c.slug === item.category.slug)?.items ?? []).filter(i => i.id !== item.id)
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-14">
      <BackToMenu />

      <article className="mt-6 grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-start">
        <ItemPhoto item={item} />

        <div>
          <p className="font-hand text-lg tracking-[0.14em] text-ink-soft uppercase">{item.category.name}</p>
          <h1 className="mt-2 text-4xl md:text-5xl">
            {item.name}
            {item.isFavorite && <Heart title="Customer favorite" className="ml-3 inline size-6 -translate-y-1 text-cocoa" />}
          </h1>
          <InkUnderline className="mt-3 w-48 text-ink/70" />

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <p className="font-display text-4xl text-cocoa">
              <span className="sr-only">Price: </span>
              {formatPeso(item.price)}
            </p>
            {item.deal && (
              <BrushTag>
                Any {item.deal.quantity} for {formatPeso(item.deal.price)}
              </BrushTag>
            )}
          </div>

          {!item.isAvailable && (
            <p className="mt-4 inline-block rounded-full border-2 border-tomato px-3 py-1 font-bold text-tomato">
              Sold out today. Check back tomorrow!
            </p>
          )}

          {item.description && <p className="mt-5 text-lg text-ink">{item.description}</p>}
          {item.category.note && <p className="mt-3 font-hand text-xl text-ink-soft">{item.category.note}</p>}

          <section aria-labelledby="ingredients-heading" className="mt-8">
            <h2 id="ingredients-heading" className="text-2xl">
              Ingredients
            </h2>
            {item.ingredients.length > 0 ? (
              <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {item.ingredients.map(ingredient => (
                  <li key={ingredient} className="flex items-center gap-2.5 font-hand text-xl text-ink">
                    <Asterisk className="size-4 shrink-0 text-cocoa" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-ink-soft">Ask us what goes into this one. We&apos;re happy to tell you.</p>
            )}
          </section>

          <section
            aria-labelledby="allergens-heading"
            className="mt-8 rounded-2xl border-4 border-double border-tomato/80 bg-linen p-5"
          >
            <h2 id="allergens-heading" className="flex items-center gap-2 font-sans text-lg font-extrabold text-tomato">
              <TriangleAlert aria-hidden="true" className="size-5" />
              Allergens
            </h2>
            {item.allergens.length > 0 ? (
              <p className="mt-2 text-lg text-ink">
                Contains: <strong>{item.allergens.join(', ')}</strong>.
              </p>
            ) : (
              <p className="mt-2 text-lg text-ink">No common allergens listed.</p>
            )}
            <p className="mt-2 text-ink-soft">
              Everything is made in the same small kitchen. If you have a food allergy, please message us before
              ordering.
            </p>
          </section>

          <div className="mt-8 rounded-2xl border-2 border-dashed border-ink/50 p-5">
            <p className="font-hand text-2xl text-ink">Want this one?</p>
            <p className="mt-1 text-ink-soft">
              Online ordering is coming soon. For now, message us on Facebook or give us a call.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={SHOP.facebookUrl} target="_blank" rel="noreferrer" className={buttonVariants()}>
                <MessageCircle aria-hidden="true" />
                Message us
              </a>
              <a href={SHOP.phoneHref} className={buttonVariants({variant: 'outline'})}>
                <Phone aria-hidden="true" />
                Call {SHOP.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </article>

      {others.length > 0 && (
        <section aria-labelledby="more-heading" className="mt-16">
          <h2 id="more-heading" className="text-3xl">
            More {item.category.name.toLowerCase()}
          </h2>
          <InkUnderline className="mt-2 w-40 text-ink/70" />
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {others.slice(0, 8).map(other => (
              <li key={other.id}>
                <Link
                  href={`/menu/${other.slug}`}
                  className="group block rounded-2xl border-2 border-ink bg-linen p-3 transition-transform hover:-translate-y-1"
                >
                  <ProductPhoto url={other.imageUrl} alt="" sizes="(min-width: 1024px) 220px, 45vw" className="w-full" />
                  <p className="mt-2 font-hand text-xl leading-tight text-ink group-hover:text-cocoa">{other.name}</p>
                  <p className="font-display text-xl text-cocoa">{formatPeso(other.price)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function BackToMenu() {
  return (
    <Link
      href="/menu"
      className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 font-bold text-ink-soft hover:text-ink"
    >
      <ArrowLeft aria-hidden="true" className="size-5" />
      Back to the menu
    </Link>
  );
}

/** Polaroid-style photo, or the logo on paper when there's no photo yet. */
function ItemPhoto({item}: {item: MenuItemDetail}) {
  const src = resolveImageUrl(item.imageUrl);
  return (
    <figure className="relative mx-auto w-full max-w-md -rotate-1 bg-linen p-3 pb-12 shadow-[0_20px_50px_-24px_rgb(43_36_32/0.6)] md:sticky md:top-40">
      <span aria-hidden="true" className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 rotate-2 bg-paper-deep/90 shadow-sm" />
      <div className="relative aspect-square overflow-hidden bg-paper-deep">
        {src ? (
          <Image
            src={src}
            alt={item.name}
            fill
            priority
            sizes="(min-width: 768px) 420px, 90vw"
            unoptimized={isUploadedImage(item.imageUrl)}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <LogoGirl className="w-24 opacity-60" />
            <p className="font-hand text-xl text-ink-soft">Photo coming soon</p>
          </div>
        )}
      </div>
      <figcaption className="absolute inset-x-0 bottom-3 text-center font-hand text-xl text-ink">
        fresh from home <Heart className="inline size-4 text-cocoa" />
      </figcaption>
    </figure>
  );
}
