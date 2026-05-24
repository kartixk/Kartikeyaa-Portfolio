import { motion, useScroll, useTransform, useReducedMotion, type MotionStyle } from 'framer-motion';
import { ElementType, ReactNode, useRef, useMemo } from 'react';

interface ParallaxProps {
  children?: ReactNode;
  className?: string;
  /** drift amount in px across the element's scroll travel; positive = moves up as you scroll */
  amount?: number;
  /** horizontal drift instead of vertical */
  axis?: 'y' | 'x';
  as?: ElementType;
  style?: MotionStyle;
}

/**
 * Scroll-linked parallax drift. The element shifts as it travels through the viewport.
 */
export const Parallax = ({ children, className, amount = 80, axis = 'y', as = 'div', style }: ParallaxProps) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const shift = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  const MotionTag = useMemo(() => motion(as as ElementType), [as]);

  return (
    <MotionTag
      ref={ref}
      className={className}
      style={{ ...(reduce ? {} : axis === 'y' ? { y: shift } : { x: shift }), ...style }}
    >
      {children}
    </MotionTag>
  );
};

export default Parallax;
