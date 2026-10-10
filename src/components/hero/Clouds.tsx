'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useReady } from '@/components/ready';

/** [cx, cy, r] in a 1440×360 box */
const BACK: [number, number, number][] = [
  [110, 235, 175], [400, 285, 150], [720, 300, 165], [1030, 280, 155], [1320, 230, 190],
];
const FRONT: [number, number, number][] = [
  [40, 300, 215], [300, 355, 150], [560, 385, 130], [720, 400, 150], [880, 385, 130], [1140, 355, 155], [1400, 290, 225],
];
const BUBBLES: [number, number, number, number][] = [
  [170, 105, 20, 0], [236, 160, 34, 1], [112, 190, 13, 2], [1262, 82, 24, 0.5], [1352, 150, 40, 1.5], [1214, 168, 12, 2.5], [1400, 215, 20, 3],
];

/**
 * Layered clouds + floating bubbles along the bottom of the hero. Two separate SVGs so the character can sit
 * between them: `back` (cream) goes behind her, `front` (the page background colour) covers the base of the body
 * and blends the hero into the next section.
 */
export const CloudsBack = () => {
  const reduce = useReducedMotion();
  const ready = useReady();
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 1440 360"
      preserveAspectRatio="xMidYMax slice"
      initial={{ y: 90, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : undefined}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[max(44svh,25vw)] min-h-[16rem] w-full"
    >
      {BACK.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#ece9c4" />
      ))}
      {BUBBLES.map(([cx, cy, r, d]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#fbf9e2" className={reduce ? '' : 'animate-float'} style={{ animationDelay: `${d}s`, animationDuration: `${5 + d}s` }} />
      ))}
    </motion.svg>
  );
};

export const CloudsFront = () => {
  const ready = useReady();
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 1440 360"
      preserveAspectRatio="xMidYMax slice"
      initial={{ y: 120 }}
      animate={ready ? { y: 0 } : undefined}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[max(36svh,25vw)] min-h-[13rem] w-full"
    >
      <rect x="0" y="300" width="1440" height="80" fill="hsl(var(--background))" />
      {FRONT.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="hsl(var(--background))" />
      ))}
    </motion.svg>
  );
};
