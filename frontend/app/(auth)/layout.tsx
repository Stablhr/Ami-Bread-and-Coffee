'use client';

import {useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {ArrowLeft} from 'lucide-react';
import {Asterisk, Heart, OpenCircle} from '@/components/brand/doodles';
import {BrandLockup, LogoGirl, Wordmark} from '@/components/brand/logo';
import {useMeQuery} from '@/lib/hooks/auth/useMeQuery';
import {getHomePathFor} from '@/lib/auth/redirects';
import {SHOP} from '@/lib/shop';

export default function AuthLayout({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const {data, isSuccess} = useMeQuery();

  // Already signed in? Skip the forms.
  useEffect(() => {
    if (isSuccess && data) router.replace(getHomePathFor(data.user.type));
  }, [data, isSuccess, router]);

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* Left: the shop, in golden light */}
      <aside className="wood-panel relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Asterisk className="absolute right-12 top-14 size-10 text-honey/50" />
        <OpenCircle className="absolute right-24 top-28 size-4 text-honey/50" />
        <Link href="/" className="flex items-center gap-3" aria-label="Ami Bread & Coffee, home">
          <span className="rounded-2xl bg-paper p-2">
            <LogoGirl className="w-11" />
          </span>
          <Wordmark className="w-28 text-cream" />
        </Link>

        <figure className="relative mx-auto my-10 w-full max-w-md -rotate-2 bg-linen p-3 pb-12 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)]">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src="/images/shop-interior.webp"
              alt=""
              fill
              sizes="40vw"
              className="object-cover sepia-[0.15]"
            />
          </div>
          <figcaption className="absolute inset-x-0 bottom-2.5 text-center font-hand text-2xl text-ink">
            fresh from home <Heart className="inline size-4 text-cocoa" />
          </figcaption>
        </figure>

        <p className="max-w-sm text-cream/80">
          {SHOP.hours.label}. {SHOP.address.short}.
        </p>
      </aside>

      {/* Right: the form, on menu paper */}
      <div className="flex flex-col px-4 py-6 md:px-10">
        <div className="flex items-center justify-between">
          <div className="lg:hidden">
            <BrandLockup />
          </div>
          <Link
            href="/"
            className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-bold text-ink-soft hover:bg-paper-deep hover:text-ink"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
            Back to home
          </Link>
        </div>
        <main id="main-content" className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md rounded-[1.75rem] border-[3px] border-ink bg-linen p-6 shadow-[6px_6px_0_0_var(--ink)] md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
