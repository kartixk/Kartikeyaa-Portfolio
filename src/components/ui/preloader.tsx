'use client';

import { useEffect, useState } from 'react';
import { animate, motion } from 'framer-motion';

const greetings = ['Hello', 'నమస్తే', 'नमस्ते', 'Bonjour', 'こんにちは', 'Ciao', 'Hola', 'Hello'];

interface PreloaderProps {
  /** fired the moment the panel starts lifting, so the page can begin animating underneath */
  onExit?: () => void;
  onComplete?: () => void;
}

/** 000 → 100 counter over rotating greetings; lifts away with a curved edge. */
export default function Preloader({ onExit, onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [greet, setGreet] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const counter = animate(0, 100, {
      duration: 2.2,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        setLeaving(true);
        onExit?.();
      },
    });
    const g = window.setInterval(() => setGreet((i) => Math.min(i + 1, greetings.length - 1)), 280);
    return () => {
      counter.stop();
      window.clearInterval(g);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ clipPath: 'inset(0% 0% 0% 0% round 0 0 0 0)' }}
      animate={leaving ? { clipPath: 'inset(0% 0% 100% 0% round 0 0 50% 50%)' } : undefined}
      transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => leaving && onComplete?.()}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#0d0a1a] p-6 text-[#f1ecdc] md:p-12"
    >
      <div className="flex items-start justify-between font-mono text-[11px] uppercase tracking-[0.22em]">
        <span>Kartikeya ®</span>
        <span className="text-[#f1ecdc]/60">Portfolio — 2026</span>
      </div>

      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <motion.p
          key={greet}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="serif text-[clamp(2.5rem,8vw,6rem)] text-[#f1ecdc]/90"
        >
          {greetings[greet]}
        </motion.p>
      </div>

      <div className="flex items-end justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#f1ecdc]/60">Loading experience</span>
        <span className="display text-[clamp(5rem,22vw,18rem)] tabular-nums leading-[0.8] text-gradient">
          {String(count).padStart(3, '0')}
        </span>
      </div>
    </motion.div>
  );
}
