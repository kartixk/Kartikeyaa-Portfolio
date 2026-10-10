'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Exported canvas of the portrait (public/avatar/center.webp). */
const W = 900;
const H = 1013;

// One image, two layers: the head (top) and the shoulders (bottom) overlap only across the neck, so the head can turn
// and tilt from the neck while the body barely moves. No second face is ever drawn.
const HEAD_MASK = 'linear-gradient(to bottom, #000 56%, transparent 66%)';
const BODY_MASK = 'linear-gradient(to bottom, transparent 53%, #000 57%)';
// soften the sleeves where the artwork meets the frame
const SIDE_MASK = 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)';

const clamp = (v: number, a = -1, b = 1) => Math.min(b, Math.max(a, v));

/**
 * The illustrated portrait. A single front-facing image whose head follows the cursor in 3D (turn, tilt, lean)
 * with eased, frame-rate independent smoothing, plus a slow breathing sway.
 *  - mouse / pen: follows the pointer; idle for ~3 s → looks around on its own
 *  - touch: idle looking-around only
 *  - prefers-reduced-motion: perfectly still
 * Motion is written straight to the DOM from one rAF loop that pauses while the hero is off-screen.
 */
export const Avatar = ({ className }: { className?: string }) => {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLImageElement>(null);
  const body = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (reduce) return;
    const el = root.current;
    if (!el) return;

    let raf = 0;
    let visible = true;
    let tx = 0, ty = 0, x = 0, y = 0;
    let last = performance.now();
    let lastInput = -1e9;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.4; // roughly the face
      tx = clamp((e.clientX - cx) / (window.innerWidth * 0.36));
      ty = clamp((e.clientY - cy) / (window.innerHeight * 0.44));
      lastInput = performance.now();
    };
    const leave = () => { lastInput = -1e9; };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(64, now - last);
      last = now;
      if (!visible) return;

      // no input for a while (or on touch) → look around on his own
      if (now - lastInput > 3200) {
        tx = clamp(Math.sin(now / 2300) * 1.7, -0.8, 0.8);
        ty = clamp(Math.sin(now / 3700 + 1.3) * 1.5, -0.6, 0.6) * 0.5;
      }
      // frame-rate independent easing; the head leads, the shoulders follow a beat later
      const k = 1 - Math.exp(-dt * 0.0075);
      x += (tx - x) * k;
      y += (ty - y) * k;

      const bob = Math.sin(now / 1500) * 2.2;
      if (head.current) {
        head.current.style.transform =
          `perspective(1000px) translate3d(${(x * 12).toFixed(2)}px, ${(y * 6 + bob).toFixed(2)}px, 0) ` +
          `rotateY(${(x * 9).toFixed(2)}deg) rotateX(${(-y * 6).toFixed(2)}deg) rotate(${(x * 2.2).toFixed(2)}deg)`;
      }
      if (body.current) {
        body.current.style.transform = `translate3d(${(x * 4).toFixed(2)}px, ${(bob * 0.5).toFixed(2)}px, 0) rotate(${(x * 0.5).toFixed(2)}deg)`;
      }
    };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, [reduce]);

  const layer = 'pointer-events-none absolute inset-0 h-full w-full will-change-transform';

  return (
    <div ref={root} role="img" aria-label="Illustrated portrait of Kartikeya" className={cn('block w-full select-none', className)}>
      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}`, maskImage: SIDE_MASK, WebkitMaskImage: SIDE_MASK }}>
        {/* shoulders */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={body} src="/avatar/center.webp" alt="" width={W} height={H} draggable={false} decoding="async" fetchPriority="high" className={layer} style={{ maskImage: BODY_MASK, WebkitMaskImage: BODY_MASK, transformOrigin: '50% 100%' }} />
        {/* head — pivots from the neck */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={head} src="/avatar/center.webp" alt="" width={W} height={H} draggable={false} decoding="async" className={layer} style={{ maskImage: HEAD_MASK, WebkitMaskImage: HEAD_MASK, transformOrigin: '50% 60%' }} />
      </div>
    </div>
  );
};

export default Avatar;
