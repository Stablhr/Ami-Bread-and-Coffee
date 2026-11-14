'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {Mail} from 'lucide-react';
import {AuthHeading, FormMessage} from '@/components/auth/form-bits';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {sendPasswordResetCode} from '@/lib/api/authApi';
import {getFriendlyErrorMessage} from '@/lib/api/getFriendlyErrorMessage';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await sendPasswordResetCode({email: email.trim()});
      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}&mode=reset`);
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, 'We could not send a reset code. Please try again.'));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-7">
      <AuthHeading
        kicker="it happens"
        title="Forgot your password?"
        description="Enter the email you signed up with and we'll send you a 6-digit code."
      />

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        {errorMessage && <FormMessage tone="error">{errorMessage}</FormMessage>}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !email}>
          <Mail aria-hidden="true" />
          {isSubmitting ? 'Sending…' : 'Send me a code'}
        </Button>
      </form>

      <p className="border-t-2 border-dashed border-ink/25 pt-5 text-center text-ink-soft">
        Remembered it?{' '}
        <Link href="/sign-in" className="font-bold text-cocoa underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
