import Link from 'next/link';
import {LogoGirl} from '@/components/brand/logo';
import {buttonVariants} from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <LogoGirl className="w-20" />
      <p className="mt-6 font-script text-lg text-cocoa">oops</p>
      <h1 className="mt-3 text-4xl">This page went out of the oven</h1>
      <p className="mt-3 max-w-md text-lg text-ink-soft">
        We couldn&apos;t find what you were looking for. Let&apos;s get you back to the bread.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants({size: 'lg'})}>
          Back to home
        </Link>
        <Link href="/menu" className={buttonVariants({variant: 'outline', size: 'lg'})}>
          See the menu
        </Link>
      </div>
    </main>
  );
}
