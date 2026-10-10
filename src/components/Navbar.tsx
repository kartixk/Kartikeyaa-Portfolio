'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowUpRight, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES, SITE } from '@/lib/site';
import { RESUME_URL } from '@/lib/data';
import TransitionLink from '@/components/TransitionLink';
import ThemeToggle from '@/components/ThemeToggle';
import Eyes from '@/components/desk/Eyes';
import LocalTime from '@/components/LocalTime';
import { Magnetic } from '@/components/fx';

const quick = ROUTES.filter((r) => ['/projects', '/about', '/contact'].includes(r.path));
const menuRoutes = ROUTES.filter((r) => r.path !== '/');
const ease = [0.76, 0, 0.24, 1] as const;

const Navbar = () => {
  const pathname = usePathname();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 40);
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
        animate={{ y: hidden && !open ? '-110%' : '0%' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[70]"
      >
        <div
          className={cn(
            'wrap flex h-[76px] items-center justify-between transition-colors duration-500',
            scrolled && !open && 'bg-background/70 backdrop-blur-xl',
            open && 'text-[#0c0f0a]'
          )}
        >
          <TransitionLink href="/" className="group flex items-center gap-2.5" aria-label="Home">
            <span
              className={cn(
                'grid h-10 place-items-center rounded-full px-3 transition-colors duration-300',
                open ? 'bg-[#0c0f0a]' : 'bg-foreground group-hover:bg-lime'
              )}
            >
              <Eyes />
            </span>
            <span className="hidden font-display text-lg font-semibold tracking-tight sm:block">
              Kartikeya<span className="text-primary">®</span>
            </span>
          </TransitionLink>

          <nav aria-label="Primary" className={cn('hidden items-center gap-9 md:flex', open && 'invisible')}>
            {quick.map((r) => {
              const active = pathname === r.path || pathname.startsWith(`${r.path}/`);
              return (
                <TransitionLink
                  key={r.path}
                  href={r.path}
                  className={cn('group relative py-2 text-sm font-medium transition-colors', active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}
                >
                  {r.label}
                  <span
                    className={cn(
                      'absolute -bottom-0.5 left-0 h-px w-full origin-left bg-primary transition-transform duration-500',
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    )}
                  />
                </TransitionLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle className={open ? "!border-[#0c0f0a]/30 !text-[#0c0f0a] hover:!bg-[#0c0f0a] hover:!text-white" : ""} />
            <a
              href={RESUME_URL}
              download="Kartikeya_Resume.pdf"
              className={cn("btn btn-ghost hidden !px-5 !py-3 lg:inline-flex", open && "!invisible")}
            >
              Resume <Download size={14} />
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className={cn("group flex h-11 items-center gap-3 rounded-full pl-5 pr-4 transition-colors hover:bg-grad hover:text-[#0c0f0a]", open ? "bg-[#0c0f0a] text-white" : "bg-foreground text-background")}
            >
              <span className="relative h-5 overflow-hidden text-sm font-semibold">
                <motion.span animate={{ y: open ? '-100%' : '0%' }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="block leading-5">
                  Menu
                </motion.span>
                <motion.span animate={{ y: open ? '-100%' : '0%' }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="block leading-5">
                  Close
                </motion.span>
              </span>
              <span className="relative block h-3 w-4">
                <motion.span animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} className="absolute left-0 top-0 h-[1.5px] w-full bg-current" />
                <motion.span animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }} className="absolute bottom-0 left-0 h-[1.5px] w-full bg-current" style={{ top: 'auto' }} />
              </span>
            </button>
          </div>
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
