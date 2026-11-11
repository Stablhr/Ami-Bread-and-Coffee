import Link from "next/link";
import { OpenStatus } from "@/components/sections/open-status";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-double border-terracotta bg-paper/95 backdrop-blur">
      <div className="mx-auto flex min-h-[72px] max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 md:px-8">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-display text-2xl text-espresso md:text-[28px]">
            Ami Bread &amp; Coffee
          </span>
          <span className="font-accent text-lg text-terracotta">
            baked in Trece Martires
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <nav aria-label="Main" className="flex items-center gap-1 font-sans text-base">
            <Link className="min-h-[44px] rounded px-3 py-2 hover:bg-parchment" href="/">
              Home
            </Link>
            <Link className="min-h-[44px] rounded px-3 py-2 hover:bg-parchment" href="/menu">
              Menu
            </Link>
          </nav>
          <Link
            href="/sign-in"
            className="min-h-[44px] rounded-md bg-terracotta px-4 py-2 font-sans text-base font-semibold text-parchment hover:bg-espresso"
          >
            Sign in
          </Link>
        </div>
      </div>
      <div className="border-t border-terracotta/30 bg-parchment/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-1.5 md:px-8">
          <OpenStatus />
          <p className="hidden font-sans text-sm text-espresso/80 sm:block">
            Order by 6:00 PM the day before
          </p>
        </div>
      </div>
    </header>
  );
}
