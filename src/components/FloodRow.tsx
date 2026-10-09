import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Row that floods with the signal colour from the bottom on hover. */
const FloodRow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('group relative overflow-hidden border-t border-line/15 transition-colors duration-500 hover:text-primary-foreground', className)}>
    <span
      aria-hidden
      className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform [transition-duration:600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
    />
    <div className="relative">{children}</div>
  </div>
);

export default FloodRow;
