import {cn} from '@/lib/utils';
import {InkUnderline} from './doodles';

type SectionHeadingProps = {
  id?: string;
  kicker?: string;
  title: string;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  tone?: 'paper' | 'wood';
  as?: 'h1' | 'h2';
  className?: string;
};

/**
 * Script kicker ("fresh from home") + soft serif title + an inked underline,
 * the same rhythm as the headings on the printed menu.
 */
export function SectionHeading({
  id,
  kicker,
  title,
  description,
  align = 'left',
  tone = 'paper',
  as: Tag = 'h2',
  className
}: SectionHeadingProps) {
  const onWood = tone === 'wood';
  return (
    <div className={cn(align === 'center' && 'mx-auto text-center', 'max-w-2xl', className)}>
      {kicker && (
        <p className={cn('font-script text-lg md:text-xl', onWood ? 'text-honey' : 'text-cocoa')}>
          {kicker}
        </p>
      )}
      <Tag
        id={id}
        className={cn(
          'mt-3 text-4xl md:text-5xl',
          onWood ? 'text-cream' : 'text-ink'
        )}
      >
        {title}
      </Tag>
      <InkUnderline
        className={cn(
          'mt-3 w-40 md:w-52',
          align === 'center' && 'mx-auto',
          onWood ? 'text-honey/70' : 'text-ink/70'
        )}
      />
      {description && (
        <p className={cn('mt-4 text-lg', onWood ? 'text-cream/85' : 'text-ink-soft')}>
          {description}
        </p>
      )}
    </div>
  );
}
