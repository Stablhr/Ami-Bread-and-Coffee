'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {KeyRound} from 'lucide-react';
import {
  AuthHeading,
  FormMessage,
  isStrongPassword,
  PasswordChecklist,
  PasswordInput
} from '@/components/auth/form-bits';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {resetPassword} from '@/lib/api/authApi';
import {getFriendlyErrorMessage} from '@/lib/api/getFriendlyErrorMessage';

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = (searchParams.get('email') ?? '').trim();
  const code = (searchParams.get('code') ?? '').trim();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!isStrongPassword(password)) {
      setErrorMessage('Your new password is missing one of the items in the checklist.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('The two passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await resetPassword({email, code, newPassword: password});
      router.push('/sign-in');
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, 'We could not reset your password. Please try again.'));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-7">
      <AuthHeading kicker="fresh start" title="Choose a new password" />

      {(!email || !code) && (
        <FormMessage tone="error">
          This reset link is incomplete. Please{' '}
          <Link href="/forgot-password" className="underline">
            request a new code
          </Link>
          .
        </FormMessage>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            aria-describedby="password-rules"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isSubmitting}
            required
          />
          <PasswordChecklist id="password-rules" value={password} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Type it again</Label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        {errorMessage && <FormMessage tone="error">{errorMessage}</FormMessage>}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !email || !code}>
          <KeyRound aria-hidden="true" />
          {isSubmitting ? 'Saving…' : 'Save new password'}
        </Button>
      </form>
    </div>
  );
}
