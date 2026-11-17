'use client';

import {useState} from 'react';
import {Save} from 'lucide-react';
import {FormMessage} from '@/components/auth/form-bits';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {ContactFields, validateContact, type ContactErrors, type ContactValues} from './contact-fields';
import type {MeUser} from '@/lib/api/authApi';
import {getFriendlyErrorMessage} from '@/lib/api/getFriendlyErrorMessage';
import {cleanPhone, EMPTY_ADDRESS} from '@/lib/address';
import {useUpdateProfile} from '@/lib/hooks/auth/useUpdateProfile';

/** Edit name, mobile number and address (account page and checkout). */
export function ProfileForm({
  user,
  submitLabel = 'Save details',
  onSaved,
  onCancel
}: {
  user: MeUser;
  submitLabel?: string;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const save = useUpdateProfile();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [contact, setContact] = useState<ContactValues>({
    phone: user.phone ?? '',
    address: user.address ?? EMPTY_ADDRESS
  });
  const [errors, setErrors] = useState<ContactErrors & {name?: string}>({});

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: ContactErrors & {name?: string} = validateContact(contact);
    if (!firstName.trim() || !lastName.trim()) nextErrors.name = 'Enter your first and last name.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    save.mutate(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: cleanPhone(contact.phone),
        address: {
          street: contact.address.street.trim(),
          barangay: contact.address.barangay.trim(),
          city: contact.address.city.trim(),
          province: contact.address.province.trim(),
          landmark: contact.address.landmark.trim()
        }
      },
      {onSuccess: () => onSaved?.()}
    );
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-first">First name</Label>
          <Input id="profile-first" autoComplete="given-name" value={firstName} onChange={e => setFirstName(e.target.value)} maxLength={60} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-last">Last name</Label>
          <Input id="profile-last" autoComplete="family-name" value={lastName} onChange={e => setLastName(e.target.value)} maxLength={60} />
        </div>
      </div>
      {errors.name && <p className="text-sm font-bold text-tomato">{errors.name}</p>}

      <ContactFields
        value={contact}
        onChange={next => {
          setContact(next);
          setErrors({});
        }}
        errors={errors}
        disabled={save.isPending}
      />

      {save.isError && <FormMessage tone="error">{getFriendlyErrorMessage(save.error, 'We could not save your details.')}</FormMessage>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={save.isPending}>
          <Save aria-hidden="true" />
          {save.isPending ? 'Saving…' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={save.isPending}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
