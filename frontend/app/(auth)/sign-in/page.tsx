'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useQueryClient} from '@tanstack/react-query';
import {LogIn} from 'lucide-react';
import {AuthHeading, FormMessage, PasswordInput} from '@/components/auth/form-bits';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {login} from '@/lib/api/authApi';
import {getFriendlyErrorMessage} from '@/lib/api/getFriendlyErrorMessage';
import {afterSignInPath} from '@/lib/auth/redirects';
import {meQueryKey} from '@/lib/hooks/auth/useMeQuery';

export default function SignInPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const {user} = await login({email: email.trim(), password});
      await queryClient.invalidateQueries({queryKey: meQueryKey});
      router.push(afterSignInPath(user.type));
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, 'We could not sign you in. Please try again.'));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-7">
      <AuthHeading kicker="welcome back" title="Sign in" description="Sign in to your Ami account." />

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-sm font-bold text-cocoa underline underline-offset-4">
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        {errorMessage && <FormMessage tone="error">{errorMessage}</FormMessage>}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !email || !password}>
          <LogIn aria-hidden="true" />
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="border-t-2 border-dashed border-ink/25 pt-5 text-center text-ink-soft">
        New here?{' '}
        <Link href="/sign-up" className="font-bold text-cocoa underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </div>
  );
}
