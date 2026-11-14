'use client';

import {useState} from 'react';
import {Eye, EyeOff} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/utils';

export function AuthHeading({kicker, title, description}: {kicker: string; title: string; description?: React.ReactNode}) {
  return (
    <div>
      <p className="font-script text-base text-cocoa">{kicker}</p>
      <h1 className="mt-3 text-4xl text-ink">{title}</h1>
      {description && <p className="mt-3 text-ink-soft">{description}</p>}
    </div>
  );
}

export function FormMessage({tone, children}: {tone: 'error' | 'success'; children: React.ReactNode}) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-xl border-2 px-4 py-3 font-bold',
        tone === 'error' ? 'border-tomato bg-tomato/5 text-tomato' : 'border-leaf bg-leaf/5 text-leaf'
      )}
    >
      {children}
    </div>
  );
}

export function FieldHint({id, children}: {id: string; children: React.ReactNode}) {
  return (
    <p id={id} className="text-sm text-ink-soft">
      {children}
    </p>
  );
}

type PasswordInputProps = Omit<React.ComponentProps<'input'>, 'type'>;

/** Password field with a show/hide toggle. */
export function PasswordInput({className, disabled, ...props}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        {...props}
        disabled={disabled}
        type={visible ? 'text' : 'password'}
        className={cn('pr-14', className)}
      />
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        disabled={disabled}
        className="absolute right-1.5 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-ink-soft hover:bg-paper-deep hover:text-ink"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}
      </button>
    </div>
  );
}

/** Mirrors the backend password rules so people see problems before submitting. */
export const PASSWORD_RULES = [
  {label: 'At least 8 characters', test: (v: string) => v.length >= 8},
  {label: 'An uppercase letter', test: (v: string) => /[A-Z]/.test(v)},
  {label: 'A lowercase letter', test: (v: string) => /[a-z]/.test(v)},
  {label: 'A number', test: (v: string) => /[0-9]/.test(v)},
  {label: 'A symbol, like ! or @', test: (v: string) => /[^A-Za-z0-9]/.test(v)}
];

export function isStrongPassword(value: string) {
  return PASSWORD_RULES.every(rule => rule.test(value));
}

export function PasswordChecklist({id, value}: {id: string; value: string}) {
  return (
    <ul id={id} className="grid gap-1 text-sm sm:grid-cols-2">
      {PASSWORD_RULES.map(rule => {
        const ok = rule.test(value);
        return (
          <li key={rule.label} className={cn('flex items-center gap-2', ok ? 'text-leaf' : 'text-ink-soft')}>
            <span aria-hidden="true" className="font-bold">{ok ? '✓' : '○'}</span>
            {rule.label}
            <span className="sr-only">{ok ? '(done)' : '(missing)'}</span>
          </li>
        );
      })}
    </ul>
  );
}
