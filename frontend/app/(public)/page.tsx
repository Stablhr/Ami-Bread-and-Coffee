import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight, Clock, MapPin, Phone} from 'lucide-react';
import {Asterisk, Heart, OpenCircle, Sparkle, Swoosh, WavyRule} from '@/components/brand/doodles';
import {LogoGirl, Wordmark} from '@/components/brand/logo';
import {SectionHeading} from '@/components/brand/section-heading';
import {MenuUnavailable} from '@/components/menu/menu-unavailable';
import {SamplerBoxCard} from '@/components/menu/sampler-box-card';
import {buttonVariants} from '@/components/ui/button';
import {getMenu, type MenuItem} from '@/lib/api/menuApi';
import {formatPeso, MAP_DIRECTIONS_URL, SHOP} from '@/lib/shop';
import {cn} from '@/lib/utils';

export default async function HomePage() {
  const menu = await getMenu();
  const favorites: (MenuItem & {categoryName: string})[] = menu.ok
    ? menu.categories.flatMap(category =>
        category.items
          .filter(item => item.isFavorite)
          .map(item => ({...item, categoryName: category.name}))
      )
    : [];
  const sampler = menu.ok
    ? menu.categories.find(c => c.slug === 'sampler-box')?.items[0]
    : undefined;

  return (
    <>
      <Hero />
      <Favorites ok={menu.ok} favorites={favorites} />
      <SamplerFeature price={sampler?.price} />
      <HowItWorks />
      <VisitStrip />
    </>
  );
}

function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="wood-panel relative overflow-hidden">
      <Swoosh className="absolute -left-16 -top-10 size-64 text-cream/[0.07]" />
      <Asterisk className="absolute left-[46%] top-12 hidden size-9 text-honey/50 md:block" />
      <OpenCircle className="absolute left-[42%] bottom-16 hidden size-4 text-honey/50 md:block" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:grid-cols-[1.05fr_1fr] md:px-8 md:py-20">
        <div>
          <Wordmark className="w-36 text-cream md:w-44" />
          <p className="mt-1 font-script text-lg text-honey md:text-xl">{SHOP.tagline}</p>
          <h1 id="hero-heading" className="mt-6 text-[2.6rem] text-cream md:text-6xl">
            Sourdough &amp; coffee, baked with love in Trece Martires.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-cream/85">
            Breads, scones, focaccia, pasta and a good cup of coffee from our little shop beside
            Sugarland Estate.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" className={buttonVariants({variant: 'cream', size: 'lg'})}>
              See our menu
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/visit" className={buttonVariants({variant: 'outline-cream', size: 'lg'})}>
              Visit the shop
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-cream/85">
            <li className="flex items-center gap-2">
              <Clock aria-hidden="true" className="size-5 text-honey" />
              7:00 AM – 9:00 PM daily
            </li>
            <li className="flex items-center gap-2">
              <MapPin aria-hidden="true" className="size-5 text-honey" />
              {SHOP.address.short}
            </li>
          </ul>
        </div>

        {/* Polaroid of the real shop, taped to the wall */}
        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <figure className="relative rotate-[2deg] rounded-sm bg-linen p-3 pb-14 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)]">
            <span aria-hidden="true" className="absolute -top-3 left-8 h-7 w-24 -rotate-6 bg-paper-deep/80 shadow-sm" />
            <span aria-hidden="true" className="absolute -top-3 right-8 h-7 w-20 rotate-6 bg-paper-deep/80 shadow-sm" />
            <div className="relative aspect-[4/3.6] overflow-hidden">
              <Image
                src="/images/shop-interior.webp"
                alt="Fresh sourdough loaves cooling on racks inside Ami Bread & Coffee, lit by morning sun."
                fill
                priority
                sizes="(min-width: 768px) 45vw, 90vw"
                className="object-cover sepia-[0.15]"
              />
            </div>
            <figcaption className="absolute inset-x-0 bottom-3 text-center font-hand text-2xl text-ink">
              this morning&apos;s bake <Heart className="inline size-4 text-cocoa" />
            </figcaption>
          </figure>
          <span className="absolute -left-4 -top-6 flex size-24 items-center justify-center rounded-full border-[3px] border-ink bg-paper shadow-[3px_3px_0_0_var(--ink)] md:-left-8 md:size-28">
            <LogoGirl className="w-12 md:w-14" />
          </span>
        </div>
      </div>
    </section>
  );
}

