import type { Metadata } from "next";
import { MenuCard } from "@/components/menu/menu-card";
import { getItemBySlug } from "@/lib/menu-data";

export const metadata: Metadata = {
  title: "Design tile — Ami Bread & Coffee",
  description: "Vintage style tile: palette, type, badges, menu card, and allergen notice."
};

const palette = [
  { token: "paper", hex: "#F3E9D8", use: "Page background", contrast: "—" },
  { token: "parchment", hex: "#FBF5E9", use: "Cards", contrast: "—" },
  { token: "terracotta", hex: "#7A3B14", use: "Buttons and links", contrast: "7.09:1 on paper" },
  { token: "espresso", hex: "#2B1A10", use: "Body text", contrast: "13.88:1 on paper" },
  { token: "dusty-red", hex: "#A23B2A", use: "Alerts and errors", contrast: "5.46:1 on paper" },
  { token: "ochre", hex: "#B8862B", use: "Decoration only", contrast: "2.69:1 — never text" }
];

const statuses = [
  { label: "Received", color: "var(--status-received)" },
  { label: "In the Oven", color: "var(--status-oven)" },
  { label: "Ready", color: "var(--status-ready)" },
  { label: "Completed", color: "var(--status-completed)" },
  { label: "Cancelled", color: "var(--status-cancelled)" }
];

export default function DesignTilePage() {
  const sample = getItemBySlug("chocochip-scone");

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <header className="max-w-2xl">
        <p className="font-accent text-2xl text-terracotta">Gate A approval</p>
        <h1 className="mt-1 font-display text-4xl leading-tight md:text-5xl">Design tile</h1>
        <p className="mt-3 text-lg text-espresso/90">
          The vintage pieces used across the shop: palette, type, buttons, status
          badges, a menu card, and the allergen notice.
        </p>
      </header>

      <section aria-labelledby="palette-heading" className="mt-10">
        <h2 id="palette-heading" className="font-display text-3xl">
          Palette
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {palette.map((swatch) => (
            <li key={swatch.token} className="overflow-hidden rounded-lg border border-terracotta/40">
              <div
                className="h-20 w-full border-b border-terracotta/30"
                style={{ background: swatch.hex }}
                aria-hidden="true"
              />
              <div className="bg-parchment p-4">
                <p className="font-sans text-lg font-bold text-espresso">{swatch.token}</p>
                <p className="font-sans text-base text-espresso/90">{swatch.hex}</p>
                <p className="font-sans text-sm text-espresso/80">{swatch.use}</p>
                <p className="mt-1 font-sans text-sm text-espresso/80">{swatch.contrast}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="type-heading" className="mt-10">
        <h2 id="type-heading" className="font-display text-3xl">
          Typography
        </h2>
        <div className="mt-4 space-y-4 rounded-lg border border-terracotta/40 bg-parchment p-5">
          <div>
            <p className="font-sans text-sm uppercase tracking-wide text-terracotta">
              DM Serif Display · headings
            </p>
            <p className="font-display text-4xl">Sourdough, baked this morning</p>
          </div>
          <div>
            <p className="font-sans text-sm uppercase tracking-wide text-terracotta">
              Caveat · decorative accents only
            </p>
            <p className="font-accent text-3xl text-terracotta">fresh from the oven</p>
          </div>
          <div>
            <p className="font-sans text-sm uppercase tracking-wide text-terracotta">
              Lora · body at 18px
            </p>
            <p className="max-w-2xl text-lg text-espresso">
              Naturally leavened loaves with a crackling crust and an open crumb.
              Pre-order by 6:00 PM the day before pickup or delivery.
            </p>
          </div>
          <div>
            <p className="font-sans text-sm uppercase tracking-wide text-terracotta">
              Nunito Sans · buttons, prices, status
            </p>
            <p className="font-sans text-xl font-semibold text-espresso">₱220 · 3 scones</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="controls-heading" className="mt-10">
        <h2 id="controls-heading" className="font-display text-3xl">
          Buttons and badges
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="min-h-[48px] rounded-md bg-terracotta px-6 py-3 font-sans text-lg font-semibold text-parchment hover:bg-espresso"
          >
            Primary action
          </button>
          <button
            type="button"
            className="min-h-[48px] rounded-md border-2 border-terracotta px-6 py-3 font-sans text-lg font-semibold text-terracotta hover:bg-parchment"
          >
            Secondary action
          </button>
          <button
            type="button"
            disabled
            className="min-h-[48px] rounded-md bg-terracotta/50 px-6 py-3 font-sans text-lg font-semibold text-parchment"
          >
            Disabled
          </button>
        </div>

        <ul className="mt-4 flex flex-wrap gap-2">
          {statuses.map((status) => (
            <li
              key={status.label}
              className="inline-flex min-h-[36px] items-center gap-2 rounded-full px-3 py-1.5 font-sans text-base font-semibold text-white"
              style={{ background: status.color }}
            >
              <span aria-hidden="true" className="inline-block size-2 rounded-full bg-white" />
              {status.label}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="card-heading" className="mt-10">
        <h2 id="card-heading" className="font-display text-3xl">
          Menu card
        </h2>
        {sample ? (
          <ul className="mt-4 grid max-w-2xl gap-4">
            <MenuCard item={sample} />
          </ul>
        ) : null}
      </section>

      <section aria-labelledby="notice-heading" className="mt-10">
        <h2 id="notice-heading" className="font-display text-3xl">
          Allergen notice
        </h2>
        <div className="mt-4 rounded-lg border-4 border-double border-dusty-red bg-parchment p-5">
          <p className="font-sans text-lg font-bold text-dusty-red">Allergen notice</p>
          <p className="mt-1 text-base text-espresso">
            This product contains wheat and dairy. Ask the shop before ordering if
            you have an allergy.
          </p>
        </div>
      </section>

      <section aria-labelledby="texture-heading" className="mt-10">
        <h2 id="texture-heading" className="font-display text-3xl">
          Texture and ornament
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border-2 border-double border-terracotta bg-paper p-5">
            <p className="text-base text-espresso">
              Paper-grain texture sits on the page background only, never behind
              text. Cards stay solid parchment.
            </p>
          </div>
          <div className="rounded-lg border-2 border-double border-terracotta bg-parchment p-5">
            <p className="text-base text-espresso">
              Ornamental double rules and stamp-style tags are decorative and hidden
              from assistive technology.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
