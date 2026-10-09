'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useReady } from '@/components/ready';
import { ASCII_COLS, ASCII_PORTRAIT } from '@/lib/ascii-portrait';
import { cn } from '@/lib/utils';

const RAMP = '.,:;-~=+*oxX#%@';
const ROWS = ASCII_PORTRAIT.length;
const FINAL = ASCII_PORTRAIT.join('\n');
// monospace advance is 0.6em, so width = 0.6 * cols * font-size
const EM_PER_WIDTH = ASCII_COLS * 0.6;

/** deterministic 0..1 noise so the reveal order is stable between frames */
const hash = (x: number, y: number) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
};
const rand = () => RAMP[Math.floor(Math.random() * RAMP.length)];

/** Render with every glyph whose `reveal(x,y)` is false replaced by noise. */
const compose = (reveal: (x: number, y: number) => boolean) =>
  ASCII_PORTRAIT.map((line, y) => {
    let out = '';
    for (let x = 0; x < line.length; x++) {
      const c = line[x];
      out += c === ' ' || reveal(x, y) ? c : rand();
    }
    return out;
  }).join('\n');

/**
 * Interactive ASCII portrait for the hero.
 * - types itself in as a diagonal wave of noise resolving into the face
 * - glyphs light up in a soft circle around the cursor
 * - every few seconds a band of rows glitches
 * Size is driven by the `--w` CSS variable on the element (set it via className).
 */
export const AsciiPortrait = ({ className }: { className?: string }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const base = useRef<HTMLPreElement>(null);
  const hi = useRef<HTMLPreElement>(null);
  const reduce = useReducedMotion();
  const ready = useReady();

  const paint = (text: string) => {
    if (base.current) base.current.textContent = text;
    if (hi.current) hi.current.textContent = text;
  };
  const show = () => {
    if (base.current) base.current.style.opacity = '1';
    if (hi.current) hi.current.style.opacity = '1';
  };

  // intro + idle glitch
  useEffect(() => {
    if (!ready) return;
    if (reduce) {
      paint(FINAL);
      show();
      return;
    }
    let raf = 0;
    let glitchTimer = 0;
    let glitchEnd = 0;
    const DURATION = 2200;
    const t0 = performance.now();
    show();

    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / DURATION);
      // wave travels top-left → bottom-right, with per-glyph jitter
      const front = p * 1.5;
      paint(compose((x, y) => (x / ASCII_COLS) * 0.45 + (y / ROWS) * 0.75 + hash(x, y) * 0.25 < front));
      if (p < 1) raf = requestAnimationFrame(step);
      else {
        paint(FINAL);
        glitchTimer = window.setInterval(() => {
          const start = Math.floor(Math.random() * (ROWS - 6));
          const span = 3 + Math.floor(Math.random() * 4);
          paint(compose((_x, y) => y < start || y >= start + span));
          window.clearTimeout(glitchEnd);
          glitchEnd = window.setTimeout(() => paint(FINAL), 130);
        }, 3200);
      }
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(glitchTimer);
      window.clearTimeout(glitchEnd);
    };
    // paint/show only touch refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, reduce]);

  // cursor spotlight (CSS vars only — no re-renders)
  useEffect(() => {
    const el = wrap.current;
    if (!el || reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--ax', `${e.clientX - r.left}px`);
      el.style.setProperty('--ay', `${e.clientY - r.top}px`);
    };
    const leave = () => {
      el.style.removeProperty('--ax');
      el.style.removeProperty('--ay');
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, [reduce]);

  const mask = 'radial-gradient(circle 200px at var(--ax, 50%) var(--ay, 30%), #000 0%, rgba(0,0,0,0.55) 45%, transparent 100%)';

  return (
    <div ref={wrap} aria-hidden className={cn('pointer-events-none select-none', className)}>
      <div className="relative" style={{ width: 'var(--w)', height: `calc(var(--w) / ${EM_PER_WIDTH} * ${ROWS})`, fontSize: `calc(var(--w) / ${EM_PER_WIDTH})` }}>
        <pre
          ref={base}
          className="absolute inset-0 m-0 whitespace-pre font-mono leading-none text-foreground/35 opacity-0 transition-opacity duration-700"
        >
          {FINAL}
        </pre>
        <pre
          ref={hi}
          className="absolute inset-0 m-0 whitespace-pre font-mono font-medium leading-none text-pink opacity-0 transition-opacity duration-700"
          style={{ maskImage: mask, WebkitMaskImage: mask }}
        >
          {FINAL}
        </pre>
      </div>
    </div>
  );
};

export default AsciiPortrait;
