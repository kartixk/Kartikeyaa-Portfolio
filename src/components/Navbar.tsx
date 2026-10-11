'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES, SITE } from '@/lib/site';
import { RESUME_URL } from '@/lib/data';
import TransitionLink from '@/components/TransitionLink';
import ThemeToggle from '@/components/ThemeToggle';
import Eyes from '@/components/desk/Eyes';
import LocalTime from '@/components/LocalTime';
import { Magnetic } from '@/components/fx';

const quick = ROUTES.filter((r) => ['/', '/about', '/projects', '/contact'].includes(r.path));
// full-screen menu: just the five pages that matter, in this order
const MENU_ORDER = ['/', '/projects', '/experience', '/about', '/contact'];
const menuRoutes = MENU_ORDER.map((path) => ROUTES.find((r) => r.path === path)!);
const ease = [0.76, 0, 0.24, 1] as const;

const Navbar = () => {
  const pathname = usePathname();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    // hide on the way down, bring back on the way up
    setHidden(y > lastY.current && y > 220);
    lastY.current = y;
  });

  // close after navigation; lock scroll while open
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!lenis) return;
    open ? lenis.stop() : lenis.start();
    return () => lenis.start();
  }, [open, lenis]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? '-130%' : '0%' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed inset-x-0 top-3 z-[70] flex justify-center px-3 sm:top-4"
      >
        <div className="pointer-events-auto flex max-w-full items-center gap-1 rounded-full border border-white/10 bg-[#141714] p-1.5 text-[#f1f2ea] shadow-[0_18px_50px_-18px_rgba(0,0,0,0.7)]">
          <TransitionLink href="/" className="group flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 sm:pr-3" aria-label="Home — Kartikeya">
            <span className="grid h-9 place-items-center rounded-full bg-[#f1f2ea] px-2.5 transition-colors duration-300 group-hover:bg-lime">
              <Eyes />
            </span>
            <span className="hidden items-center gap-2 text-sm font-medium sm:flex">
              Available for work
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
              </span>
            </span>
          </TransitionLink>

          <nav aria-label="Primary" className="hidden items-center md:flex">
            {quick.map((r) => {
              const active = r.path === '/' ? pathname === '/' : pathname === r.path || pathname.startsWith(`${r.path}/`);
              return (
                <TransitionLink
                  key={r.path}
                  href={r.path}
                  className={cn('relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors', active ? 'text-lime' : 'text-[#f1f2ea]/80 hover:text-[#f1f2ea]')}
                >
                  {r.label}
                  {active && <motion.span layoutId="nav-dot" className="absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-lime" />}
                </TransitionLink>
              );
            })}
          </nav>

          <ThemeToggle className="!h-9 !w-9 !border-white/15 !text-[#f1f2ea] hover:!bg-[#f1f2ea] hover:!text-[#141714]" />

          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition-colors hover:bg-[#f1f2ea] hover:text-[#141714]"
          >
            <span className="relative block h-3 w-4">
              <motion.span animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} className="absolute left-0 top-0 h-[1.5px] w-full bg-current" />
              <motion.span animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }} className="absolute bottom-0 left-0 h-[1.5px] w-full bg-current" style={{ top: 'auto' }} />
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.8, ease }}
            className="fixed inset-0 z-[65] flex flex-col bg-grad-pan text-[#0c0f0a]"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="wrap flex flex-1 flex-col justify-center gap-10 pb-10 pt-28 lg:grid lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-16">
              <ul className="group/menu space-y-0.5">
                {menuRoutes.map((r, i) => {
                  const active = pathname === r.path;
                  return (
                    <li key={r.path} className="overflow-hidden">
                      <motion.div
                        initial={{ y: '110%' }}
                        animate={{ y: '0%', transition: { delay: 0.25 + i * 0.06, duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
                        exit={{ y: '110%', transition: { duration: 0.35 } }}
                      >
                        <TransitionLink
                          href={r.path}
                          onClick={() => setTimeout(() => setOpen(false), 120)}
                          className="group flex items-baseline gap-4 py-1 transition-opacity duration-300 group-hover/menu:opacity-40 hover:!opacity-100 md:gap-6"
                        >
                          <span className="font-mono text-xs tracking-widest opacity-50">0{i + 1}</span>
                          <span
                            className={cn(
                              'display relative text-[clamp(2.6rem,9vw,7.5rem)] transition-all duration-500 group-hover:translate-x-3',
                              active && 'underline decoration-[3px] underline-offset-[0.12em]'
                            )}
                          >
                            {r.label}
                          </span>
                          <ArrowUpRight className="h-6 w-6 -translate-x-2 self-center opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 md:h-9 md:w-9" />
                        </TransitionLink>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.7 } }}
                exit={{ opacity: 0 }}
                className="space-y-8 text-sm"
              >
                <div>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] opacity-50">Say hello</p>
                  <a href={`mailto:${SITE.email}`} className="display text-2xl underline-offset-4 hover:underline">
                    {SITE.email}
                  </a>
                </div>
                <div className="flex gap-6">
                  <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="link-u font-medium">GitHub ↗</a>
                  <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="link-u font-medium">LinkedIn ↗</a>
                  <a href={RESUME_URL} download="Kartikeya_Resume.pdf" className="link-u font-medium">Resume ↓</a>
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-50">
                  Visakhapatnam, IN · <LocalTime />
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
