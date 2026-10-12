'use client';

import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { cn } from '@/lib/utils';

interface VelocityMarqueeProps {
  children: ReactNode;
  /** base speed in % of one copy per second */
  speed?: number;
  /** -1 drifts left→ (default), 1 the other way */
  direction?: 1 | -1;
  /** ease down to half speed while the pointer is over the band */
  slowOnHover?: boolean;
  className?: string;
}

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/** Marquee that drifts on its own and surges (and flips) with your scroll speed. */
export const VelocityMarquee = ({ children, speed = 3, direction = -1, slowOnHover = true, className }: VelocityMarqueeProps) => {
  const reduce = useReducedMotion();
  const hovered = useRef(false);
  const pace = useMotionValue(1); // 1 = full speed, eases toward 0.5 on hover
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [-1500, 0, 1500], [-5, 0, 5], { clamp: false });
  const xPct = useTransform(x, (v) => `${v}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const target = slowOnHover && hovered.current ? 0.5 : 1;
    pace.set(pace.get() + (target - pace.get()) * Math.min(1, (delta / 1000) * 6));
    const b = boost.get();
    // scrolling up flips the direction, scrolling fast surges the speed
    const dirNow = direction * (b < -0.3 ? -1 : 1);
    x.set(wrap(-50, 0, x.get() + dirNow * speed * pace.get() * (delta / 1000) * (1 + Math.abs(b))));
  });

  return (
    <div
      className={cn('flex w-full overflow-hidden whitespace-nowrap', className)}
      onPointerEnter={() => (hovered.current = true)}
      onPointerLeave={() => (hovered.current = false)}
    >
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
