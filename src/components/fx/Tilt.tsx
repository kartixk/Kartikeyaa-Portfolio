'use client';

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { ReactNode, PointerEvent } from 'react';
import { cn } from '@/lib/utils';

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** max rotation in degrees */
  max?: number;
  /** moving glare highlight */
  glare?: boolean;
}

/** 3D tilt toward the pointer with a travelling glare. Disabled on touch / reduced motion. */
export const Tilt = ({ children, className, max = 8, glare = true }: TiltProps) => {
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgb(255 255 255 / 0.22), transparent 60%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 2 * max);
    rx.set(-(py - 0.5) * 2 * max);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const reset = () => { rx.set(0); ry.set(0); };

  return (
    <div style={{ perspective: 1100 }} className={className}>
      <motion.div onPointerMove={onMove} onPointerLeave={reset} style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }} className={cn('relative h-full w-full')}>
        {children}
        {glare && !reduce && <motion.div aria-hidden style={{ background: glareBg }} className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [div:hover>&]:opacity-100" />}
      </motion.div>
    </div>
  );
};

export default Tilt;
