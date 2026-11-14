import Image from 'next/image';
import Link from 'next/link';
import {cn} from '@/lib/utils';

/** The shop's real logo: the girl carrying a loaf. Terracotta line art. */
export function LogoGirl({className, priority}: {className?: string; priority?: boolean}) {
  return (
    <Image
      src="/brand/logo-girl.png"
      alt=""
      aria-hidden="true"
      width={290}
      height={406}
      priority={priority}
      className={cn('h-auto w-12', className)}
    />
  );
}

/** The hand-lettered "ami" wordmark. Takes the current text colour. */
export function Wordmark({className}: {className?: string}) {
  return <span aria-hidden="true" className={cn('wordmark w-24 text-ink', className)} />;
}

/** Logo + wordmark + "bread & coffee", used in the header. */
export function BrandLockup({className}: {className?: string}) {
  return (
    <Link
      href="/"
      className={cn('group flex items-center gap-2.5 rounded-lg', className)}
      aria-label="Ami Bread & Coffee, home"
    >
      <LogoGirl priority className="w-10 transition-transform group-hover:-rotate-6 md:w-11" />
      <span className="flex flex-col items-start leading-none">
        <Wordmark className="w-[84px] md:w-[96px]" />
        <span className="-mt-0.5 pl-1 font-hand text-sm tracking-[0.18em] text-ink-soft">
          bread &amp; coffee
        </span>
      </span>
    </Link>
  );
}
