import { cn } from '@/lib/utils';

/** Splits a word into letters that each react to hover (springy lift + tint). */
export const SplitChars = ({ text, className }: { text: string; className?: string }) => (
  <span aria-label={text} className={cn('inline-block', className)}>
    {text.split('').map((c, i) => (
      <span key={i} aria-hidden className="char">
        {c}
      </span>
    ))}
  </span>
);

export default SplitChars;
