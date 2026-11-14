'use client';

import Link from 'next/link';
import {ClipboardList, Mail, UserRound} from 'lucide-react';
import {RequireRole} from '@/components/auth/require-role';
import {SignOutButton} from '@/components/auth/sign-out-button';
import {Asterisk, Heart} from '@/components/brand/doodles';
import {SectionHeading} from '@/components/brand/section-heading';
import {buttonVariants} from '@/components/ui/button';

export default function AccountPage() {
  return (
    <RequireRole role="user">
      {user => (
        <div className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-16">
          <SectionHeading
            as="h1"
            kicker="hello again"
            title={`Hi, ${user.firstName}!`}
            description="This is your Ami account. Online pre-ordering is on its way, and your orders will show up here."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <section aria-labelledby="profile-heading" className="relative rounded-[1.75rem] border-[3px] border-ink bg-linen p-6">
              <Asterisk className="absolute right-5 top-5 size-7 text-ink/60" />
              <h2 id="profile-heading" className="text-2xl">Your details</h2>
              <dl className="mt-4 space-y-3 text-lg">
                <div className="flex items-center gap-3">
                  <dt><UserRound aria-hidden="true" className="size-5 text-cocoa" /><span className="sr-only">Name</span></dt>
                  <dd>{user.firstName} {user.lastName}</dd>
                </div>
                <div className="flex items-center gap-3">
                  <dt><Mail aria-hidden="true" className="size-5 text-cocoa" /><span className="sr-only">Email</span></dt>
                  <dd className="break-all">{user.email}</dd>
                </div>
              </dl>
              <div className="mt-6">
                <SignOutButton />
              </div>
            </section>

            <section aria-labelledby="orders-heading" className="rounded-[1.75rem] border-2 border-dashed border-ink/60 bg-paper-deep/50 p-6">
              <h2 id="orders-heading" className="flex items-center gap-2 text-2xl">
                <ClipboardList aria-hidden="true" className="size-6 text-cocoa" />
                Your orders
              </h2>
              <p className="mt-3 font-hand text-xl text-ink">No orders yet.</p>
              <p className="mt-1 text-ink-soft">
                Online pre-ordering is coming soon. For now, browse the menu and message us to order.
              </p>
              <Link href="/menu" className={`${buttonVariants({size: 'default'})} mt-5`}>
                Browse the menu
              </Link>
            </section>
          </div>

          <p className="mt-12 text-center font-script text-lg text-cocoa">
            thank you for being here <Heart className="inline size-4" />
          </p>
        </div>
      )}
    </RequireRole>
  );
}
