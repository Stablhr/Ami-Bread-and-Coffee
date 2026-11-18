'use client';

import Link from 'next/link';
import {ShoppingBasket} from 'lucide-react';
import {useCart} from '@/lib/cart/cart-store';
import {useIsCustomer} from '@/lib/hooks/auth/useIsCustomer';
import {cn} from '@/lib/utils';

/** Header basket with a count badge. */
export function CartButton({className}: {className?: string}) {
  const {count} = useCart();
  const {isCustomer} = useIsCustomer();
  if (!isCustomer) return null;
  return (
    <Link
      href="/cart"
      className={cn(
        'relative inline-flex size-12 items-center justify-center rounded-full border-2 border-ink bg-linen text-ink hover:bg-paper-deep',
        className
      )}
      aria-label={count > 0 ? `Cart, ${count} item${count === 1 ? '' : 's'}` : 'Cart, empty'}
    >
      <ShoppingBasket aria-hidden="true" className="size-6" />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-1.5 -top-1.5 flex min-w-6 items-center justify-center rounded-full border-2 border-paper bg-cocoa px-1 text-xs font-extrabold text-cream"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
