import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  /** duration in seconds — lower is faster */
  duration?: number;
}

/**
 * Seamless infinite marquee. Renders two copies of children and translates -50%.
 */
export const Marquee = ({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  duration = 32,
}: MarqueeProps) => {
  return (
    <div className={cn('group flex w-full overflow-hidden mask-fade-x', className)}>
      <div
        className={cn(
          'flex w-max shrink-0 items-center',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
          pauseOnHover && 'group-hover:[animation-play-state:paused]'
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
