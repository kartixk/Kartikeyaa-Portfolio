'use client';

import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

/** Counts up from 0 the first time it scrolls into view. */
export const Counter = ({ value, suffix = '', duration = 1.8, className }: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) { setN(value); return; }
    const c = animate(0, value, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {n}
      {suffix}
    </span>
  );
};

export default Counter;
