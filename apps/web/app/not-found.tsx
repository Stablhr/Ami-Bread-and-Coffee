import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-5 py-16 text-center">
      <p className="font-accent text-3xl text-terracotta">Off the menu</p>
      <h1 className="mt-2 font-display text-4xl leading-tight md:text-5xl">
        We could not find that page
      </h1>
      <p className="mt-3 text-lg text-espresso">
        The link may be old, or the item may have sold out. Try the menu — there
        is usually something warm on the counter.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/menu"
          className="min-h-[48px] rounded-md bg-terracotta px-6 py-3 font-sans text-lg font-semibold text-parchment hover:bg-espresso"
        >
          Back to the menu
        </Link>
        <Link
          href="/"
          className="min-h-[48px] rounded-md border-2 border-terracotta px-6 py-3 font-sans text-lg font-semibold text-terracotta hover:bg-parchment"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
