import Link from "next/link";
import { formatPeso, type MenuItem } from "@/lib/menu-data";

export function MenuCard({ item }: { item: MenuItem }) {
  return (
    <li className="rounded-lg border border-terracotta/40 bg-parchment p-5 shadow-[0_1px_0_rgba(122,59,20,0.15)]">
      <div className="flex items-baseline gap-2">
        <Link
          href={`/menu/${item.slug}`}
          className="font-display text-xl text-espresso underline-offset-4 hover:underline"
        >
          {item.name}
        </Link>
        <span aria-hidden="true" className="mb-1 flex-1 border-b border-dotted border-terracotta/70" />
        <span className="whitespace-nowrap font-sans text-lg font-semibold text-terracotta">
          {formatPeso(item.price)}
        </span>
      </div>

      <p className="mt-2 text-base text-espresso/90">{item.description}</p>

      {item.deal ? (
        <p className="mt-2 font-sans text-base font-semibold text-terracotta">
          Or {item.deal.quantity} for {formatPeso(item.deal.price)}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {item.weight ? (
          <span className="rounded-full border border-terracotta/40 px-2.5 py-1 font-sans text-sm text-espresso">
            {item.weight}
          </span>
        ) : null}
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-ochre/20 px-2.5 py-1 font-sans text-sm text-espresso"
          >
            {tag}
          </span>
        ))}
        {item.allergens.length > 0 ? (
          <span className="rounded-full border border-dusty-red/50 px-2.5 py-1 font-sans text-sm text-dusty-red">
            Allergens: {item.allergens.join(", ")}
          </span>
        ) : (
          <span className="rounded-full border border-terracotta/30 px-2.5 py-1 font-sans text-sm text-espresso/80">
            No listed allergens
          </span>
        )}
      </div>
    </li>
  );
}
