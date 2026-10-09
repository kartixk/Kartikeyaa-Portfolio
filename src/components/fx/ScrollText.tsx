'use client';

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface ScrollTextProps {
  text: string;
  /** words (lower-case, no punctuation) rendered in the serif italic accent */
  highlight?: string[];
  className?: string;
}

const Word = ({ word, range, progress, em, reduce }: { word: string; range: [number, number]; progress: MotionValue<number>; em: boolean; reduce: boolean }) => {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <span className="relative mr-[0.28em] inline-block">
      <motion.span style={{ opacity: reduce ? 1 : opacity }} className={cn(em && 'serif text-gradient')}>
        {word}
      </motion.span>
    </span>
  );
};

/** Paragraph whose words light up one by one as you scroll through it. */
export const ScrollText = ({ text, highlight = [], className }: ScrollTextProps) => {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');
  const set = new Set(highlight.map((h) => h.toLowerCase()));

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 1.6 / words.length);
        const clean = w.toLowerCase().replace(/[^a-z0-9-]/g, '');
        return <Word key={i} word={w} range={[start, end]} progress={scrollYProgress} em={set.has(clean)} reduce={reduce} />;
      })}
    </p>
  );
};

export default ScrollText;
