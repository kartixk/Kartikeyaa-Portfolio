'use client';

import { memo, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Calm backdrop: a fine dot grid, one faint accent glow that drifts, and a soft spotlight that trails
 * the pointer (via CSS vars — no React re-renders on mouse move).
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
      {/* fine dot grid, faded toward the bottom */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: 'radial-gradient(rgb(var(--line) / 0.16) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, transparent 85%)',
          maskImage: 'linear-gradient(to bottom, #000 0%, transparent 85%)',
        }}
      />
      <div
        className="absolute -right-[15vw] -top-[20vh] h-[55vmax] w-[55vmax] animate-drift rounded-full blur-[120px] will-change-transform"
        style={{ background: 'radial-gradient(circle, hsl(var(--c-lime)) 0%, transparent 62%)', opacity: 'var(--blob)' }}
      />
      <div
        ref={spot}
        className="absolute inset-0"
        style={{ background: 'radial-gradient(480px circle at var(--mx, 50%) var(--my, 30%), hsl(var(--c-lime) / 0.07), transparent 70%)' }}
      />
    </div>
  );
});
Aurora.displayName = 'Aurora';

export default Aurora;
