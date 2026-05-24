import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Magnetic } from '@/components/fx';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Skills', path: '/skills' },
  { label: 'Experience', path: '/experience' },
  { label: 'Education', path: '/education' },
  { label: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
      >
        <div
          className={cn(
            'mx-auto flex max-w-5xl items-center justify-between rounded-md px-4 py-2.5 transition-all duration-500',
            scrolled
              ? 'border border-primary/15 bg-background/70 backdrop-blur-xl shadow-[0_18px_50px_-24px_hsl(186_100%_52%/0.45)]'
              : 'border border-transparent bg-transparent'
          )}
        >
          {/* Logo */}
          <Magnetic strength={0.3}>
            <Link to="/" className="group flex items-center gap-2.5">
              <span className="relative grid h-8 w-8 place-items-center rounded-sm font-hero text-sm font-black text-background"
                style={{ background: 'hsl(var(--primary))' }}>
                K
                <span className="absolute inset-0 rounded-sm blur-md opacity-60 -z-10"
                  style={{ background: 'hsl(var(--primary))' }} />
              </span>
              <span className="font-mono text-sm font-bold uppercase tracking-[0.22em]">
                Kartikeya<span className="text-primary">_</span>
              </span>
            </Link>
          </Magnetic>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map(({ label, path }) => {
              const active = location.pathname === path;
              return (
                <li key={path} className="relative">
                  <Link
                    to={path}
                    className={cn(
                      'relative z-10 block px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-wider transition-colors duration-300',
                      active ? 'text-background' : 'text-muted-foreground hover:text-primary'
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute inset-0 -z-10 clip-tech"
                        style={{ background: 'hsl(var(--primary))' }}
                      />
                    )}
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Theme toggle + mobile toggle */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="grid h-9 w-9 place-items-center rounded-sm border border-primary/20 bg-line/[0.04] text-foreground md:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-1 bg-background/95 px-8 backdrop-blur-2xl md:hidden"
          >
            {navItems.map(({ label, path }, i) => {
              const active = location.pathname === path;
              return (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: 0.06 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={path}
                    className={cn(
                      'flex items-baseline gap-3 py-2 font-display text-4xl font-extrabold tracking-tight',
                      active ? 'gradient-text' : 'text-foreground/80'
                    )}
                  >
                    <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                    {label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
