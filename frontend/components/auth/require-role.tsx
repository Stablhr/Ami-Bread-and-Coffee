'use client';

import {useEffect} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import type {MeUser} from '@/lib/api/authApi';
import {isAuthError} from '@/lib/api/isAuthError';
import {getHomePathFor, type UserType} from '@/lib/auth/redirects';
import {useMeQuery} from '@/lib/hooks/auth/useMeQuery';
import {PageLoading} from '@/components/layout/page-loading';

/**
 * Shows children only to a signed-in account of the given type.
 * Guests go to /sign-in; the other account type goes to its own home.
 */
export function RequireRole({
  role,
  children
}: {
  role: UserType;
  children: (user: MeUser) => React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const {data, isPending, isError, error} = useMeQuery();
  const signedOut = isError && isAuthError(error);
  const wrongRole = data && data.user.type !== role;

  useEffect(() => {
    // Come back to this page after signing in (e.g. checkout).
    if (signedOut) router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
    else if (data && data.user.type !== role) router.replace(getHomePathFor(data.user.type));
  }, [data, pathname, role, router, signedOut]);

  if (isPending || signedOut || wrongRole) return <PageLoading />;

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="font-hand text-2xl">We couldn&apos;t reach the shop&apos;s server.</p>
        <p className="mt-2 text-ink-soft">Please check your connection and refresh the page.</p>
      </div>
    );
  }

  return <>{children(data.user)}</>;
}
