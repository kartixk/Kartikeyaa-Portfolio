'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Exported canvas of every pose (public/avatar). All poses share one body position. */
const W = 900;
const H = 1013;

const POSES = ['center', 'left', 'right', 'up', 'down', 'blink'] as const;
type Pose = (typeof POSES)[number];

// head poses end below the collar; the front-facing body always sits underneath, so shoulders never jump
const HEAD_MASK = 'linear-gradient(to bottom, #000 60%, transparent 73%)';
const BODY_MASK = 'linear-gradient(to bottom, transparent 54%, #000 66%)';
// soften the sleeves where the artwork meets the frame
const SIDE_MASK = 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)';

const clamp = (v: number, a = -1, b = 1) => Math.min(b, Math.max(a, v));

/** thresholds with hysteresis, so the pose never flickers while the cursor hovers near a boundary */
const ENTER = 0.3;
const LEAVE = 0.17;
const SWAP_MS = 110;

/**
 * The illustrated portrait.
 *
 * Faces are NEVER blended: blending two different faces looks like a double exposure. Instead the head snaps between
 * the hand-made poses (the new one dissolves in over a fully opaque previous one in ~110 ms, so there is no
 * see-through moment), and all the smoothness comes from continuous 3D motion applied to the whole figure
 * (turn, tilt, lean) that tracks the cursor with easing. A dead-zone + hysteresis stops the pose from flickering.
 *
 *  - mouse / pen: follows the pointer; idle for ~3 s → glances around on its own
 *  - touch: idle glancing only
 *  - prefers-reduced-motion: stays on the front-facing pose
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

    let current: Pose = 'center';
    let previous: Pose | null = null;
    let cleanup = 0;

    const layer = (p: Pose) => layers.current[p];

    /** hard-swap to a pose: it fades in over the (still opaque) old one, then the old one is released */
    const show = (next: Pose, ms = SWAP_MS) => {
      if (next === current) return;
      const incoming = layer(next);
      const outgoing = layer(current);
      if (!incoming || !outgoing) return;
      window.clearTimeout(cleanup);
      if (previous && previous !== next) {
        const stale = layer(previous);
        if (stale) { stale.style.transition = 'none'; stale.style.opacity = '0'; stale.style.zIndex = '0'; }
      }
      outgoing.style.zIndex = '1';
      outgoing.style.opacity = '1';
      incoming.style.transition = 'none';
      incoming.style.opacity = '0';
      incoming.style.zIndex = '2';
      void incoming.offsetWidth; // commit the 0 so the next change animates
      incoming.style.transition = `opacity ${ms}ms linear`;
      incoming.style.opacity = '1';
      previous = current;
      current = next;
      cleanup = window.setTimeout(() => {
        const old = previous && layer(previous);
        if (old) { old.style.transition = 'none'; old.style.opacity = '0'; old.style.zIndex = '0'; }
        previous = null;
      }, ms + 40);
    };

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.4; // roughly the face
      tx = clamp((e.clientX - cx) / (window.innerWidth * 0.34));
      ty = clamp((e.clientY - cy) / (window.innerHeight * 0.42));
      lastInput = performance.now();
    };
    const leave = () => { lastInput = -1e9; };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      // no input for a while (or on touch) → look around on his own, dwelling on each look
      if (now - lastInput > 3200) {
        tx = clamp(Math.sin(now / 2300) * 2.6, -0.85, 0.85);
        ty = clamp(Math.sin(now / 3700 + 1.3) * 2.2, -0.7, 0.7) * 0.5;
      }
      // critically-damped-ish easing, frame-rate independent
      const k = 1 - Math.exp(-0.0075 * 16.7);
      x += (tx - x) * k;
      y += (ty - y) * k;

      // which head pose? dominant axis wins, with hysteresis
      const ax = Math.abs(x), ay = Math.abs(y * 1.25);
      const axis: 'x' | 'y' = ax >= ay ? 'x' : 'y';
      const mag = axis === 'x' ? ax : ay;
      const wanted: Pose = axis === 'x' ? (x > 0 ? 'left' : 'right') : y < 0 ? 'up' : 'down';
      let target: Pose;
      if (current !== 'center' && current !== 'blink') {
        // already turned: stay until clearly back near the middle (or switch to another direction past ENTER)
        target = mag < LEAVE ? 'center' : mag > ENTER && wanted !== current ? wanted : current;
      } else {
        target = mag > ENTER ? wanted : 'center';
      }

      // blink, only while facing the camera
      if (now > nextBlink) { blinkUntil = now + 140; nextBlink = now + 2800 + Math.random() * 3600; }
      if (target === 'center' && now < blinkUntil) target = 'blink';
      else if (current === 'blink' && target === 'center') target = 'center';

      show(target, target === 'blink' || current === 'blink' ? 35 : SWAP_MS);

      // continuous motion: this is what makes it feel smooth between the discrete poses
      if (body.current) {
        const bob = Math.sin(now / 1500) * 2;
        body.current.style.transform =
          `perspective(1100px) translate3d(${(x * 16).toFixed(2)}px, ${(y * 7 + bob).toFixed(2)}px, 0) ` +
          `rotateY(${(x * 7).toFixed(2)}deg) rotateX(${(-y * 4).toFixed(2)}deg) rotate(${(x * 1.2).toFixed(2)}deg)`;
      }
    };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(cleanup);
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
        {/* steady body (front-facing), always underneath */}
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
            style={{ opacity: p === 'center' ? 1 : 0, zIndex: p === 'center' ? 1 : 0, maskImage: HEAD_MASK, WebkitMaskImage: HEAD_MASK }}
          />
        ))}
      </div>
    </div>
  );
};

export default Avatar;
