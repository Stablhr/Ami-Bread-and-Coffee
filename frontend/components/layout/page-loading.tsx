import {LogoGirl} from '@/components/brand/logo';

export function PageLoading({label = 'Loading…'}: {label?: string}) {
  return (
    <div role="status" className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <LogoGirl className="w-14 animate-[bounce_1.4s_ease-in-out_infinite]" />
      <p className="font-hand text-xl text-ink-soft">{label}</p>
    </div>
  );
}
