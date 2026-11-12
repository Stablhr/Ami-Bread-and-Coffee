import type { Metadata } from "next";
import { formatPeso } from "@ami/shared";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItemBySlug } from "@/lib/menu-data";
import { apiItemToMenuItem, fetchMenuItem } from "@/lib/api/catalogApi";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await fetchMenuItem(slug);
  const fallback = getItemBySlug(slug);
  const resolved = item ? apiItemToMenuItem(item) : fallback;
  if (!resolved) return { title: "Item not found — Ami Bread & Coffee" };
  return {
    title: `${resolved.name} — Ami Bread & Coffee`,
    description: resolved.description
  };
}

export default async function MenuItemPage({ params }: PageProps) {
  const { slug } = await params;
  const apiItem = await fetchMenuItem(slug);
  const item = apiItem ? apiItemToMenuItem(apiItem) : getItemBySlug(slug);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:px-8">
      <p className="font-sans text-base">
        <Link className="text-terracotta underline underline-offset-4" href="/menu">
          ← Back to the menu
        </Link>
      </p>

      <header className="mt-4">
        <p className="font-accent text-2xl text-terracotta">Fresh from the oven</p>
        <h1 className="mt-1 font-display text-4xl leading-tight md:text-5xl">{item.name}</h1>
        <p className="mt-3 font-sans text-2xl font-semibold text-terracotta">
          {formatPeso(item.price)}
          {item.deal ? (
            <span className="ml-3 text-lg font-normal text-espresso">
              or {item.deal.quantity} for {formatPeso(item.deal.price)}
            </span>
          ) : null}
        </p>
      </header>

      <p className="mt-5 text-lg text-espresso">{item.description}</p>

      <dl className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-terracotta/40 bg-parchment p-5">
          <dt className="font-sans text-lg font-bold uppercase tracking-wide text-terracotta">
            Ingredients
          </dt>
          <dd className="mt-2">
            <ul className="list-disc space-y-1 pl-5 text-base text-espresso">
              {item.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          </dd>
        </div>

        <div className="rounded-lg border-4 border-double border-dusty-red bg-parchment p-5">
          <dt className="font-sans text-lg font-bold uppercase tracking-wide text-dusty-red">
            Allergens
          </dt>
          <dd className="mt-2 text-base text-espresso">
            {item.allergens.length > 0 ? (
              <p>{item.allergens.join(", ")}</p>
            ) : (
              <p>No allergens listed for this item.</p>
            )}
            <p className="mt-3 text-espresso/90">
              Ingredient and allergen details are still being confirmed by the shop.
              Message us before ordering if you have an allergy.
            </p>
          </dd>
        </div>
      </dl>

      {item.weight ? (
        <p className="mt-6 font-sans text-base text-espresso/85">Size: {item.weight}</p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/sign-in"
          className="min-h-[48px] rounded-md bg-terracotta px-6 py-3 font-sans text-lg font-semibold text-parchment hover:bg-espresso"
        >
          Sign in to order
        </Link>
        <Link
          href="/menu"
          className="min-h-[48px] rounded-md border-2 border-terracotta px-6 py-3 font-sans text-lg font-semibold text-terracotta hover:bg-parchment"
        >
          Keep browsing
        </Link>
      </div>
    </div>
  );
}
