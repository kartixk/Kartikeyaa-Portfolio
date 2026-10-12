'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** A pair of eyes whose pupils track the cursor (and blink now and then). Pure DOM updates, no re-renders. */
export const Eyes = ({ className }: { className?: string }) => {
  const root = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const move = (e: PointerEvent) => {
      root.current?.querySelectorAll<HTMLElement>('[data-eye]').forEach((eye) => {
        const r = eye.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const m = Math.min(r.width * 0.24, d / 10);
        (eye.firstElementChild as HTMLElement).style.transform = `translate(${(dx / d) * m}px, ${(dy / d) * m}px)`;
      });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [reduce]);

  return (
    <span ref={root} aria-hidden className={cn('inline-flex items-center gap-[3px]', className)}>
      {[0, 1].map((i) => (
        <span
          key={i}
          data-eye
          className="grid h-[1.55rem] w-[1.15rem] animate-eye-blink place-items-center overflow-hidden rounded-[50%] bg-[#f4f5ef] ring-1 ring-black/25"
          style={{ animationDelay: `${i * 0.04}s` }}
        >
          <span className="relative block h-[0.55rem] w-[0.55rem] rounded-full bg-[#101410] transition-transform duration-100 ease-out">
            <span className="absolute left-[1px] top-[1px] h-[0.17rem] w-[0.17rem] rounded-full bg-white/90" />
          </span>
        </span>
      ))}
    </span>
  );
};

export default Eyes;
