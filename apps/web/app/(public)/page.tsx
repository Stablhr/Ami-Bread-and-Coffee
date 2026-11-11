import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper text-espresso">
      <section className="relative overflow-hidden border-b-4 border-double border-terracotta">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-accent text-3xl text-terracotta">Ami Bread & Coffee</p>
            <h1 className="mt-2 font-display text-5xl leading-tight md:text-6xl">
              Freshly baked sourdough, ready when you are.
            </h1>
            <p className="mt-4 text-lg">
              Pre-order bread, scones, toast, focaccia, and coffee for pickup or delivery in Trece Martires City.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="min-h-[48px] rounded-md bg-terracotta px-6 py-3 text-lg font-semibold text-parchment"
              >
                View menu
              </Link>
              <Link
                href="/sign-in"
                className="min-h-[48px] rounded-md border-2 border-terracotta px-6 py-3 text-lg font-semibold text-terracotta"
              >
                Sign in to order
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border-2 border-terracotta">
            <Image
              src="/hero-section.png"
              alt="Ami Bread and Coffee shop hero image"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="font-display text-3xl">How it works</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          <li className="rounded-lg border-2 border-double border-terracotta bg-parchment p-6">
            <span className="font-accent text-2xl text-terracotta">1.</span>
            <p className="mt-2 text-lg">Browse the menu and choose your favorites.</p>
          </li>
          <li className="rounded-lg border-2 border-double border-terracotta bg-parchment p-6">
            <span className="font-accent text-2xl text-terracotta">2.</span>
            <p className="mt-2 text-lg">Pick a date and place your order.</p>
          </li>
          <li className="rounded-lg border-2 border-double border-terracotta bg-parchment p-6">
            <span className="font-accent text-2xl text-terracotta">3.</span>
            <p className="mt-2 text-lg">Track status and pick up or receive delivery.</p>
          </li>
        </ol>
      </section>
    </main>
  );
}
