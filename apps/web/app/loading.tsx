export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5" role="status" aria-live="polite">
      <div className="text-center">
        <p className="font-accent text-3xl text-terracotta">One moment</p>
        <p className="mt-2 text-lg text-espresso">Warming the oven…</p>
      </div>
    </div>
  );
}
