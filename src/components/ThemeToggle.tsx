import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme !== 'light';

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg border border-line/12 bg-line/[0.04] text-foreground transition-colors hover:border-brand-2/50 hover:text-brand-2 ${className}`}
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? 'moon' : 'sun'}
            initial={{ y: 14, opacity: 0, rotate: -40 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -14, opacity: 0, rotate: 40 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute"
          >
            {isDark ? <Moon size={16} /> : <Sun size={16} />}
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  );
};

export default ThemeToggle;
