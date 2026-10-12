'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES, SITE } from '@/lib/site';
import { experiences, projects, RESUME_URL } from '@/lib/data';
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

/** Each page borrows a frame of the hero painting as its backdrop — hover the list and the sky changes with it. */
const MENU_FRAME: Record<string, number> = { '/': 6, '/projects': 30, '/experience': 52, '/about': 74, '/contact': 94 };
const frameUrl = (n: number) => `/hero-frames/f${String(n).padStart(3, '0')}.webp`;
const MENU_HINT: Record<string, string> = {
  '/': 'Back to the start',
  '/projects': `${projects.length} case studies`,
  '/experience': `${experiences[0].company} and earlier`,
  '/about': 'The person behind it',
  '/contact': 'Say hello',
};

const Navbar = () => {
  const pathname = usePathname();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [origin, setOrigin] = useState('calc(100% - 3rem) 3.4rem');
  const menuBtn = useRef<HTMLButtonElement>(null);
  const [navHover, setNavHover] = useState<string | null>(null);
  const activePath = quick.find((r) => (r.path === '/' ? pathname === '/' : pathname === r.path || pathname.startsWith(`${r.path}/`)))?.path ?? null;
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
        {/* frosted glass, so the pill takes on whatever is behind it (sky, page, menu) instead of sitting on it as a black slab */}
        <div
          onMouseLeave={() => setNavHover(null)}
          className="pointer-events-auto flex max-w-full items-center gap-1 rounded-full border border-white/15 bg-[#0d1117]/60 p-1.5 text-white shadow-[0_18px_50px_-20px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl backdrop-saturate-150"
        >
          <TransitionLink href="/" className="group flex items-center rounded-full" aria-label="Home — Kartikeya">
            <span className="grid h-10 place-items-center rounded-full bg-[#f4f1e8] px-3 transition-transform duration-300 group-hover:scale-[1.04]">
              <Eyes />
            </span>
          </TransitionLink>

          <nav aria-label="Primary" className="ml-1 hidden items-center md:flex">
            {quick.map((r) => {
              const active = r.path === '/' ? pathname === '/' : pathname === r.path || pathname.startsWith(`${r.path}/`);
              const lit = (navHover ?? activePath) === r.path;
              return (
                <TransitionLink
                  key={r.path}
                  href={r.path}
                  onMouseEnter={() => setNavHover(r.path)}
                  onFocus={() => setNavHover(r.path)}
                  onBlur={() => setNavHover(null)}
                  aria-current={active ? 'page' : undefined}
                  className={cn('relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200', lit || active ? 'text-white' : 'text-white/65')}
                >
                  {lit && (
                    <motion.span
                      layoutId="nav-lens"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className={cn('absolute inset-0 rounded-full', active && navHover === null ? 'bg-white/[0.16]' : 'bg-white/10')}
                    />
                  )}
                  <span className="relative">{r.label}</span>
                </TransitionLink>
              );
            })}
          </nav>

          <span aria-hidden className="mx-1.5 hidden h-5 w-px bg-white/15 md:block" />

          <ThemeToggle className="!h-10 !w-10 !border-white/15 !text-white hover:!bg-white hover:!text-[#0d1117]" />

          <button
            ref={menuBtn}
            onClick={() => {
              const r = menuBtn.current?.getBoundingClientRect();
              if (r) setOrigin(`${Math.round(r.left + r.width / 2)}px ${Math.round(r.top + r.height / 2)}px`);
              setOpen((v) => !v);
            }}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="group flex h-10 items-center gap-2.5 rounded-full bg-white px-4 text-sm font-semibold text-[#0d1117] transition-transform duration-200 hover:scale-[1.03] active:scale-95"
          >
            <span className="relative block h-2.5 w-4">
              <motion.span animate={open ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }} className="absolute left-0 top-0 h-[1.5px] w-full bg-current" />
              <motion.span animate={open ? { rotate: -45, y: -4.5 } : { rotate: 0, y: 0 }} className="absolute bottom-0 left-0 h-[1.5px] w-full bg-current" style={{ top: 'auto' }} />
            </span>
            <span>{open ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: `circle(0px at ${origin})` }}
            animate={{ clipPath: `circle(160vmax at ${origin})` }}
            exit={{ clipPath: `circle(0px at ${origin})` }}
            transition={{ duration: 0.9, ease }}
            className="fixed inset-0 z-[65] overflow-hidden bg-[#0b2447] text-white"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            onMouseLeave={() => setHover(null)}
          >
            {/* backdrop: one frame of the painting per page, cross-faded; scrim keeps text readable */}
            {menuRoutes.map((r) => {
              const on = (hover ?? (menuRoutes.some((m) => m.path === pathname) ? pathname : '/')) === r.path;
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={r.path}
                  src={frameUrl(MENU_FRAME[r.path])}
                  alt=""
                  aria-hidden
                  className={cn('absolute inset-0 h-full w-full scale-105 object-cover transition-opacity duration-700', on ? 'opacity-100' : 'opacity-0')}
                />
              );
            })}
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,22,48,0.78),rgba(6,22,48,0.35)_60%,rgba(6,22,48,0.55))]" />

            <div className="wrap relative flex h-full flex-col justify-center gap-10 pb-10 pt-28 lg:grid lg:grid-cols-[1.5fr_1fr] lg:items-center lg:gap-16">
              <ul className="group/menu">
                {menuRoutes.map((r, i) => {
                  const active = pathname === r.path;
                  return (
                    <li key={r.path} className="overflow-hidden">
                      <motion.div
                        initial={{ y: '110%' }}
                        animate={{ y: '0%', transition: { delay: 0.3 + i * 0.07, duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
                        exit={{ y: '110%', transition: { duration: 0.3 } }}
                      >
                        <TransitionLink
                          href={r.path}
                          onClick={() => setTimeout(() => setOpen(false), 120)}
                          onMouseEnter={() => setHover(r.path)}
                          onFocus={() => setHover(r.path)}
                          className="group flex items-center gap-4 py-1.5 transition-opacity duration-300 group-hover/menu:opacity-35 hover:!opacity-100 focus-visible:!opacity-100 md:gap-6"
                        >
                          <span className="w-7 font-mono text-xs tracking-widest text-white/55">0{i + 1}</span>
                          <span className="display relative text-[clamp(2.4rem,7.2vw,6.2rem)] leading-[1.02] transition-transform duration-500 group-hover:translate-x-3">
                            {r.label}
                            {active && <span aria-hidden className="absolute -right-5 top-[0.28em] h-2.5 w-2.5 rounded-full bg-[hsl(var(--c-lime))]" />}
                          </span>
                          <span className="hidden -translate-x-2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 md:block">
                            {MENU_HINT[r.path]}
                          </span>
                        </TransitionLink>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>

              {/* glass card: where I am, how to reach me */}
              <motion.aside
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.65, duration: 0.7 } }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border border-white/15 bg-white/10 p-6 text-sm backdrop-blur-xl md:p-7"
              >
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--c-lime))] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--c-lime))]" />
                  </span>
                  Now
                </p>
                <p className="display mt-3 text-2xl leading-tight">{experiences[0].role}</p>
                <p className="mt-1 text-white/70">{experiences[0].company}</p>

                <div className="my-6 h-px bg-white/15" />

                <a href={`mailto:${SITE.email}`} className="display block break-all text-xl underline-offset-4 hover:underline">
                  {SITE.email}
                </a>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    { label: 'GitHub', href: SITE.github, ext: true },
                    { label: 'LinkedIn', href: SITE.linkedin, ext: true },
                    { label: 'Resume', href: RESUME_URL, ext: false },
                  ].map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      {...(l.ext ? { target: '_blank', rel: 'noopener noreferrer' } : { download: 'kartikeya-resume.pdf' })}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3.5 py-1.5 font-medium transition-colors hover:bg-white hover:text-[#0b2447]"
                    >
                      {l.label} {l.ext ? <ArrowUpRight size={14} /> : '↓'}
                    </a>
                  ))}
                </div>

                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">
                  Visakhapatnam, IN · <LocalTime />
                </p>
              </motion.aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
