import {cn} from '@/lib/utils';

/*
 * Hand-drawn marks copied in spirit from the shop's printed menu:
 * inky asterisks, little open circles, hearts, and wavy rules.
 * All purely decorative, so they are hidden from screen readers.
 */

type DoodleProps = {className?: string};

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
};

export function Asterisk({className}: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn('size-8', className)} {...stroke} strokeWidth={2.6}>
      <path d="M20 3.5 19.4 36.8" />
      <path d="M5.2 11.6 34.6 28.9" />
      <path d="M5.6 28.4 34.1 11.2" />
    </svg>
  );
}

export function Sparkle({className}: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn('size-8', className)} {...stroke} strokeWidth={2.2}>
      <path d="M20 4v9M20 27v9M4 20h9M27 20h9" />
      <path d="M9.5 9.5l3.5 3.5M27 27l3.5 3.5M30.5 9.5 27 13M13 27l-3.5 3.5" opacity=".7" />
    </svg>
  );
}

export function OpenCircle({className}: DoodleProps) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={cn('size-3', className)} {...stroke} strokeWidth={2.4}>
      <path d="M10.4 3.1c4 .3 6.6 3.4 6.3 7.2-.3 3.9-3.4 6.6-7.1 6.4C5.8 16.4 3 13.4 3.3 9.6 3.6 5.9 6.6 3 10.9 3.4" />
    </svg>
  );
}

export function Heart({className, title}: DoodleProps & {title?: string}) {
  return (
    <svg
      viewBox="0 0 24 22"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn('size-4', className)}
      fill="currentColor"
    >
      <path d="M12.2 20.6C7.4 17 2.1 13.2 2 7.6 1.9 4.5 4.3 2 7.2 2.1c2 0 3.6 1.2 4.8 3 1.1-1.9 2.8-3.1 4.9-3.1 3 .1 5.2 2.6 5.1 5.7-.2 5.6-5.3 9.3-9.8 12.9Z" />
    </svg>
  );
}

/** Wavy hand-inked rule, like the one under "ami" on the printed menu. */
export function WavyRule({className}: DoodleProps) {
  return (
    <svg viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true" className={cn('h-3 w-40', className)} {...stroke} strokeWidth={3}>
      <path d="M2 9c12-7 22-7 33 0s22 6 33-1 23-6 34 1 22 6 33-1 22-6 33 0 22 7 34 0 22-7 33 0 22 6 33 0 21-6 30-1" />
    </svg>
  );
}

/** A loose ink underline drawn under a heading. */
export function InkUnderline({className}: DoodleProps) {
  return (
    <svg viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden="true" className={cn('h-2.5 w-full', className)} {...stroke} strokeWidth={2.4}>
      <path d="M2 7.5C90 5 180 4.4 260 5.4c48 .6 95 1.8 136 .6" />
    </svg>
  );
}

/** Big loose scribble used in page corners, like the menu's border strokes. */
export function Swoosh({className}: DoodleProps) {
  return (
    <svg viewBox="0 0 220 220" aria-hidden="true" className={cn('size-52', className)} {...stroke} strokeWidth={5}>
      <path d="M210 14c-36 2-72 22-96 52-21 26-30 56-56 72-14 9-34 12-46 4" />
      <path d="M200 52c-28 8-50 30-64 56-12 22-20 46-40 62" opacity=".75" />
      <path d="M208 98c-20 6-34 22-44 40" opacity=".55" />
    </svg>
  );
}
