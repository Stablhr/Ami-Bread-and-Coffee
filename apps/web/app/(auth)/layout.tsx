'use client';

import {useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useMeQuery} from '@/lib/hooks/auth/useMeQuery';
import {getDashboardPath} from '@/lib/auth/redirects';
import Loading from '../loading';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({children}: AuthLayoutProps) => {
  const router = useRouter();
  const {data, isLoading, isFetching, isSuccess} = useMeQuery();

  useEffect(() => {
    if (!isSuccess) return;
    router.replace(getDashboardPath(data.user.type));
  }, [data, isSuccess, router]);

  if (isLoading || isFetching) return <Loading />;

  return (
    <div className="flex min-h-screen bg-paper">
      <div className="relative hidden overflow-hidden bg-terracotta lg:flex lg:w-1/2">
        <Image
          src="/hero-section.png"
          alt=""
          fill
          sizes="50vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-terracotta/85" aria-hidden="true" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-parchment">
          <Link href="/" className="font-display text-2xl text-parchment">
            Ami Bread &amp; Coffee
          </Link>
          <div>
            <p className="font-accent text-3xl">baked in Trece Martires</p>
            <h1 className="mt-2 font-display text-4xl leading-tight">
              Fresh sourdough, ready when you are.
            </h1>
            <p className="mt-3 max-w-md text-lg text-parchment/90">
              Sign in to place a pre-order for pickup or delivery. Order by 6:00 PM
              the day before.
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-paper p-6 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
