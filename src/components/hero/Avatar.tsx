'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Exported canvas of every pose (see public/avatar/size.json). All poses share one body position. */
const W = 900;
const H = 1013;

const POSES = ['center', 'left', 'right', 'up', 'down', 'blink'] as const;
type Pose = (typeof POSES)[number];

// head poses fade out below the collar; the front-facing body always sits underneath, so shoulders never jump or show edges
const HEAD_MASK = 'linear-gradient(to bottom, #000 60%, transparent 73%)';
const BODY_MASK = 'linear-gradient(to bottom, transparent 54%, #000 66%)';

// soften the sleeves where the artwork meets the frame
const SIDE_MASK = 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)';

const clamp = (v: number, a = -1, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const ramp = (v: number, a: number, b: number) => smooth(clamp((v - a) / (b - a), 0, 1));

/**
 * The illustrated portrait. Six hand-made poses are stacked and cross-faded by where the cursor is, so the head
 * turns to follow it (left / right / up / down), with a small body sway on top and an occasional blink.
 *  - mouse / pen: follows the pointer; after a few idle seconds he starts glancing around on his own
 *  - touch / no hover: idle glancing only
 *  - prefers-reduced-motion: stays on the front-facing pose
 * Everything is written straight to the DOM from one rAF loop, which pauses while the hero is off-screen.
 */
export const Avatar = ({ className }: { className?: string }) => {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const layers = useRef<Record<Pose, HTMLImageElement | null>>({ center: null, left: null, right: null, up: null, down: null, blink: null });

  useEffect(() => {
    if (reduce) return;
    const el = root.current;
    if (!el) return;

    let raf = 0;
    let visible = true;
    let tx = 0, ty = 0, x = 0, y = 0;
    let lastInput = -1e9;
    let blinkUntil = 0;
    let nextBlink = performance.now() + 2500;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.4; // roughly the face
      tx = clamp((e.clientX - cx) / (window.innerWidth * 0.34));
      ty = clamp((e.clientY - cy) / (window.innerHeight * 0.42));
      lastInput = performance.now();
    };
    const leave = () => { lastInput = -1e9; };

    const set = (p: Pose, o: number) => {
      const img = layers.current[p];
      if (img) img.style.opacity = o <= 0.002 ? '0' : o.toFixed(3);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      // no input for a while (or on touch) → look around on his own
      if (now - lastInput > 3200) {
        tx = clamp(Math.sin(now / 2300) * 2.6, -0.85, 0.85);
        ty = clamp(Math.sin(now / 3700 + 1.3) * 2.2, -0.7, 0.7) * 0.5;
      }
      x += (tx - x) * 0.085;
      y += (ty - y) * 0.085;

      const l = x > 0 ? ramp(x, 0.06, 0.42) : 0; // Left.png faces the viewer's right
      const r = x < 0 ? ramp(-x, 0.06, 0.42) : 0;
      const u = y < 0 ? ramp(-y, 0.08, 0.46) : 0;
      const d = y > 0 ? ramp(y, 0.08, 0.46) : 0;
      const horiz = Math.max(l, r), vert = Math.max(u, d);
      const useH = horiz >= vert;
      const [L, R_, U, D] = useH ? [l, r, 0, 0] : [0, 0, u, d];
      const strongest = Math.max(L, R_, U, D);

      // blink only when looking roughly straight ahead
      if (now > nextBlink) { blinkUntil = now + 130; nextBlink = now + 2800 + Math.random() * 3600; }
      const blink = now < blinkUntil && strongest < 0.3 ? 1 : 0;

      // the base pose fades out only once an overlay is (almost) fully in, so mid-turns never go see-through
      set('center', 1 - ramp(strongest, 0.9, 1));
      set('left', L);
      set('right', R_);
      set('up', U);
      set('down', D);
      set('blink', blink);

      if (body.current) body.current.style.transform = `translate3d(${(x * 9).toFixed(2)}px, ${(y * 4).toFixed(2)}px, 0) rotate(${(x * 1.4).toFixed(2)}deg)`;
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

  return (
    <div ref={root} role="img" aria-label="Illustrated portrait of Kartikeya, who follows the cursor with his head" className={cn('block w-full select-none', className)}>
      <div
        ref={body}
        className="relative w-full origin-[50%_100%] will-change-transform"
        style={{ aspectRatio: `${W} / ${H}`, maskImage: SIDE_MASK, WebkitMaskImage: SIDE_MASK }}
      >
        {/* steady body */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/avatar/center.webp" alt="" width={W} height={H} draggable={false} decoding="async" className="pointer-events-none absolute inset-0 h-full w-full" style={{ maskImage: BODY_MASK, WebkitMaskImage: BODY_MASK }} />
        {POSES.map((p) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={p}
            ref={(n) => { layers.current[p] = n; }}
            src={`/avatar/${p}.webp`}
            alt=""
            width={W}
            height={H}
            draggable={false}
            decoding="async"
            fetchPriority={p === 'center' ? 'high' : 'low'}
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ opacity: p === 'center' ? 1 : 0, maskImage: HEAD_MASK, WebkitMaskImage: HEAD_MASK }}
          />
        ))}
      </div>
    </div>
  );
};

export default Avatar;
