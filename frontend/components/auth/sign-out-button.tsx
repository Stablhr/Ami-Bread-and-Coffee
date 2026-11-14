'use client';

import {useRouter} from 'next/navigation';
import {LogOut} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useLogout} from '@/lib/hooks/auth/useLogout';

export function SignOutButton({variant = 'outline'}: {variant?: 'outline' | 'outline-cream'}) {
  const router = useRouter();
  const logout = useLogout();

  return (
    <Button
      type="button"
      variant={variant}
      disabled={logout.isPending}
      onClick={() => logout.mutate(undefined, {onSettled: () => router.replace('/')})}
    >
      <LogOut aria-hidden="true" />
      {logout.isPending ? 'Signing out…' : 'Sign out'}
    </Button>
  );
}
