import type {Metadata} from 'next';
import Image from 'next/image';
import {Clock, MapPin, MessageCircle, Navigation, Phone} from 'lucide-react';
import {Asterisk, Heart} from '@/components/brand/doodles';
import {SectionHeading} from '@/components/brand/section-heading';
import {OpenStatus} from '@/components/layout/open-status';
import {buttonVariants} from '@/components/ui/button';
import {MAP_DIRECTIONS_URL, MAP_EMBED_URL, SHOP} from '@/lib/shop';

export const metadata: Metadata = {
  title: 'Visit us',
  description: 'Find Ami Bread & Coffee beside Sugarland Estate, Trece Martires City. Open daily 7:00 AM to 9:00 PM.'
};

export default function VisitPage() {
  return (
    <>
      <section className="wood-panel">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.1fr_1fr] md:px-8 md:py-16">
          <SectionHeading
            as="h1"
            tone="wood"
            kicker="come say hi"
            title="Visit the shop"
            description="Find us on the street beside Sugarland Estate in Trece Martires. Come in for a coffee and pick up a loaf on your way home."
          />
          <div className="relative aspect-[4/3] -rotate-1 overflow-hidden rounded-sm border-[10px] border-linen shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)]">
            <Image
              src="/images/shop-interior.webp"
              alt="Inside Ami Bread & Coffee: sourdough on cooling racks by the front window."
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover object-[50%_70%] sepia-[0.15]"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.25fr]">
          <div className="relative rounded-[1.75rem] border-[3px] border-ink bg-linen p-6 md:p-8">
            <Asterisk className="absolute right-6 top-6 size-8 text-ink/70" />
            <h2 className="text-3xl">Shop details</h2>

            <dl className="mt-6 space-y-6">
              <div className="flex gap-4">
                <dt className="shrink-0">
                  <MapPin aria-hidden="true" className="size-6 text-cocoa" />
                  <span className="sr-only">Address</span>
                </dt>
                <dd className="text-lg">
                  {SHOP.address.line1}
                  <br />
                  {SHOP.address.line2}
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="shrink-0">
                  <Clock aria-hidden="true" className="size-6 text-cocoa" />
                  <span className="sr-only">Opening hours</span>
                </dt>
                <dd className="text-lg">
                  Every day, 7:00 AM – 9:00 PM
                  <OpenStatus tone="paper" className="mt-1 flex" />
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="shrink-0">
                  <Phone aria-hidden="true" className="size-6 text-cocoa" />
                  <span className="sr-only">Phone</span>
                </dt>
                <dd className="text-lg">
                  <a href={SHOP.phoneHref} className="font-bold text-cocoa underline decoration-2 underline-offset-4">
                    {SHOP.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="shrink-0">
                  <MessageCircle aria-hidden="true" className="size-6 text-cocoa" />
                  <span className="sr-only">Facebook</span>
                </dt>
                <dd className="text-lg">
                  <a
                    href={SHOP.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-cocoa underline decoration-2 underline-offset-4"
                  >
                    Ami Bread &amp; Coffee on Facebook
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={MAP_DIRECTIONS_URL} target="_blank" rel="noreferrer" className={buttonVariants({size: 'lg'})}>
                <Navigation aria-hidden="true" />
                Get directions
              </a>
              <a href={SHOP.phoneHref} className={buttonVariants({variant: 'outline', size: 'lg'})}>
                <Phone aria-hidden="true" />
                Call us
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border-[3px] border-ink bg-paper-deep">
            <iframe
              title="Map showing Ami Bread & Coffee in Trece Martires"
              src={MAP_EMBED_URL}
              className="h-[380px] w-full grayscale-[0.35] sepia-[0.25] lg:h-full lg:min-h-[460px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <p className="mt-12 text-center font-script text-lg text-cocoa">
          see you soon <Heart className="inline size-4" />
        </p>
      </section>
    </>
  );
}
