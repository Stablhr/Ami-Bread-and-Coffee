import Image from "next/image";
import Link from "next/link";
import { FeaturedDishes } from "@/components/sections/featured-dishes";
import { featuredItems, getItemBySlug } from "@/lib/menu-data";
import { toDishes } from "@/lib/menu-to-dish";

const HOME_FEATURED_SLUGS = [
  "sampler-box",
  "plain-sourdough",
  "chocochip-scone",
  "triple-cheese-toast"
];

const messengerUrl =
  process.env.NEXT_PUBLIC_SHOP_MESSENGER_URL ?? "https://m.me/ami-bread-and-coffee";

export default function HomePage() {
  const homeItems = HOME_FEATURED_SLUGS.map((slug) => getItemBySlug(slug)).filter(
    (item): item is NonNullable<typeof item> => Boolean(item)
  );
  const dishes = toDishes(homeItems.length > 0 ? homeItems : featuredItems.slice(0, 4));

  return (
    <main>
      <section className="relative isolate overflow-hidden border-b-2 border-double border-terracotta">
        <Image
          src="/hero-section.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Warm scrims keep the parchment text readable over the photo. */}
        <div aria-hidden="true" className="absolute inset-0 bg-espresso/50" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-espresso/90 via-espresso/60 to-espresso/15"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-espresso/25"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 rounded-sm border border-parchment/25 md:inset-4"
        />

        <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col justify-center px-5 py-16 md:min-h-[640px] md:px-8">
          <div className="max-w-2xl">
            <p className="font-accent text-3xl text-parchment/90">Ami Bread &amp; Coffee</p>
            <h1 className="mt-2 font-display text-4xl leading-[1.05] text-parchment md:text-6xl">
              Freshly baked sourdough,
              <br className="hidden sm:block" /> ready when you are.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-parchment/90">
              Pre-order bread, scones, toast, focaccia, and coffee for pickup or
              delivery in Trece Martires City. Order by 6:00 PM the day before.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="min-h-[48px] rounded-md border-2 border-parchment bg-parchment px-6 py-3 font-sans text-lg font-semibold text-terracotta hover:bg-ochre hover:border-ochre"
              >
                View the menu
              </Link>
              <Link
                href="/sign-in"
                className="min-h-[48px] rounded-md border-2 border-parchment/80 px-6 py-3 font-sans text-lg font-semibold text-parchment hover:bg-parchment/15"
              >
                Sign in to order
              </Link>
            </div>
          </div>

          <div className="mt-10 inline-flex max-w-md flex-wrap items-center gap-x-4 gap-y-1 rounded-md border border-parchment/35 bg-espresso/60 px-4 py-3 font-sans text-base text-parchment backdrop-blur-sm">
            <span>Open daily 7:00 AM – 9:00 PM</span>
            <span aria-hidden="true" className="hidden text-parchment/50 sm:inline">
              ·
            </span>
            <span>Order by 6:00 PM the day before</span>
          </div>
        </div>
      </section>

      <section aria-labelledby="featured-heading" className="border-b-2 border-double border-terracotta/40">
        <div className="mx-auto max-w-6xl px-5 pt-10 md:px-8">
          <p className="font-accent text-2xl text-terracotta">Pick of the day</p>
          <h2 id="featured-heading" className="mt-1 font-display text-3xl md:text-4xl">
            A closer look at the counter
          </h2>
          <p className="mt-2 max-w-2xl text-lg text-espresso/90">
            Scroll through a few favorites. Use the arrows, dots, or your keyboard
            to move between dishes.
          </p>
        </div>
        <FeaturedDishes dishes={dishes} slugs={homeItems.map((item) => item.slug)} />
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <h2 className="font-display text-3xl">How to order</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          <li className="rounded-lg border-2 border-double border-terracotta bg-parchment p-6">
            <span className="font-accent text-3xl text-terracotta">1.</span>
            <p className="mt-2 text-lg text-espresso">
              Browse the menu and choose your favorites.
            </p>
          </li>
          <li className="rounded-lg border-2 border-double border-terracotta bg-parchment p-6">
            <span className="font-accent text-3xl text-terracotta">2.</span>
            <p className="mt-2 text-lg text-espresso">
              Pick a pickup or delivery date and place your order.
            </p>
          </li>
          <li className="rounded-lg border-2 border-double border-terracotta bg-parchment p-6">
            <span className="font-accent text-3xl text-terracotta">3.</span>
            <p className="mt-2 text-lg text-espresso">
              Track your order and collect it warm, or have it delivered.
            </p>
          </li>
        </ol>
      </section>

      <section className="border-y-2 border-double border-terracotta/40 bg-parchment">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="font-display text-3xl">Visit the shop</h2>
            <p className="mt-2 text-lg text-espresso">
              Open daily, 7:00 AM to 9:00 PM, in Trece Martires City, Cavite.
            </p>
            <p className="mt-2 text-base text-espresso/90">
              Pre-orders close at 6:00 PM the day before your pickup or delivery
              date.
            </p>
          </div>
          <div className="md:justify-self-end">
            <h2 className="font-display text-3xl">Questions?</h2>
            <p className="mt-2 max-w-md text-lg text-espresso">
              Message the shop and we will help with sizes, allergens, or a custom
              box.
            </p>
            <a
              href={messengerUrl}
              className="mt-4 inline-flex min-h-[48px] items-center rounded-md bg-terracotta px-6 py-3 font-sans text-lg font-semibold text-parchment hover:bg-espresso"
            >
              Message us on Messenger
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <div className="rounded-lg border-4 border-double border-dusty-red bg-parchment p-5">
          <h2 className="font-sans text-lg font-bold text-dusty-red">Allergen notice</h2>
          <p className="mt-1 text-base text-espresso">
            Ingredient and allergen details are still being confirmed by the shop.
            If you have an allergy, please message us before ordering.
          </p>
        </div>
      </section>
    </main>
  );
}
