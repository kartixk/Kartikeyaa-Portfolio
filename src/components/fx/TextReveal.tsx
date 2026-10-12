'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ElementType, ReactNode, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useReady } from '@/components/ready';

interface TextRevealProps {
  /** each entry is one masked line that slides up */
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** animate on mount (after the intro) instead of when scrolled into view */
  immediate?: boolean;
}

/** Headline reveal: every line rises out of its own mask. */
export const TextReveal = ({
  lines,
  as = 'div',
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  immediate = false,
}: TextRevealProps) => {
  const reduce = useReducedMotion();
  const ready = useReady();
  const Tag = useMemo(() => motion.create(as as ElementType), [as]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay } },
  };
  const line: Variants = {
    hidden: reduce ? { opacity: 0 } : { y: '115%', rotate: 3 },
    show: { y: '0%', rotate: 0, opacity: 1, transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      {...(immediate
        ? { animate: ready ? 'show' : 'hidden' }
        : { whileInView: 'show', viewport: { once: true, margin: '-10% 0px' } })}
    >
      {lines.map((content, i) => (
        // the mask has a little vertical slack so descenders and italics are never clipped
        <span key={i} className="block overflow-hidden py-[0.07em] -my-[0.07em]">
          <motion.span variants={line} className={cn('block origin-left will-change-transform', lineClassName)}>
            {content}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

export default TextReveal;
