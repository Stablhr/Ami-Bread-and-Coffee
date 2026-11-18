'use client';

import {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Check, LogIn, Plus, ShoppingBasket, UserPlus} from 'lucide-react';
import {Button, buttonVariants} from '@/components/ui/button';
import {QuantityStepper} from './quantity-stepper';
import type {MenuItem} from '@/lib/api/menuApi';
import {MAX_PER_ITEM, useCart} from '@/lib/cart/cart-store';
import {useIsCustomer} from '@/lib/hooks/auth/useIsCustomer';
import {cn} from '@/lib/utils';

function toCartLine(item: MenuItem, categoryKey: string) {
  return {
    menuItemId: item.id,
    slug: item.slug,
    name: item.name,
    unitPrice: item.price,
    imageUrl: item.imageUrl,
    deal: item.deal,
    categoryKey
  };
}

/** Shows "Added ✓" for a moment after adding. */
function useJustAdded() {
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const flash = () => {
    setJustAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setJustAdded(false), 1800);
  };
  return {justAdded, flash};
}

/** Item page: pick a quantity, then add. */
export function AddToCart({item, categoryKey}: {item: MenuItem; categoryKey: string}) {
  const {isCustomer, isAdmin, isPending} = useIsCustomer();
  if (isPending) return <div className="h-24" aria-hidden="true" />;
  if (isAdmin) return <p className="text-ink-soft">You are signed in as admin. Customers order from their own accounts.</p>;
  if (!isCustomer) return <SignInToOrder />;
  return <CustomerAddToCart item={item} categoryKey={categoryKey} />;
}

/** Guests can look but not order: point them to sign in / sign up. */
export function SignInToOrder() {
  const pathname = usePathname();
  const next = encodeURIComponent(pathname);
  return (
    <div className="space-y-3">
      <p className="font-bold text-ink">Only registered customers can order online.</p>
      <div className="flex flex-wrap gap-3">
        <Link href={`/sign-in?next=${next}`} className={buttonVariants()}>
          <LogIn aria-hidden="true" />
          Sign in to order
        </Link>
        <Link href={`/sign-up?next=${next}`} className={buttonVariants({variant: 'outline'})}>
          <UserPlus aria-hidden="true" />
          Create an account
        </Link>
      </div>
    </div>
  );
}

function CustomerAddToCart({item, categoryKey}: {item: MenuItem; categoryKey: string}) {
  const {add, lines} = useCart();
  const [quantity, setQuantity] = useState(1);
  const {justAdded, flash} = useJustAdded();
  const inCart = lines.find(line => line.menuItemId === item.id)?.quantity ?? 0;

  if (!item.isAvailable) {
    return <p className="font-bold text-tomato">Sold out today, so it can&apos;t be added to your cart.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          max={Math.max(1, MAX_PER_ITEM - inCart)}
          label={`Quantity of ${item.name}`}
        />
        <Button
          type="button"
          size="lg"
          disabled={inCart >= MAX_PER_ITEM}
          onClick={() => {
            add(toCartLine(item, categoryKey), quantity);
            setQuantity(1);
            flash();
          }}
        >
          {justAdded ? <Check aria-hidden="true" /> : <ShoppingBasket aria-hidden="true" />}
          {justAdded ? 'Added to cart' : 'Add to cart'}
        </Button>
      </div>
      <p aria-live="polite" className="min-h-6 text-ink-soft">
        {inCart > 0 && (
          <>
            {inCart} in your cart ·{' '}
            <Link href="/cart" className="font-bold text-cocoa underline underline-offset-4">
              View cart
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

/** Menu row: a small round "+" that adds one. */
export function QuickAdd({item, categoryKey, className}: {item: MenuItem; categoryKey: string; className?: string}) {
  const {add} = useCart();
  const {justAdded, flash} = useJustAdded();
  const {isCustomer} = useIsCustomer();

  // Guests and the admin account only browse.
  if (!isCustomer) return null;

  if (!item.isAvailable) return <span className={cn('size-11 shrink-0', className)} aria-hidden="true" />;

  return (
    <button
      type="button"
      onClick={() => {
        add(toCartLine(item, categoryKey), 1);
        flash();
      }}
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
        justAdded ? 'border-leaf bg-leaf text-cream' : 'border-ink/70 bg-linen text-ink hover:border-cocoa hover:bg-cocoa hover:text-cream',
        className
      )}
      aria-label={justAdded ? `${item.name} added to cart` : `Add ${item.name} to cart`}
    >
      {justAdded ? <Check aria-hidden="true" className="size-5" /> : <Plus aria-hidden="true" className="size-5" />}
    </button>
  );
}
