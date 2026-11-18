import Image from 'next/image';
import {LogoGirl} from '@/components/brand/logo';
import {isUploadedImage, resolveImageUrl} from '@/lib/images';
import {cn} from '@/lib/utils';

/** Square product photo, or the shop logo on paper when there is no photo yet. */
export function ProductPhoto({
  url,
  alt,
  sizes = '96px',
  className
}: {
  url: string | null;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  const src = resolveImageUrl(url);
  return (
    <div className={cn('relative aspect-square overflow-hidden rounded-xl border-2 border-ink/20 bg-paper-deep', className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          unoptimized={isUploadedImage(url)}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center" aria-label="No photo yet" role="img">
          <LogoGirl className="w-1/3 opacity-40" />
        </div>
      )}
    </div>
  );
}
