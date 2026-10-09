'use client';

import { memo, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Living background: three blurred colour blobs that drift on their own, plus a soft spotlight
 * that trails the pointer (via CSS vars — no React re-renders on mouse move).
 */
const Aurora = memo(() => {
  const spot = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = spot.current;
    if (!el || reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = 0;
    let tx = window.innerWidth / 2, ty = window.innerHeight / 3, x = tx, y = ty;
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, [reduce]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div
        className="absolute -left-[12vw] -top-[18vh] h-[60vmax] w-[60vmax] animate-drift rounded-full blur-[110px] will-change-transform"
        style={{ background: 'radial-gradient(circle, hsl(var(--c-violet)) 0%, transparent 62%)', opacity: 'var(--blob)' }}
      />
      <div
        className="absolute -right-[18vw] top-[10vh] h-[55vmax] w-[55vmax] animate-drift rounded-full blur-[120px] will-change-transform"
        style={{ background: 'radial-gradient(circle, hsl(var(--c-pink)) 0%, transparent 62%)', opacity: 'calc(var(--blob) * 0.8)', animationDelay: '-8s', animationDuration: '28s' }}
      />
      <div
        className="absolute -bottom-[25vh] left-[18vw] h-[50vmax] w-[50vmax] animate-drift rounded-full blur-[120px] will-change-transform"
        style={{ background: 'radial-gradient(circle, hsl(var(--c-cyan)) 0%, transparent 62%)', opacity: 'calc(var(--blob) * 0.55)', animationDelay: '-15s', animationDuration: '32s' }}
      />
      <div
        ref={spot}
        className="absolute inset-0"
        style={{ background: 'radial-gradient(520px circle at var(--mx, 50%) var(--my, 30%), hsl(var(--c-orange) / 0.14), transparent 70%)' }}
      />
    </div>
  );
});
Aurora.displayName = 'Aurora';

export default Aurora;
