import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {formatPeso} from '@/lib/shop';
import {cn} from '@/lib/utils';

const FLAVORS = [
  {label: 'Dried Fruits & Nuts', className: 'bg-slate'},
  {label: 'Multigrain', className: 'bg-cocoa'},
  {label: 'Plain', className: 'bg-[#86634e]'},
  {label: 'Blueberry', className: 'bg-blueberry'}
];

/**
 * The boxed "Sourdough Sampler Box" from the printed menu, with its four
 * watercolour flavour swatches.
 */
export function SamplerBoxCard({
  price = 700,
  href,
  className
}: {
  price?: number;
  /** Item page, e.g. /menu/sourdough-sampler-box */
  href?: string;
  className?: string;
}) {
  return (
    <section
      aria-labelledby="sampler-heading"
      id="sampler-box"
      className={cn('break-inside-avoid rounded-[1.75rem] border-[3px] border-ink bg-linen p-5 md:p-6', className)}
    >
      <div className="text-center">
        <p className="font-script text-lg text-cocoa">sourdough</p>
        <h2 id="sampler-heading" className="mt-2 font-hand text-3xl tracking-[0.18em] text-ink">
          SAMPLER BOX
        </h2>
      </div>
      <div className="my-4 border-t-2 border-ink/80" />
      <ul className="grid grid-cols-2 gap-3">
        {FLAVORS.map(flavor => (
          <li
            key={flavor.label}
            className={cn(
              'flex min-h-14 items-center justify-center rounded-2xl px-2 py-2 text-center font-hand text-lg leading-tight tracking-wider text-cream',
              'shadow-[inset_0_0_14px_rgb(0_0_0/0.25)]',
              flavor.className
            )}
          >
            {flavor.label}
          </li>
        ))}
      </ul>
      <div className="my-4 border-t-2 border-ink/80" />
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
        <p className="font-hand text-xl leading-tight text-ink">
          All 4 flavors
          <br />
          <span className="text-base text-ink-soft">500g each</span>
        </p>
        <span aria-hidden="true" className="h-12 w-0.5 bg-ink/80" />
        <p className="font-display text-5xl text-ink">
          <span className="sr-only">Price: </span>
          {formatPeso(price)}
        </p>
      </div>
      {href && (
        <div className="mt-4 text-center">
          <Link
            href={href}
            className="inline-flex min-h-11 items-center gap-2 font-bold text-cocoa underline decoration-2 underline-offset-4 hover:text-cocoa-dark"
          >
            What&apos;s in the box
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
