import Link from "next/link";

const messengerUrl =
  process.env.NEXT_PUBLIC_SHOP_MESSENGER_URL ?? "https://m.me/ami-bread-and-coffee";
const phone = process.env.NEXT_PUBLIC_SHOP_PHONE ?? "";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t-2 border-double border-terracotta bg-parchment">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-display text-2xl text-espresso">Ami Bread &amp; Coffee</p>
          <p className="mt-2 max-w-xs text-base text-espresso/90">
            Small-batch sourdough, scones, and coffee, baked for pickup and delivery
            in Trece Martires City, Cavite.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-lg font-bold uppercase tracking-wide text-terracotta">
            Shop hours
          </h2>
          <p className="mt-2 text-base text-espresso">Open daily</p>
          <p className="text-base text-espresso">7:00 AM – 9:00 PM</p>
          <p className="mt-2 text-base text-espresso/90">
            Orders close 6:00 PM the day before pickup or delivery.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-lg font-bold uppercase tracking-wide text-terracotta">
            Get in touch
          </h2>
          <ul className="mt-2 space-y-2 font-sans text-base">
            <li>
              <a className="underline decoration-terracotta/50 underline-offset-4 hover:text-terracotta" href={messengerUrl}>
                Message us on Messenger
              </a>
            </li>
            {phone ? (
              <li>
                <a className="underline decoration-terracotta/50 underline-offset-4 hover:text-terracotta" href={`tel:${phone}`}>
                  {phone}
                </a>
              </li>
            ) : null}
            <li>
              <Link className="underline decoration-terracotta/50 underline-offset-4 hover:text-terracotta" href="/menu">
                Browse the menu
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-terracotta/30">
        <p className="mx-auto max-w-6xl px-5 py-4 font-sans text-sm text-espresso/80 md:px-8">
          © {new Date().getFullYear()} Ami Bread &amp; Coffee · Trece Martires City, Cavite
        </p>
      </div>
    </footer>
  );
}
