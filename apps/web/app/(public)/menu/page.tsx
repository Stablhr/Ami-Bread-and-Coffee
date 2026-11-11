import type { Metadata } from "next";
import { MenuCard } from "@/components/menu/menu-card";
import { getItemsByCategory, menuCategories } from "@/lib/menu-data";

export const metadata: Metadata = {
  title: "Menu — Ami Bread & Coffee",
  description:
    "Sourdough breads, scones, toast, focaccia, and coffee. Prices in Philippine pesos; order by 6:00 PM the day before."
};

export default function MenuPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <header className="max-w-2xl">
        <p className="font-accent text-2xl text-terracotta">Today&apos;s printed menu</p>
        <h1 className="mt-1 font-display text-4xl leading-tight md:text-5xl">Menu</h1>
        <p className="mt-3 text-lg text-espresso/90">
          Everything is baked to order. Choose what you like, pick a pickup or
          delivery date, and we will have it ready.
        </p>
      </header>

      <nav aria-label="Menu categories" className="mt-6 flex flex-wrap gap-2 font-sans">
        {menuCategories.map((category) => (
          <a
            key={category.slug}
            href={`#${category.slug}`}
            className="min-h-[44px] rounded-full border border-terracotta/50 px-4 py-2 text-base hover:bg-parchment"
          >
            {category.name}
          </a>
        ))}
      </nav>

      <aside className="mt-8 rounded-lg border-4 border-double border-dusty-red bg-parchment p-5">
        <p className="font-sans text-lg font-bold text-dusty-red">Allergen notice</p>
        <p className="mt-1 text-base text-espresso">
          Ingredient and allergen details are still being confirmed by the shop.
          If you have an allergy, please message us before ordering and we will
          check the batch for you.
        </p>
      </aside>

      <div className="mt-10 space-y-12">
        {menuCategories.map((category) => {
          const items = getItemsByCategory(category.slug);
          if (items.length === 0) return null;
          return (
            <section key={category.slug} id={category.slug} aria-labelledby={`${category.slug}-heading`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id={`${category.slug}-heading`} className="font-display text-3xl">
                  {category.name}
                </h2>
                <p className="max-w-xl text-base text-espresso/85">{category.description}</p>
              </div>
              <ul className="mt-4 grid gap-4 md:grid-cols-2">
                {items.map((item) => (
                  <MenuCard key={item.slug} item={item} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
