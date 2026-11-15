'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {RequireRole} from '@/components/auth/require-role';
import {SignOutButton} from '@/components/auth/sign-out-button';
import {LogoGirl, Wordmark} from '@/components/brand/logo';
import {cn} from '@/lib/utils';

const NAV = [
  {href: '/admin', label: 'Dashboard', exact: true},
  {href: '/admin/products', label: 'Products', exact: false}
];

/**
 * Admin area (owner + cashier share one admin account).
 * Same palette as the shop, but no paper texture or doodles: it is a work tool.
 */
export default function AdminLayout({children}: {children: React.ReactNode}) {
  const pathname = usePathname();

  return (
    <RequireRole role="admin">
      {user => (
        <div className="flex min-h-screen flex-col bg-paper [background-image:none]">
          <header className="wood-panel">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-8">
              <Link href="/admin" className="flex items-center gap-3" aria-label="Admin home">
                <span className="rounded-xl bg-paper p-1.5">
                  <LogoGirl className="w-8" />
                </span>
                <Wordmark className="w-20 text-cream" />
                <span className="rounded-full border border-honey px-2.5 py-0.5 text-sm font-bold text-honey">Admin</span>
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/" className="hidden font-bold text-cream/80 hover:text-honey sm:inline">
                  View website
                </Link>
                <span className="hidden text-cream/80 md:inline">Signed in as {user.firstName}</span>
                <SignOutButton variant="outline-cream" />
              </div>
            </div>
            <nav aria-label="Admin" className="border-t border-cream/15">
              <ul className="mx-auto flex max-w-6xl gap-1 px-4 md:px-8">
                {NAV.map(item => {
                  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'inline-flex min-h-12 items-center border-b-4 px-4 font-bold',
                          active ? 'border-honey text-honey' : 'border-transparent text-cream/85 hover:text-cream'
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </header>
          <main id="main-content" className="flex-1">{children}</main>
        </div>
      )}
    </RequireRole>
  );
}
