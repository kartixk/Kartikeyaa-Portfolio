'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ElementType, ReactNode, useMemo } from 'react';
import { useReady } from '@/components/ready';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: Direction;
  distance?: number;
  once?: boolean;
  as?: ElementType;
  /** Animate on mount (once the intro has finished) instead of on scroll into view */
  immediate?: boolean;
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 48, y: 0 },
  right: { x: -48, y: 0 },
  none: { x: 0, y: 0 },
};

/** Scroll-triggered reveal. Respects prefers-reduced-motion and waits for the intro. */
export const Reveal = ({
  children,
  className,
  delay = 0,
  duration = 0.9,
  direction = 'up',
  distance,
  once = true,
  as = 'div',
  immediate = false,
}: RevealProps) => {
  const reduce = useReducedMotion();
  const ready = useReady();
  // memoised so the motion component identity is stable across re-renders
  const MotionTag = useMemo(() => motion.create(as as ElementType), [as]);
  const base = offsets[direction];
  const off = distance != null ? { x: Math.sign(base.x) * distance, y: Math.sign(base.y) * distance } : base;

  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, x: off.x, y: off.y },
    show: { opacity: 1, x: 0, y: 0, transition: { duration, delay, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      {...(immediate
        ? { animate: ready ? 'show' : 'hidden' }
        : { whileInView: 'show', viewport: { once, margin: '-8% 0px' } })}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
