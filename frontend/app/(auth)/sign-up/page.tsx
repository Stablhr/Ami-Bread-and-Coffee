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
import {ContactFields, validateContact, type ContactErrors, type ContactValues} from '@/components/account/contact-fields';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {registerCustomer} from '@/lib/api/authApi';
import {getFriendlyErrorMessage} from '@/lib/api/getFriendlyErrorMessage';
import {cleanPhone, EMPTY_ADDRESS} from '@/lib/address';

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contact, setContact] = useState<ContactValues>({phone: '', address: EMPTY_ADDRESS});
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
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
    const nextContactErrors = validateContact(contact);
    setContactErrors(nextContactErrors);
    if (Object.keys(nextContactErrors).length > 0) {
      setErrorMessage('Please complete your mobile number and address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await registerCustomer({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        phone: cleanPhone(contact.phone),
        address: {
          street: contact.address.street.trim(),
          barangay: contact.address.barangay.trim(),
          city: contact.address.city.trim(),
          province: contact.address.province.trim(),
          landmark: contact.address.landmark.trim()
        }
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
        description="Only registered customers can order. Your mobile number and address help the shop confirm real orders and keep everyone safe from scams."
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

        <fieldset className="space-y-5 rounded-2xl border-2 border-dashed border-ink/30 p-4">
          <legend className="px-1 font-sans text-base font-extrabold">Contact and address</legend>
          <p className="text-sm text-ink-soft">Shown only to the shop, to confirm and prepare your orders.</p>
          <ContactFields
            value={contact}
            onChange={next => {
              setContact(next);
              setContactErrors({});
            }}
            errors={contactErrors}
            disabled={isSubmitting}
          />
        </fieldset>

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
