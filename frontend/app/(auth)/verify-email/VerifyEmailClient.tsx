'use client';

import {useState, type FormEvent} from 'react';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {AuthHeading, FormMessage} from '@/components/auth/form-bits';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from '@/components/ui/input-otp';
import {
  resendPasswordResetCode,
  resendVerificationCode,
  verifyCustomerEmail,
  verifyPasswordResetCode
} from '@/lib/api/authApi';
import {getFriendlyErrorMessage} from '@/lib/api/getFriendlyErrorMessage';

/**
 * Enter the 6-digit email code. Used for two things:
 *   /verify-email?email=…              → confirm a new account
 *   /verify-email?email=…&mode=reset   → step 2 of "forgot password"
 */
export default function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = (searchParams.get('email') ?? '').trim();
  const isResetMode = searchParams.get('mode') === 'reset';

  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const canSubmit = email.length > 0 && code.length === 6;

  const handleVerify = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting || !canSubmit) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      if (isResetMode) {
        await verifyPasswordResetCode({email, code});
        router.push(`/reset-password?email=${encodeURIComponent(email)}&code=${code}`);
      } else {
        await verifyCustomerEmail({email, code});
        setSuccessMessage('Your email is confirmed. Taking you to sign in…');
        router.push('/sign-in');
      }
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, 'That code did not work. Please try again.'));
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (isResending || !email) return;
    setIsResending(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      if (isResetMode) await resendPasswordResetCode({email});
      else await resendVerificationCode({email});
      setSuccessMessage('We sent a new code. Please check your inbox (and spam folder).');
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, 'We could not resend the code.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-7">
      <AuthHeading
        kicker="almost there"
        title={isResetMode ? 'Check your email' : 'Confirm your email'}
        description={
          email ? (
            <>
              We sent a 6-digit code to <strong className="text-ink">{email}</strong>.
            </>
          ) : (
            'Enter the 6-digit code we emailed you.'
          )
        }
      />

      {!email && (
        <FormMessage tone="error">
          We don&apos;t know which email to check. Please{' '}
          <Link href={isResetMode ? '/forgot-password' : '/sign-up'} className="underline">
            start again
          </Link>
          .
        </FormMessage>
      )}

      <form onSubmit={handleVerify} className="space-y-5">
        <div className="space-y-3">
          <Label htmlFor="otp">6-digit code</Label>
          <InputOTP
            id="otp"
            maxLength={6}
            value={code}
            onChange={(value: string) => setCode(value.replace(/\D/g, '').slice(0, 6))}
            disabled={isSubmitting}
            autoComplete="one-time-code"
            inputMode="numeric"
            containerClassName="justify-center"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {errorMessage && <FormMessage tone="error">{errorMessage}</FormMessage>}
        {successMessage && <FormMessage tone="success">{successMessage}</FormMessage>}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !canSubmit}>
          {isSubmitting ? 'Checking…' : isResetMode ? 'Continue' : 'Confirm email'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleResend}
          disabled={isResending || !email}
        >
          {isResending ? 'Sending…' : 'Send me a new code'}
        </Button>
      </form>

      <p className="border-t-2 border-dashed border-ink/25 pt-5 text-center text-ink-soft">
        {isResetMode ? 'Remembered it?' : 'Already confirmed?'}{' '}
        <Link href="/sign-in" className="font-bold text-cocoa underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
