import {cn} from '@/lib/utils';

/**
 * The dry-brush swatch behind "(3 for 220)" on the printed menu.
 * Text sits on a solid-enough base so it stays readable.
 */
export function BrushTag({children, className}: {children: React.ReactNode; className?: string}) {
  return (
    <span className={cn('relative inline-flex items-center px-4 py-1 font-hand text-lg text-ink', className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 40"
        preserveAspectRatio="none"
        className="absolute inset-0 -z-0 h-full w-full text-clay/80"
        fill="currentColor"
      >
        <path d="M4 9c22-4 52-6 86-5 34 0 70 1 104 4 2 3 3 9 2 14 1 5 0 9-2 12-32 3-70 4-104 3-32 0-60-1-84-3-3-3-5-9-4-14-1-4 0-8 2-11Z" />
        <path d="M10 6c40-2 70-1 100-1M30 36c40 1 90 0 150-2" stroke="currentColor" strokeWidth="2" opacity=".5" fill="none" />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}
