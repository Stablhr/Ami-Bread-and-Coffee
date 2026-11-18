import Link from 'next/link';
import {ArrowRight, ClipboardList, CookingPot, Store} from 'lucide-react';

const CARDS = [
  {
    icon: CookingPot,
    title: 'Products',
    body: 'Add, edit or delete products: photos, ingredients, allergens and prices. Mark items sold out.',
    href: '/admin/products'
  },
  {
    icon: ClipboardList,
    title: 'Orders',
    body: 'See every order and who placed it, then move it from "received" to "ready" to "picked up".',
    href: '/admin/orders'
  },
  {icon: Store, title: 'Shop', body: 'Open/closed switch, hours and contact details.'}
];

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <h1 className="font-sans text-3xl font-extrabold">Dashboard</h1>
      <p className="mt-2 text-lg text-ink-soft">What would you like to do?</p>
      <ul className="mt-8 grid gap-5 md:grid-cols-3">
        {CARDS.map(({icon: Icon, title, body, href}) => (
          <li key={title} className="flex flex-col rounded-2xl border-2 border-ink/80 bg-linen p-6">
            <Icon aria-hidden="true" className="size-7 text-cocoa" />
            <h2 className="mt-3 font-sans text-xl font-extrabold">{title}</h2>
            <p className="mt-1 flex-1 text-ink-soft">{body}</p>
            {href ? (
              <Link
                href={href}
                className="mt-4 inline-flex items-center gap-2 font-bold text-cocoa underline decoration-2 underline-offset-4"
              >
                Manage {title.toLowerCase()}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            ) : (
              <p className="mt-4 inline-block self-start rounded-full bg-paper-deep px-3 py-1 text-sm font-bold text-ink-soft">
                Coming soon
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
