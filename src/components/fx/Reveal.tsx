import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ElementType, ReactNode, useMemo } from 'react';

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
  /** Animate on mount instead of on scroll into view */
  immediate?: boolean;
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 38 },
  down: { x: 0, y: -38 },
  left: { x: 48, y: 0 },
  right: { x: -48, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Scroll-triggered reveal. Respects prefers-reduced-motion.
 */
export const Reveal = ({
  children,
  className,
  delay = 0,
  duration = 0.7,
  direction = 'up',
  distance,
  once = true,
  as = 'div',
  immediate = false,
}: RevealProps) => {
  const reduce = useReducedMotion();
  // memoize so the motion component identity stays stable across re-renders
  // (creating it inline would remount children — e.g. drop focus from inputs)
  const MotionTag = useMemo(() => motion(as as ElementType), [as]);
  const base = offsets[direction];
  const off = distance != null ? { x: Math.sign(base.x) * distance, y: Math.sign(base.y) * distance } : base;

  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, x: off.x, y: off.y, filter: 'blur(8px)' },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      {...(immediate
        ? { animate: 'show' }
        : { whileInView: 'show', viewport: { once, margin: '-80px' } })}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
