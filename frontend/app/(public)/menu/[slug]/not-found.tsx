import Link from 'next/link';
import {LogoGirl} from '@/components/brand/logo';
import {buttonVariants} from '@/components/ui/button';

export default function MenuItemNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <LogoGirl className="w-20" />
      <h1 className="mt-6 text-4xl">We couldn&apos;t find that item</h1>
      <p className="mt-3 text-lg text-ink-soft">It may have sold out for good or moved to a new name.</p>
      <Link href="/menu" className={`${buttonVariants({size: 'lg'})} mt-8`}>
        See the full menu
      </Link>
    </div>
  );
}
