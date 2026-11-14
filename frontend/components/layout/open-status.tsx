'use client';

import {useEffect, useState} from 'react';
import {cn} from '@/lib/utils';
import {isShopOpen, SHOP} from '@/lib/shop';

/**
 * "Open now" / "Closed" badge using Manila time. Rendered after mount so the
 * server and the browser never disagree about the current hour.
 */
export function OpenStatus({className, tone = 'wood'}: {className?: string; tone?: 'wood' | 'paper'}) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOpen(isShopOpen());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (open === null) {
    return <span className={cn('inline-block h-6 w-28', className)} aria-hidden="true" />;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-sans text-sm font-bold',
        tone === 'wood' ? 'text-cream' : 'text-ink',
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-2.5 rounded-full ring-2',
          open ? 'bg-[#7bc47f] ring-[#7bc47f]/30' : 'bg-honey ring-honey/30'
        )}
      />
      {open ? 'Open now' : `Closed · opens ${SHOP.hours.openHour}:00 AM`}
    </span>
  );
}
