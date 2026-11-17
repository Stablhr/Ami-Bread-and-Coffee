'use client';

import {useState} from 'react';
import {Mail, MapPin, Pencil, Phone, UserRound} from 'lucide-react';
import {SignOutButton} from '@/components/auth/sign-out-button';
import {FormMessage} from '@/components/auth/form-bits';
import {Asterisk} from '@/components/brand/doodles';
import {Button} from '@/components/ui/button';
import {ProfileForm} from './profile-form';
import {hasOrderingProfile, type MeUser} from '@/lib/api/authApi';
import {formatAddress} from '@/lib/address';
import {formatPhone} from '@/lib/orders';

/** "Your details" card on /account, with an inline edit form. */
export function AccountDetails({user}: {user: MeUser}) {
  const complete = hasOrderingProfile(user);
  const [editing, setEditing] = useState(!complete);
  const [saved, setSaved] = useState(false);

  return (
    <section aria-labelledby="profile-heading" className="relative self-start rounded-[1.75rem] border-[3px] border-ink bg-linen p-6">
      <Asterisk className="absolute right-5 top-5 size-7 text-ink/60" />
      <h2 id="profile-heading" className="text-2xl">Your details</h2>

      {!complete && (
        <div className="mt-4">
          <FormMessage tone="error">Add your mobile number and address so you can order.</FormMessage>
        </div>
      )}
      {saved && complete && !editing && (
        <div className="mt-4">
          <FormMessage tone="success">Your details are saved.</FormMessage>
        </div>
      )}

      {editing ? (
        <div className="mt-5">
          <ProfileForm
            user={user}
            onSaved={() => {
              setSaved(true);
              setEditing(false);
            }}
            onCancel={complete ? () => setEditing(false) : undefined}
          />
        </div>
      ) : (
        <>
          <dl className="mt-4 space-y-3 text-lg">
            <div className="flex items-start gap-3">
              <dt><UserRound aria-hidden="true" className="mt-1 size-5 text-cocoa" /><span className="sr-only">Name</span></dt>
              <dd>{user.firstName} {user.lastName}</dd>
            </div>
            <div className="flex items-start gap-3">
              <dt><Mail aria-hidden="true" className="mt-1 size-5 text-cocoa" /><span className="sr-only">Email</span></dt>
              <dd className="break-all">{user.email}</dd>
            </div>
            <div className="flex items-start gap-3">
              <dt><Phone aria-hidden="true" className="mt-1 size-5 text-cocoa" /><span className="sr-only">Mobile number</span></dt>
              <dd>{user.phone ? formatPhone(user.phone) : <span className="text-ink-soft">No mobile number yet</span>}</dd>
            </div>
            <div className="flex items-start gap-3">
              <dt><MapPin aria-hidden="true" className="mt-1 size-5 text-cocoa" /><span className="sr-only">Address</span></dt>
              <dd>
                {user.address ? formatAddress(user.address) : <span className="text-ink-soft">No address yet</span>}
                {user.address?.landmark && <span className="block text-base text-ink-soft">Landmark: {user.address.landmark}</span>}
              </dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Pencil aria-hidden="true" />
              Edit details
            </Button>
            <SignOutButton />
          </div>
        </>
      )}
    </section>
  );
}
