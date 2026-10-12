'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ROUTES } from '@/lib/site';

type Phase = 'idle' | 'in' | 'out';

const Ctx = createContext<{ go: (href: string) => void }>({ go: () => {} });
export const useRouteTransition = () => useContext(Ctx);

const labelFor = (path: string) => {
  const route = ROUTES.find((r) => r.path === path);
  if (route) return route.label;
  if (path.startsWith('/projects/')) return 'Case study';
  return 'Loading';
};

/** One colour per destination, lifted from the hero painting: peach, sky, meadow, lavender, rose. */
const PALETTE: Record<string, { h: number; s: number; l: number }> = {
  '/': { h: 18, s: 92, l: 70 },
  '/projects': { h: 205, s: 80, l: 68 },
  '/experience': { h: 152, s: 46, l: 58 },
  '/about': { h: 262, s: 56, l: 78 },
  '/contact': { h: 342, s: 78, l: 76 },
};
const colourFor = (path: string) => PALETTE[path] ?? PALETTE['/projects'];

const COLS = 14;
const ROWS = 8;
const CELLS = COLS * ROWS;
const EASE = [0.76, 0, 0.24, 1] as const;

/** Stable per-cell jitter so the mosaic has texture but never changes between renders. */
const jitter = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Counts 0 → 100 while the curtain is down. Purely a pacing device; navigation does not depend on it. */
const Counter = ({ run }: { run: boolean }) => {
  const v = useMotionValue(0);
  const text = useTransform(v, (n) => String(Math.round(n)).padStart(3, '0'));
  const [shown, setShown] = useState('000');
  useMotionValueEvent(text, 'change', setShown);

  useEffect(() => {
    if (!run) {
      v.set(0);
      return;
    }
    const c = animate(v, 100, { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.35 });
    return () => c.stop();
  }, [run, v]);

  return <span className="font-mono text-xs font-medium tabular-nums tracking-[0.2em]">{shown}</span>;
};

/**
 * Wraps the app: soft-navigates behind a ripple of colour tiles. The tiles fill outward from where you clicked,
 * the destination's name lands in the middle, and the new page is revealed by the ripple draining the same way.
 */
export const RouteTransitionProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const [phase, setPhase] = useState<Phase>('idle');
  const [label, setLabel] = useState('');
  const [tone, setTone] = useState(PALETTE['/']);
  const [origin, setOrigin] = useState({ x: 0.5, y: 0.5 });
  const busy = useRef(false);
  const target = useRef<string | null>(null);
  const pointer = useRef({ x: 0.5, y: 0.5 });

  // remember where the last press happened; the ripple starts there
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      pointer.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, []);

  const go = useCallback(
    (href: string) => {
      if (busy.current) return;
      const path = href.split(/[?#]/)[0] || '/';
      if (path === pathname) {
        lenis ? lenis.scrollTo(0, { duration: 1.2 }) : window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (reduce) {
        router.push(href);
        return;
      }
      busy.current = true;
      target.current = path;
      setLabel(labelFor(path));
      setTone(colourFor(path));
      setOrigin(pointer.current);
      setPhase('in');
      window.setTimeout(() => router.push(href), 880);
    },
    [pathname, reduce, router, lenis]
  );

  // New route is mounted → jump to top under the tiles, then drain them.
  useEffect(() => {
    if (!busy.current || pathname !== target.current) return;
    lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0);
    const t = window.setTimeout(() => setPhase('out'), 450);
    return () => window.clearTimeout(t);
  }, [pathname, lenis]);

  // Safety net: never leave the curtain stuck if a navigation stalls.
  useEffect(() => {
    if (phase !== 'in') return;
    const t = window.setTimeout(() => setPhase('out'), 6000);
    return () => window.clearTimeout(t);
  }, [phase]);

  // distance of every tile from the press point, normalised 0..1 (x is aspect-corrected so the ripple is round)
  const { dist, last } = useMemo(() => {
    const aspect = typeof window === 'undefined' ? 16 / 9 : window.innerWidth / Math.max(1, window.innerHeight);
    const d: number[] = [];
    let max = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cx = (c + 0.5) / COLS;
        const cy = (r + 0.5) / ROWS;
        const v = Math.hypot((cx - origin.x) * aspect, cy - origin.y);
        d.push(v);
        max = Math.max(max, v);
      }
    }
    const norm = d.map((v) => v / (max || 1));
    return { dist: norm, last: norm.indexOf(Math.max(...norm)) };
  }, [origin]);

  const covered = phase !== 'idle';

  return (
    <Ctx.Provider value={{ go }}>
      {children}
      <div aria-hidden className={`fixed inset-0 z-[90] ${covered ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
          {Array.from({ length: CELLS }).map((_, i) => {
            const d = dist[i] ?? 0;
            const l = Math.min(86, Math.max(52, tone.l + (jitter(i) - 0.5) * 12));
            const colour = `hsl(${tone.h} ${tone.s}% ${l}%)`;
            return (
              <motion.div
                key={i}
                initial={false}
                animate={phase === 'in' ? { scale: 1.02, opacity: 1 } : phase === 'out' ? { scale: 0, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={
                  phase === 'in'
                    ? { duration: 0.36, ease: EASE, delay: d * 0.46 }
                    : phase === 'out'
                      ? { duration: 0.42, ease: EASE, delay: d * 0.5 }
                      : { duration: 0 }
                }
                onAnimationComplete={() => {
                  if (phase === 'out' && i === last) {
                    busy.current = false;
                    target.current = null;
                    setPhase('idle');
                  }
                }}
                style={{ background: colour, boxShadow: `0 0 0 1px ${colour}` }}
              />
            );
          })}
        </div>

        {/* destination name lands in the middle once the tiles have closed; counter and mark sit in the corners */}
        <motion.div
          initial={false}
          animate={{ opacity: phase === 'in' ? 1 : 0, y: phase === 'in' ? 0 : phase === 'out' ? -18 : 18 }}
          transition={{ duration: 0.45, delay: phase === 'in' ? 0.55 : 0, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex flex-col justify-between p-6 text-[#0c0f0a] md:p-12"
        >
          <span className="font-mono text-xs font-medium uppercase tracking-[0.22em] opacity-70">Kartikeya ®</span>
          <div className="text-center">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] opacity-60">Now opening</p>
            <span className="display text-[clamp(3rem,13vw,11rem)] leading-[0.95]">{label}</span>
          </div>
          <div className="flex justify-end">
            <Counter run={phase === 'in'} />
          </div>
        </motion.div>
      </div>
    </Ctx.Provider>
  );
};
