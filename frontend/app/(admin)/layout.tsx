'use client';

import Link from 'next/link';
import {RequireRole} from '@/components/auth/require-role';
import {SignOutButton} from '@/components/auth/sign-out-button';
import {LogoGirl, Wordmark} from '@/components/brand/logo';

/**
 * Admin area (owner + cashier share one admin account).
 * Same palette as the shop, but no paper texture or doodles: it is a work tool.
 */
export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <RequireRole role="admin">
      {user => (
        <div className="flex min-h-screen flex-col bg-paper [background-image:none]">
          <header className="wood-panel">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
              <Link href="/admin" className="flex items-center gap-3" aria-label="Admin home">
                <span className="rounded-xl bg-paper p-1.5">
                  <LogoGirl className="w-8" />
                </span>
                <Wordmark className="w-20 text-cream" />
                <span className="rounded-full border border-honey px-2.5 py-0.5 text-sm font-bold text-honey">Admin</span>
              </Link>
              <div className="flex items-center gap-4">
                <span className="hidden text-cream/80 sm:inline">Signed in as {user.firstName}</span>
                <SignOutButton variant="outline-cream" />
              </div>
            </div>
          </header>
          <main id="main-content" className="flex-1">{children}</main>
        </div>
      )}
    </RequireRole>
  );
}
