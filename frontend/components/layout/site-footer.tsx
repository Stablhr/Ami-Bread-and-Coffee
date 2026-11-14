import Link from 'next/link';
import {Clock, MapPin, MessageCircle, Phone} from 'lucide-react';
import {Asterisk, Heart, OpenCircle} from '@/components/brand/doodles';
import {LogoGirl, Wordmark} from '@/components/brand/logo';
import {MAP_DIRECTIONS_URL, SHOP} from '@/lib/shop';

export function SiteFooter() {
  return (
    <footer className="wood-panel relative overflow-hidden">
      <Asterisk className="absolute right-[8%] top-10 size-10 text-honey/40" />
      <OpenCircle className="absolute right-[18%] top-24 size-4 text-honey/40" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.2fr_1fr_1fr] md:px-8">
        <div>
          <div className="flex items-end gap-3">
            <span className="rounded-2xl bg-paper p-2.5 shadow-[3px_3px_0_0_var(--honey)]">
              <LogoGirl className="w-14" />
            </span>
            <Wordmark className="w-28 text-cream" />
          </div>
          <p className="mt-5 flex items-center gap-2 font-script text-lg text-honey">
            {SHOP.tagline} <Heart className="size-4" />
          </p>
          <p className="mt-3 max-w-xs text-cream/80">
            Sourdough breads, scones, focaccia and coffee from our little shop in Trece Martires.
          </p>
        </div>

        <div>
          <h2 className="font-hand text-2xl tracking-wide text-honey">Visit</h2>
          <ul className="mt-3 space-y-3 text-cream/90">
            <li className="flex gap-3">
              <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-honey" />
              <span>
                {SHOP.address.line1}
                <br />
                {SHOP.address.line2}
              </span>
            </li>
            <li className="flex gap-3">
              <Clock aria-hidden="true" className="mt-1 size-5 shrink-0 text-honey" />
              <span>{SHOP.hours.label}</span>
            </li>
          </ul>
          <a
            href={MAP_DIRECTIONS_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block font-bold text-honey underline decoration-2 underline-offset-4 hover:text-cream"
          >
            Get directions
          </a>
        </div>

        <div>
          <h2 className="font-hand text-2xl tracking-wide text-honey">Say hello</h2>
          <ul className="mt-3 space-y-3 text-cream/90">
            <li>
              <a href={SHOP.phoneHref} className="flex items-center gap-3 hover:text-honey">
                <Phone aria-hidden="true" className="size-5 text-honey" />
                {SHOP.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={SHOP.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 hover:text-honey"
              >
                <MessageCircle aria-hidden="true" className="size-5 text-honey" />
                Message us on Facebook
              </a>
            </li>
          </ul>
          <nav aria-label="Footer" className="mt-6">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 font-hand text-lg">
              <li><Link href="/menu" className="hover:text-honey">Menu</Link></li>
              <li><Link href="/visit" className="hover:text-honey">Visit us</Link></li>
              <li><Link href="/sign-in" className="hover:text-honey">Sign in</Link></li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <p className="mx-auto max-w-6xl px-4 py-5 text-sm text-cream/65 md:px-8">
          © {new Date().getFullYear()} {SHOP.name}. Made with love in Cavite.
        </p>
      </div>
    </footer>
  );
}
