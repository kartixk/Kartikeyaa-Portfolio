'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const SKIN = '#c98d62';
const SKIN_SHADE = '#b3774f';
const HAIR = '#17120f';
const INK = '#2a1a12';

/**
 * Illustrated character (flat vector, drawn in SVG). On fine pointers the head turns toward the cursor and the
 * pupils follow it; the eyes blink on their own. All motion is written straight to the DOM — no re-renders.
 */
export const Avatar = ({ className }: { className?: string }) => {
  const svg = useRef<SVGSVGElement>(null);
  const head = useRef<SVGGElement>(null);
  const pupils = useRef<SVGGElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = 0;
    let tx = 0, ty = 0, x = 0, y = 0;
    const move = (e: PointerEvent) => {
      const r = svg.current?.getBoundingClientRect();
      if (!r) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.45;
      tx = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth * 0.5)));
      ty = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight * 0.5)));
    };
    const tick = () => {
      x += (tx - x) * 0.09;
      y += (ty - y) * 0.09;
      head.current?.setAttribute('transform', `translate(${x * 9} ${y * 5}) rotate(${x * 5} 250 400)`);
      pupils.current?.setAttribute('transform', `translate(${x * 7} ${y * 5})`);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <svg ref={svg} viewBox="0 0 500 560" role="img" aria-label="Illustration of Kartikeya" className={cn('block h-auto w-full overflow-visible', className)}>
      {/* hoodie */}
      <path d="M40 560C40 470 100 428 190 412L310 412C400 428 460 470 460 560Z" fill="#f3f0e2" />
      <path d="M40 560C40 500 70 462 118 440C98 480 94 520 96 560Z" fill="#e2dec9" />
      <path d="M185 412Q250 478 315 412Q250 440 185 412Z" fill="#d6d1ba" />
      <path d="M232 448v52M268 448v52" stroke="#bdb79e" strokeWidth="5" strokeLinecap="round" />

      {/* neck */}
      <path d="M214 352h72v68Q250 452 214 420Z" fill={SKIN_SHADE} />

      {/* head group */}
      <g ref={head} style={{ transformOrigin: '250px 400px' }}>
        {/* ears */}
        <ellipse cx="141" cy="265" rx="17" ry="27" fill={SKIN} />
        <ellipse cx="359" cy="265" rx="17" ry="27" fill={SKIN} />
        <ellipse cx="143" cy="267" rx="8" ry="15" fill={SKIN_SHADE} />
        <ellipse cx="357" cy="267" rx="8" ry="15" fill={SKIN_SHADE} />

        {/* face */}
        <ellipse cx="250" cy="250" rx="110" ry="124" fill={SKIN} />
        <ellipse cx="250" cy="336" rx="70" ry="30" fill={SKIN_SHADE} opacity="0.18" />

        {/* hair */}
        <path d="M138 240C124 150 188 104 256 106C334 108 380 160 362 242C346 208 322 184 288 174C252 194 190 194 154 228Z" fill={HAIR} />
        <path d="M176 134C200 86 292 80 334 128C300 106 232 108 176 134Z" fill={HAIR} />
        <path d="M150 232C150 214 160 196 176 184" stroke={HAIR} strokeWidth="14" strokeLinecap="round" fill="none" />

        {/* brows */}
        <path d="M180 214Q210 198 240 212" stroke={HAIR} strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M260 212Q290 198 320 214" stroke={HAIR} strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* eyes */}
        {[212, 288].map((cx, i) => (
          <g key={cx} className="origin-center animate-eye-blink [transform-box:fill-box]" style={{ animationDelay: `${i * 0.03}s` }}>
            <ellipse cx={cx} cy="256" rx="21" ry="25" fill="#faf8f0" />
          </g>
        ))}
        <g ref={pupils}>
          {[212, 288].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="258" r="11.5" fill={INK} />
              <circle cx={cx - 4} cy="253" r="3.4" fill="#fff" />
            </g>
          ))}
        </g>

        {/* nose + mouth + cheeks */}
        <path d="M244 282Q250 300 262 302" stroke={SKIN_SHADE} strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M218 326Q250 350 282 326" stroke="#5b2f22" strokeWidth="5" strokeLinecap="round" fill="none" />
        <circle cx="186" cy="304" r="16" fill="#e0805e" opacity="0.28" />
        <circle cx="314" cy="304" r="16" fill="#e0805e" opacity="0.28" />
      </g>
    </svg>
  );
};

export default Avatar;
