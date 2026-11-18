'use client';

import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import type {Address} from '@/lib/api/authApi';
import {isPhMobile} from '@/lib/address';

export type ContactValues = {phone: string; address: Address};
export type ContactErrors = Partial<Record<'phone' | 'street' | 'barangay' | 'city' | 'province', string>>;

/** Checks the same rules as the backend (backend/api/dtos/contact.dto.ts). */
export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!isPhMobile(values.phone)) errors.phone = 'Enter your mobile number, e.g. 0917 123 4567.';
  if (values.address.street.trim().length < 3) errors.street = 'Enter your house no. and street.';
  if (values.address.barangay.trim().length < 2) errors.barangay = 'Enter your barangay or subdivision.';
  if (values.address.city.trim().length < 2) errors.city = 'Enter your city or municipality.';
  if (values.address.province.trim().length < 2) errors.province = 'Enter your province.';
  return errors;
}

function Field({
  id,
  label,
  error,
  hint,
  ...input
}: React.ComponentProps<'input'> & {id: string; label: string; error?: string; hint?: string}) {
  const describedBy = error || hint ? `${id}-help` : undefined;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={Boolean(error) || undefined} aria-describedby={describedBy} {...input} />
      {(error || hint) && (
        <p id={describedBy} className={error ? 'text-sm font-bold text-tomato' : 'text-sm text-ink-soft'}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

/**
 * Mobile number + address. Registered customers must give these so the shop
 * can contact them and avoid prank / scam orders.
 */
export function ContactFields({
  value,
  onChange,
  errors = {},
  disabled
}: {
  value: ContactValues;
  onChange: (next: ContactValues) => void;
  errors?: ContactErrors;
  disabled?: boolean;
}) {
  const setAddress = (key: keyof Address, text: string) =>
    onChange({...value, address: {...value.address, [key]: text}});

  return (
    <div className="space-y-5">
      <Field
        id="phone"
        label="Mobile number"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="0917 123 4567"
        value={value.phone}
        onChange={e => onChange({...value, phone: e.target.value})}
        error={errors.phone}
        hint="The shop will text or call you about your order."
        disabled={disabled}
        required
      />
      <Field
        id="street"
        label="House no. and street"
        autoComplete="address-line1"
        placeholder="e.g. Blk 2 Lot 5, Mabini St."
        value={value.address.street}
        onChange={e => setAddress('street', e.target.value)}
        error={errors.street}
        disabled={disabled}
        maxLength={120}
        required
      />
      <Field
        id="barangay"
        label="Barangay / subdivision"
        autoComplete="address-line2"
        placeholder="e.g. Sugarland Estate"
        value={value.address.barangay}
        onChange={e => setAddress('barangay', e.target.value)}
        error={errors.barangay}
        disabled={disabled}
        maxLength={80}
        required
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="city"
          label="City / municipality"
          autoComplete="address-level2"
          value={value.address.city}
          onChange={e => setAddress('city', e.target.value)}
          error={errors.city}
          disabled={disabled}
          maxLength={80}
          required
        />
        <Field
          id="province"
          label="Province"
          autoComplete="address-level1"
          value={value.address.province}
          onChange={e => setAddress('province', e.target.value)}
          error={errors.province}
          disabled={disabled}
          maxLength={80}
          required
        />
      </div>
      <Field
        id="landmark"
        label="Landmark (optional)"
        placeholder="e.g. Near the chapel, green gate"
        value={value.address.landmark}
        onChange={e => setAddress('landmark', e.target.value)}
        disabled={disabled}
        maxLength={120}
      />
    </div>
  );
}
