'use client';

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Custom cursor for fine pointers: a dot that follows instantly and a ring that trails it.
 * Anything with `data-cursor="Label"` turns the ring into a labelled bubble; links/buttons grow it.
 */
export const Cursor = () => {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 180, damping: 22, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 180, damping: 22, mass: 0.5 });

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setEnabled(true);
    document.documentElement.classList.add('has-cursor');

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest) return;
      setLabel(t.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? null);
      setHover(!!t.closest('a, button, [role="button"], input, textarea, label, summary'));
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);
    const dn = () => setDown(true);
    const up = () => setDown(false);

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('pointerdown', dn);
    window.addEventListener('pointerup', up);
    document.documentElement.addEventListener('mouseleave', leave);
    document.documentElement.addEventListener('mouseenter', enter);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', dn);
      window.removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('mouseleave', leave);
      document.documentElement.removeEventListener('mouseenter', enter);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  const labelled = !!label;
  const size = labelled ? 92 : hover ? 56 : 14;

  return (
    <>
      {/* ring / bubble */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[120]"
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
      >
        {/* plain wrapper owns the centring so it never fights Framer's transform */}
        <div className="-translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{
              width: size,
              height: size,
              scale: down ? 0.85 : 1,
              backgroundColor: labelled ? 'hsl(76 96% 58%)' : hover ? 'rgb(255 255 255)' : 'rgb(255 255 255 / 0)',
              borderColor: labelled ? 'hsl(76 96% 58%)' : 'rgb(255 255 255)',
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="grid place-items-center rounded-full border"
            style={{ mixBlendMode: labelled ? 'normal' : 'difference' }}
          >
            <motion.span
              animate={{ opacity: labelled ? 1 : 0, scale: labelled ? 1 : 0.6 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0c0f0a]"
            >
              {label}
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
      {/* dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[121] mix-blend-difference"
        style={{ x, y, opacity: visible && !labelled ? 1 : 0 }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white" />
      </motion.div>
    </>
  );
};

export default Cursor;
