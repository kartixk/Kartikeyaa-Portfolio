'use client';

import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface VelocityMarqueeProps {
  children: ReactNode;
  /** base speed in % of one copy per second */
  speed?: number;
  /** -1 drifts left→ (default), 1 the other way */
  direction?: 1 | -1;
  className?: string;
}

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/** Marquee that drifts on its own and surges (and flips) with your scroll speed. */
export const VelocityMarquee = ({ children, speed = 3, direction = -1, className }: VelocityMarqueeProps) => {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [-1500, 0, 1500], [-5, 0, 5], { clamp: false });
  const xPct = useTransform(x, (v) => `${v}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const b = boost.get();
    // scrolling up flips the direction, scrolling fast surges the speed
    const dirNow = direction * (b < -0.3 ? -1 : 1);
    x.set(wrap(-50, 0, x.get() + dirNow * speed * (delta / 1000) * (1 + Math.abs(b))));
  });

  return (
    <div className={cn('flex w-full overflow-hidden whitespace-nowrap', className)}>
      <motion.div style={{ x: xPct }} className="flex w-max shrink-0">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default VelocityMarquee;
