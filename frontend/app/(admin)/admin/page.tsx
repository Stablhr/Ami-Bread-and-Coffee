import {ClipboardList, CookingPot, Store} from 'lucide-react';

const COMING = [
  {icon: ClipboardList, title: 'Orders', body: 'See every order, who placed it, and move it from "received" to "ready".'},
  {icon: CookingPot, title: 'Menu', body: 'Add or edit items and prices, upload photos, mark items sold out.'},
  {icon: Store, title: 'Shop', body: 'Open/closed switch, hours and contact details.'}
];

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <h1 className="font-sans text-3xl font-extrabold">Dashboard</h1>
      <p className="mt-2 text-lg text-ink-soft">
        The owner and cashier dashboard is the next big step. Here&apos;s what will live here:
      </p>
      <ul className="mt-8 grid gap-5 md:grid-cols-3">
        {COMING.map(({icon: Icon, title, body}) => (
          <li key={title} className="rounded-2xl border-2 border-ink/80 bg-linen p-6">
            <Icon aria-hidden="true" className="size-7 text-cocoa" />
            <h2 className="mt-3 font-sans text-xl font-extrabold">{title}</h2>
            <p className="mt-1 text-ink-soft">{body}</p>
            <p className="mt-4 inline-block rounded-full bg-paper-deep px-3 py-1 text-sm font-bold text-ink-soft">
              Coming soon
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
