'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useQueryClient} from '@tanstack/react-query';
import {ArrowLeft, MapPin, Pencil, Phone, Store} from 'lucide-react';
import {ProfileForm} from '@/components/account/profile-form';
import {FormMessage} from '@/components/auth/form-bits';
import {RequireRole} from '@/components/auth/require-role';
import {SectionHeading} from '@/components/brand/section-heading';
import {OrderSummary} from '@/components/cart/order-summary';
import {Button, buttonVariants} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {hasOrderingProfile, type MeUser} from '@/lib/api/authApi';
import {getFriendlyErrorMessage} from '@/lib/api/getFriendlyErrorMessage';
import {useCheckedCart} from '@/lib/cart/use-checked-cart';
import {usePlaceOrder} from '@/lib/hooks/orders/useOrders';
import {formatAddress} from '@/lib/address';
import {formatPhone} from '@/lib/orders';
import {pickupDays, pickupSlots, timeLabel, toPickupIso} from '@/lib/pickup';
import {formatPeso, SHOP} from '@/lib/shop';

export default function CheckoutPage() {
  return <RequireRole role="user">{user => <Checkout user={user} />}</RequireRole>;
}

function Checkout({user}: {user: MeUser}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {lines, orderable, totals, hasUnavailable, clear, menuLoading} = useCheckedCart();
  const place = usePlaceOrder();

  const [days] = useState(() => pickupDays());
  const [day, setDay] = useState(() => days[0]?.value ?? '');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{time?: string; profile?: string}>({});
  const [editingProfile, setEditingProfile] = useState(false);
  const profileComplete = hasOrderingProfile(user);

  const slots = day ? pickupSlots(day) : [];
  const chosenTime = slots.includes(time) ? time : '';

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="font-hand text-2xl">Your cart is empty.</p>
        <Link href="/menu" className={`${buttonVariants({size: 'lg'})} mt-6`}>
          Browse the menu
        </Link>
      </div>
    );
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!profileComplete) nextErrors.profile = 'Add your mobile number and address first.';
    if (!day || !chosenTime) nextErrors.time = 'Choose when you will pick up your order.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || hasUnavailable) return;

    place.mutate(
      {
        items: orderable.map(line => ({menuItemId: line.menuItemId, quantity: line.quantity})),
        pickupAt: toPickupIso(day, chosenTime),
        notes: notes.trim()
      },
      {
        onSuccess: order => {
          clear();
          router.push(`/orders/${order.id}?placed=1`);
        },
        onError: () => {
          // Something may have sold out: re-check the cart against the menu.
          void queryClient.invalidateQueries({queryKey: ['menu', 'live']});
        }
      }
    );
  };

  const dayItems = days.map(d => ({value: d.value, label: d.label}));
  const timeItems = slots.map(slot => ({value: slot, label: timeLabel(slot)}));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16">
      <Link href="/cart" className="inline-flex min-h-11 items-center gap-2 font-bold text-ink-soft hover:text-ink">
        <ArrowLeft aria-hidden="true" className="size-5" />
        Back to cart
      </Link>
      <SectionHeading as="h1" kicker="last step" title="Checkout" className="mt-2" />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div className="space-y-6">
          <section className="rounded-[1.75rem] border-2 border-ink bg-linen p-6">
            <h2 className="text-2xl">Contact and address</h2>
            <p className="mt-1 text-ink-soft">
              The shop uses these to confirm your order. They stay private to the shop.
            </p>
            {!profileComplete || editingProfile ? (
              <div className="mt-5">
                {!profileComplete && (
                  <div className="mb-5">
                    <FormMessage tone="error">
                      {errors.profile ?? 'Please add your mobile number and address before ordering.'}
                    </FormMessage>
                  </div>
                )}
                <ProfileForm
                  user={user}
                  submitLabel="Save and continue"
                  onSaved={() => {
                    setEditingProfile(false);
                    setErrors(prev => ({...prev, profile: undefined}));
                  }}
                  onCancel={profileComplete ? () => setEditingProfile(false) : undefined}
                />
              </div>
            ) : (
              <div className="mt-4 space-y-3 text-lg">
                <p className="font-bold">
                  {user.firstName} {user.lastName}
                  <span className="block text-base font-normal text-ink-soft">{user.email}</span>
                </p>
                <p className="flex items-start gap-2">
                  <Phone aria-hidden="true" className="mt-1 size-5 shrink-0 text-cocoa" />
                  {formatPhone(user.phone ?? '')}
                </p>
                <p className="flex items-start gap-2">
                  <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-cocoa" />
                  <span>
                    {formatAddress(user.address)}
                    {user.address?.landmark && (
                      <span className="block text-base text-ink-soft">Landmark: {user.address.landmark}</span>
                    )}
                  </span>
                </p>
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingProfile(true)}>
                  <Pencil aria-hidden="true" />
                  Change
                </Button>
              </div>
            )}
          </section>

          <form id="checkout-form" onSubmit={submit} noValidate className="rounded-[1.75rem] border-2 border-ink bg-linen p-6">
            <h2 className="text-2xl">Pickup</h2>
            <p className="mt-2 flex items-start gap-2 text-ink-soft">
              <Store aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-cocoa" />
              {SHOP.address.line1}, {SHOP.address.line2}
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pickup-day">Day</Label>
                <Select items={dayItems} value={day || null} onValueChange={value => typeof value === 'string' && setDay(value)}>
                  <SelectTrigger id="pickup-day">
                    <SelectValue placeholder="Choose a day" />
                  </SelectTrigger>
                  <SelectContent>
                    {dayItems.map(item => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickup-time">Time</Label>
                <Select
                  items={timeItems}
                  value={chosenTime || null}
                  onValueChange={value => {
                    if (typeof value === 'string') setTime(value);
                    setErrors(prev => ({...prev, time: undefined}));
                  }}
                >
                  <SelectTrigger id="pickup-time" aria-invalid={Boolean(errors.time) || undefined}>
                    <SelectValue placeholder="Choose a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeItems.map(item => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className={errors.time ? 'mt-2 text-sm font-bold text-tomato' : 'mt-2 text-sm text-ink-soft'}>
              {errors.time ?? 'Pickup between 7:30 AM and 8:30 PM, at least 30 minutes from now.'}
            </p>
            <div className="mt-5 space-y-2">
              <Label htmlFor="notes">Notes for the shop (optional)</Label>
              <Textarea
                id="notes"
                maxLength={300}
                placeholder="e.g. Please slice the bread"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </form>

          <section className="rounded-[1.75rem] border-2 border-dashed border-ink/60 p-6">
            <h2 className="text-2xl">Payment</h2>
            <p className="mt-2 text-lg">Pay at the counter when you pick up your order.</p>
            <p className="text-ink-soft">Online payment (GCash / Maya) is coming soon.</p>
          </section>
        </div>

        <aside className="rounded-[1.75rem] border-[3px] border-ink bg-linen p-6 shadow-[6px_6px_0_0_var(--ink)] lg:sticky lg:top-40">
          <h2 className="text-2xl">Your order</h2>
          <ul className="mt-4 space-y-2">
            {lines.map(line => (
              <li key={line.menuItemId} className="flex justify-between gap-3">
                <span className={line.available ? '' : 'text-tomato line-through'}>
                  {line.quantity} × {line.name}
                </span>
                <span className="tabular-nums">{formatPeso(line.unitPrice * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t-2 border-ink/20 pt-4">
            <OrderSummary {...totals} />
          </div>

          {hasUnavailable && (
            <div className="mt-4">
              <FormMessage tone="error">
                Something in your cart is sold out.{' '}
                <Link href="/cart" className="underline">
                  Update your cart
                </Link>
                .
              </FormMessage>
            </div>
          )}
          {place.isError && (
            <div className="mt-4">
              <FormMessage tone="error">{getFriendlyErrorMessage(place.error, 'We could not place your order. Please try again.')}</FormMessage>
            </div>
          )}

          <Button type="submit" form="checkout-form" size="lg" className="mt-6 w-full" disabled={place.isPending || hasUnavailable || menuLoading || !profileComplete || editingProfile}>
            {place.isPending ? 'Placing your order…' : `Place order · ${formatPeso(totals.total)}`}
          </Button>
          <p className="mt-3 text-sm text-ink-soft">The shop confirms the final total when you pick up.</p>
        </aside>
      </div>
    </div>
  );
}
