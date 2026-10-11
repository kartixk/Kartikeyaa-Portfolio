'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Exported canvas of the portrait (public/avatar/center.webp). */
const W = 900;
const H = 1013;

// soften the sleeves where the artwork meets the frame
const SIDE_MASK = 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)';

/** Furthest the portrait ever drifts from rest, in px. Small on purpose: depth, not wobble. */
const REACH = 6;

const clamp = (v: number, a = -1, b = 1) => Math.min(b, Math.max(a, v));

/**
 * The illustrated portrait: one solid image, never deformed.
 * It only translates a few pixels against the cursor (a parallax cue against the clouds behind it) with eased,
 * frame-rate independent smoothing — no rotation, no skew, no split layers, no idle bobbing.
 *  - mouse / pen: tiny parallax
 *  - touch / prefers-reduced-motion: perfectly still
 * Motion is written straight to the DOM from one rAF loop that sleeps once it has settled and while off-screen.
 */
export const Avatar = ({ className }: { className?: string }) => {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (reduce) return;
    // hover-capable pointers only: on touch the portrait stays put
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = root.current;
    if (!el) return;

    let raf = 0;
    let visible = true;
    let tx = 0, ty = 0, x = 0, y = 0;
    let last = performance.now();

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(64, now - last);
      last = now;
      const k = 1 - Math.exp(-dt * 0.004); // slow, soft settle
      x += (tx - x) * k;
      y += (ty - y) * k;
      if (img.current) img.current.style.transform = `translate3d(${(x * REACH).toFixed(2)}px, ${(y * REACH * 0.5).toFixed(2)}px, 0)`;
      // keep going only while there is movement left to draw
      if (Math.abs(tx - x) > 0.002 || Math.abs(ty - y) > 0.002) raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf && visible) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const move = (e: PointerEvent) => {
      // -1…1 across the viewport, inverted so the portrait leans slightly away from the cursor
      tx = clamp(-((e.clientX / window.innerWidth) * 2 - 1));
      ty = clamp(-((e.clientY / window.innerHeight) * 2 - 1));
      wake();
    };
    const leave = () => {
      tx = 0;
      ty = 0;
      wake();
    };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, [reduce]);

  return (
    <div ref={root} role="img" aria-label="Illustrated portrait of Kartikeya" className={cn('block w-full select-none', className)}>
      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}`, maskImage: SIDE_MASK, WebkitMaskImage: SIDE_MASK }}>
        <img
          ref={img}
          src="/avatar/center.webp"
          alt=""
          width={W}
          height={H}
          draggable={false}
          decoding="async"
          fetchPriority="high"
          className="pointer-events-none absolute inset-0 h-full w-full will-change-transform"
        />
      </div>
    </div>
  );
};

export default Avatar;
