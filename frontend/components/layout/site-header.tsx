'use client';

import {useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Menu as MenuIcon, Phone, UserRound, X} from 'lucide-react';
import {BrandLockup} from '@/components/brand/logo';
import {buttonVariants} from '@/components/ui/button';
import {OpenStatus} from './open-status';
import {CartButton} from '@/components/cart/cart-button';
import {useMeQuery} from '@/lib/hooks/auth/useMeQuery';
import {getHomePathFor} from '@/lib/auth/redirects';
import {SHOP} from '@/lib/shop';
import {cn} from '@/lib/utils';

const NAV = [
  {href: '/', label: 'Home'},
  {href: '/menu', label: 'Menu'},
  {href: '/visit', label: 'Visit us'}
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

function AccountArea({onNavigate}: {onNavigate?: () => void}) {
  const {data, isPending, isError} = useMeQuery();

  if (isPending) {
    return <span aria-hidden="true" className="inline-block h-12 w-40" />;
  }

  if (!isError && data) {
    const {user} = data;
    return (
      <Link
        href={getHomePathFor(user.type)}
        onClick={onNavigate}
        className={buttonVariants({variant: 'outline', size: 'sm'})}
      >
        <UserRound aria-hidden="true" />
        {user.type === 'admin' ? 'Admin dashboard' : `Hi, ${user.firstName}`}
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/sign-in"
        onClick={onNavigate}
        className={buttonVariants({variant: 'ghost', size: 'sm'})}
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        onClick={onNavigate}
        className={buttonVariants({variant: 'default', size: 'sm'})}
      >
        Create account
      </Link>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  // Remember which page the mobile menu was opened on, so it closes by
  // itself as soon as the visitor navigates somewhere else.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const mobileOpen = openedOn === pathname;
  const setMobileOpen = (open: boolean) => setOpenedOn(open ? pathname : null);

  return (
    <header className="sticky top-0 z-40">
      {/* Top strip: the dark wood counter */}
      <div className="wood-panel">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 text-sm md:px-8">
          <OpenStatus />
          <p className="hidden text-cream/85 sm:block">{SHOP.hours.label}</p>
          <a href={SHOP.phoneHref} className="inline-flex items-center gap-1.5 font-bold text-cream hover:text-honey">
            <Phone aria-hidden="true" className="size-4" />
            {SHOP.phoneDisplay}
          </a>
        </div>
      </div>

      {/* Main bar: menu paper with a double inked rule */}
      <div className="border-b-4 border-double border-ink/80 bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 md:px-8">
          <BrandLockup />

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV.map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                    className={cn(
                      'relative rounded-full px-4 py-2 font-hand text-xl text-ink transition-colors hover:bg-paper-deep',
                      'aria-[current=page]:text-cocoa aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-4 aria-[current=page]:after:bottom-1 aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-cocoa'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <AccountArea />
          </div>

          <CartButton />

          <button
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-full border-2 border-ink bg-linen md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X aria-hidden="true" /> : <MenuIcon aria-hidden="true" />}
            <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
          </button>
          </div>
        </div>

        {mobileOpen && (
          <div id="mobile-menu" className="border-t-2 border-dashed border-ink/30 px-4 pb-5 pt-2 md:hidden">
            <nav aria-label="Main">
              <ul className="flex flex-col">
                {NAV.map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                      className="flex min-h-12 items-center border-b border-dotted border-ink/30 font-hand text-2xl text-ink aria-[current=page]:text-cocoa"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-4">
              <AccountArea onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
