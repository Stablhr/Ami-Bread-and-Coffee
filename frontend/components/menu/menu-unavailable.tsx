import {SHOP} from '@/lib/shop';

/** Friendly fallback when the menu API can't be reached. */
export function MenuUnavailable() {
  return (
    <div className="mt-10 rounded-2xl border-2 border-dashed border-ink/50 bg-linen p-6">
      <p className="font-hand text-2xl text-ink">Our menu board is taking a short break.</p>
      <p className="mt-1 text-ink-soft">
        We couldn&apos;t load the menu just now. Please try again in a moment, or{' '}
        <a href={SHOP.facebookUrl} target="_blank" rel="noreferrer" className="font-bold text-cocoa underline underline-offset-4">
          message us on Facebook
        </a>
        .
      </p>
    </div>
  );
}
