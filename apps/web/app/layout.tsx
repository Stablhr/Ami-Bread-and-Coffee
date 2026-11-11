import type {Metadata} from 'next';
import {DM_Serif_Display, Lora, Nunito_Sans, Caveat} from 'next/font/google';
import './globals.css';
import {cn} from '@/lib/utils';
import ReactQueryProvider from '@/lib/provider/ReactQueryProvider';

const display = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display-loaded'
});

const body = Lora({
  subsets: ['latin'],
  variable: '--font-body-loaded'
});

const ui = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-ui-loaded'
});

const accent = Caveat({
  subsets: ['latin'],
  variable: '--font-accent-loaded'
});

export const metadata: Metadata = {
  title: 'Ami Bread & Coffee',
  description: 'Pre-order sourdough bread, scones, toast, focaccia, and coffee for pickup or delivery in Trece Martires City.',
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        display.variable,
        body.variable,
        ui.variable,
        accent.variable
      )}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-body)]">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
