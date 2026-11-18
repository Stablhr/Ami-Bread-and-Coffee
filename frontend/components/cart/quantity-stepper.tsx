'use client';

import {Minus, Plus} from 'lucide-react';
import {cn} from '@/lib/utils';

/** − 2 + control. Big buttons for easy tapping. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 30,
  label,
  size = 'default'
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  /** e.g. "Quantity of Latte" for screen readers */
  label: string;
  size?: 'default' | 'sm';
}) {
  const button = cn(
    'flex items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-deep disabled:opacity-40',
    size === 'sm' ? 'size-10' : 'size-12'
  );
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center gap-1 rounded-full border-2 border-ink/70 bg-linen p-0.5"
    >
      <button type="button" className={button} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="One less">
        <Minus aria-hidden="true" className="size-5" />
      </button>
      <output aria-live="polite" className={cn('min-w-8 text-center font-bold tabular-nums', size === 'sm' ? 'text-base' : 'text-lg')}>
        {value}
      </output>
      <button type="button" className={button} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="One more">
        <Plus aria-hidden="true" className="size-5" />
      </button>
    </div>
  );
}
