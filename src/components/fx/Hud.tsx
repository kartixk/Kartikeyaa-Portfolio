import { cn } from '@/lib/utils';

/** Four sci-fi corner brackets that frame a relative-positioned parent. */
export const HudCorners = ({ className, size = 'h-4 w-4', color = 'border-primary/60' }:
  { className?: string; size?: string; color?: string }) => (
  <div className={cn('pointer-events-none absolute inset-0', className)} aria-hidden>
    <span className={cn('absolute left-0 top-0 border-l-2 border-t-2', size, color)} />
    <span className={cn('absolute right-0 top-0 border-r-2 border-t-2', size, color)} />
    <span className={cn('absolute left-0 bottom-0 border-l-2 border-b-2', size, color)} />
    <span className={cn('absolute right-0 bottom-0 border-r-2 border-b-2', size, color)} />
  </div>
);

export default HudCorners;
