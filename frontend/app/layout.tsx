import type {Metadata} from 'next';
import {Fraunces, Homemade_Apple, Nunito_Sans, Patrick_Hand} from 'next/font/google';
import './globals.css';
import {cn} from '@/lib/utils';
import ReactQueryProvider from '@/lib/provider/ReactQueryProvider';
import {SHOP} from '@/lib/shop';

// Soft vintage serif for headings.
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['SOFT', 'WONK', 'opsz'],
  variable: '--font-fraunces'
});

// Hand-printed letters, like the item names on the shop's printed menu.
const patrick = Patrick_Hand({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-patrick'
});

// Scratchy script, like "fresh from home". Large accents only.
const homemade = Homemade_Apple({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-homemade'
});

// Clean, friendly body and form text.
const nunito = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-ui'
});

export const metadata: Metadata = {
  title: {
    default: `${SHOP.name} · fresh from home`,
    template: `%s · ${SHOP.name}`
  },
  description:
    'Sourdough breads, scones, focaccia, pasta and coffee, fresh from home in Trece Martires City, Cavite.'
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html
      lang="en"
      className={cn(
        'h-full antialiased',
        fraunces.variable,
        patrick.variable,
        homemade.variable,
        nunito.variable
      )}
    >
      <body className="flex min-h-full flex-col">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
