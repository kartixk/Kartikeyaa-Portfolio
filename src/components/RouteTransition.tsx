'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
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

const curtain: Variants = {
  idle: { clipPath: 'inset(100% 0% 0% 0%)', transition: { duration: 0 } },
  in: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } },
  out: { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
};

/** Wraps the app: soft-navigates behind a full-screen vermillion wipe instead of a hard cut. */
export const RouteTransitionProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const [phase, setPhase] = useState<Phase>('idle');
  const [label, setLabel] = useState('');
  const busy = useRef(false);
  const target = useRef<string | null>(null);

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
      setPhase('in');
      window.setTimeout(() => router.push(href), 720);
    },
    [pathname, reduce, router, lenis]
  );

  // New route is mounted → jump to top under the curtain, then lift it.
  useEffect(() => {
    if (!busy.current || pathname !== target.current) return;
    lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0);
    const t = window.setTimeout(() => setPhase('out'), 200);
    return () => window.clearTimeout(t);
  }, [pathname, lenis]);

  // Safety net: never leave the curtain stuck if a navigation stalls.
  useEffect(() => {
    if (phase !== 'in') return;
    const t = window.setTimeout(() => setPhase('out'), 6000);
    return () => window.clearTimeout(t);
  }, [phase]);

  return (
    <Ctx.Provider value={{ go }}>
      {children}
      <motion.div
        aria-hidden
        variants={curtain}
        initial="idle"
        animate={phase}
        onAnimationComplete={(def) => {
          if (def === 'out') {
            busy.current = false;
            target.current = null;
            setPhase('idle');
          }
        }}
        className={`fixed inset-0 z-[90] flex items-end justify-between bg-grad-pan p-6 text-[#120d24] md:p-12 ${phase === 'idle' ? 'pointer-events-none' : 'pointer-events-auto'}`}
      >
        <span className="font-mono text-xs font-medium uppercase tracking-[0.22em]">Kartikeya ®</span>
        <span className="display text-[clamp(3rem,13vw,11rem)]">{label}</span>
      </motion.div>
    </Ctx.Provider>
  );
};