function Favorites({ok, favorites}: {ok: boolean; favorites: (MenuItem & {categoryName: string})[]}) {
  return (
    <section aria-labelledby="favorites-heading" className="relative mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20">
      <Sparkle className="absolute right-6 top-14 size-10 text-ink/60 md:right-12" />
      <SectionHeading
        id="favorites-heading"
        kicker="the ones with hearts"
        title="Customer favorites"
        description="The items marked with a heart on our menu. A good place to start."
      />

      {ok && favorites.length > 0 ? (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((item, index) => (
            <li
              key={item.id}
              className={cn(
                'group relative rounded-2xl border-2 border-ink bg-linen p-5 transition-transform hover:-translate-y-1',
                index % 2 === 0 ? 'rotate-[-0.6deg]' : 'rotate-[0.6deg]'
              )}
            >
              {/* little punched hole + string, like a bakery tag */}
              <span aria-hidden="true" className="absolute right-5 top-5 size-3 rounded-full border-2 border-ink bg-paper" />
              <p className="font-hand text-base tracking-[0.14em] text-ink-soft uppercase">{item.categoryName}</p>
              <h3 className="mt-2 font-hand text-[1.7rem] leading-tight text-ink">
                {item.name}
                <Heart className="ml-2 inline size-4 -translate-y-1 text-cocoa" />
              </h3>
              <div className="mt-4 flex items-end justify-between border-t-2 border-dashed border-ink/30 pt-3">
                <span className="font-display text-3xl text-cocoa">{formatPeso(item.price)}</span>
                {item.deal && (
                  <span className="font-hand text-lg text-ink-soft">
                    {item.deal.quantity} for {formatPeso(item.deal.price)}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <MenuUnavailable />
      )}

      <div className="mt-10">
        <Link href="/menu" className={buttonVariants({variant: 'outline', size: 'lg'})}>
          See the full menu
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function SamplerFeature({price}: {price?: number}) {
  return (
    <section aria-labelledby="sampler-feature-heading" className="border-y-4 border-double border-ink/70 bg-paper-deep/60">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
        <div>
          <SectionHeading
            id="sampler-feature-heading"
            kicker="can't choose?"
            title="Try all four loaves"
            description="Our Sourdough Sampler Box comes with a 500g loaf of each flavor: Plain, Multigrain, Dried Fruits & Nuts, and Blueberry. Lovely for sharing, or for a week of breakfasts."
          />
          <WavyRule className="mt-8 w-48 text-cocoa" />
        </div>
        <SamplerBoxCard price={price ?? 700} className="mx-auto w-full max-w-md rotate-[1deg] shadow-[6px_6px_0_0_var(--ink)]" />
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {title: 'Browse the menu', body: 'Breads, scones, toast, focaccia, pasta, snacks and drinks, with prices.'},
    {title: 'Create your account', body: 'Sign up with your email so we know who your order is for.'},
    {title: 'Pre-order online', body: 'Pick your items and a pickup time. We are still building this part.', soon: true}
  ];
  return (
    <section aria-labelledby="how-heading" className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20">
      <SectionHeading
        id="how-heading"
        kicker="good things take time"
        title="How ordering will work"
        align="center"
      />
      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="relative rounded-2xl border-2 border-ink bg-linen px-6 pb-6 pt-10">
            <span
              aria-hidden="true"
              className="absolute -top-6 left-6 flex size-12 items-center justify-center rounded-full border-2 border-ink bg-cocoa font-display text-2xl text-cream shadow-[3px_3px_0_0_var(--ink)]"
            >
              {index + 1}
            </span>
            <h3 className="font-hand text-2xl text-ink">
              {step.title}
              {step.soon && (
                <span className="ml-2 inline-block -translate-y-0.5 rounded-full border-2 border-cocoa px-2 font-sans text-xs font-extrabold tracking-wider text-cocoa uppercase">
                  Coming soon
                </span>
              )}
            </h3>
            <p className="mt-2 text-ink-soft">{step.body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/sign-up" className={buttonVariants({size: 'lg'})}>
          Create an account
        </Link>
        <a href={SHOP.facebookUrl} target="_blank" rel="noreferrer" className={buttonVariants({variant: 'outline', size: 'lg'})}>
          Order through Facebook for now
        </a>
      </div>
    </section>
  );
}

function VisitStrip() {
  return (
    <section aria-labelledby="visit-heading" className="mx-auto max-w-6xl px-4 pb-20 md:px-8">
      <div className="relative overflow-hidden rounded-[2rem] border-[3px] border-ink bg-linen p-6 md:p-10">
        <Asterisk className="absolute right-8 top-8 size-10 text-ink/70" />
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="font-script text-lg text-cocoa">come say hi</p>
            <h2 id="visit-heading" className="mt-3 text-4xl">
              Open daily, 7:00 AM – 9:00 PM
            </h2>
            <p className="mt-3 text-lg text-ink-soft">
              {SHOP.address.line1}, {SHOP.address.line2}.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-start">
            <a href={MAP_DIRECTIONS_URL} target="_blank" rel="noreferrer" className={buttonVariants({size: 'lg'})}>
              <MapPin aria-hidden="true" />
              Get directions
            </a>
            <a href={SHOP.phoneHref} className={buttonVariants({variant: 'outline', size: 'lg'})}>
              <Phone aria-hidden="true" />
              Call {SHOP.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
