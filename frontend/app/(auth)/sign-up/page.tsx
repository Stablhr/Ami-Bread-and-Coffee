'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {UserPlus} from 'lucide-react';
import {
  AuthHeading,
  FormMessage,
  isStrongPassword,
  PasswordChecklist,
  PasswordInput
} from '@/components/auth/form-bits';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {registerCustomer} from '@/lib/api/authApi';
import {getFriendlyErrorMessage} from '@/lib/api/getFriendlyErrorMessage';

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!isStrongPassword(password)) {
      setErrorMessage('Your password is missing one of the items in the checklist.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('The two passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await registerCustomer({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password
      });
      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, 'We could not create your account. Please try again.'));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-7">
      <AuthHeading
        kicker="nice to meet you"
        title="Create your account"
        description="With an account you'll be able to pre-order and track your orders once online ordering opens."
      />

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
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
            aria-invalid={!passwordsMatch || undefined}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={isSubmitting}
            required
          />
          {!passwordsMatch && <p className="text-sm font-bold text-tomato">The passwords don&apos;t match yet.</p>}
        </div>

        {errorMessage && <FormMessage tone="error">{errorMessage}</FormMessage>}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting || !firstName || !lastName || !email || !password || !confirmPassword}
        >
          <UserPlus aria-hidden="true" />
          {isSubmitting ? 'Creating your account…' : 'Create account'}
        </Button>
      </form>

      <p className="border-t-2 border-dashed border-ink/25 pt-5 text-center text-ink-soft">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-bold text-cocoa underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
