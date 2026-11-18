'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Info} from 'lucide-react';
import {useIsCustomer} from '@/lib/hooks/auth/useIsCustomer';

/** Tells guests they can browse but need an account to order. */
export function GuestOrderNotice({className}: {className?: string}) {
  const {isGuest} = useIsCustomer();
  const pathname = usePathname();
  if (!isGuest) return null;
  const next = encodeURIComponent(pathname);
  return (
    <p className={`mx-auto flex max-w-2xl items-start gap-3 rounded-2xl border-2 border-ink/60 bg-linen px-4 py-3 text-left ${className ?? ''}`}>
      <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-cocoa" />
      <span>
        You&apos;re browsing as a guest. To order online,{' '}
        <Link href={`/sign-in?next=${next}`} className="font-bold text-cocoa underline underline-offset-4">
          sign in
        </Link>{' '}
        or{' '}
        <Link href={`/sign-up?next=${next}`} className="font-bold text-cocoa underline underline-offset-4">
          create an account
        </Link>
        .
      </span>
    </p>
  );
}
