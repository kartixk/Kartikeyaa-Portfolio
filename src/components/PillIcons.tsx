'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Tiny looping data-visualisations used as the icon of each label pill, in place of a generic dot.
 * Each is a 28×20 SVG that "does" what its label says: stack layers sliding, a live trace, a pipeline going green.
 * They stop and sit in a readable resting pose for reduced-motion users.
 */

const BOX = 'h-5 w-7 shrink-0 text-primary';

/** Full-stack, end to end: a request pulse travelling interface → server → database and lighting each as it passes. */
export const FullStackIcon = () => {
  const reduce = useReducedMotion();
  const T = 2.8;
  const glow = (start: number) => ({
    animate: reduce ? undefined : { opacity: [0.35, 0.35, 1, 1, 0.35] },
    transition: { duration: T, repeat: Infinity, ease: 'easeInOut' as const, times: [0, start, start + 0.08, start + 0.3, 1] },
  });
  return (
    <svg viewBox="0 0 28 20" aria-hidden className={BOX} fill="currentColor">
      {/* wire */}
      <rect x={6} y={9.4} width={16} height={1.2} rx={0.6} opacity={0.2} />
      {/* interface */}
      <motion.g initial={{ opacity: reduce ? 1 : 0.35 }} {...glow(0.02)}>
        <rect x={0.8} y={5.5} width={7} height={9} rx={1.6} />
        <rect x={2.2} y={7.1} width={4.2} height={1} rx={0.5} fill="hsl(var(--background))" />
      </motion.g>
      {/* server */}
      <motion.g initial={{ opacity: reduce ? 1 : 0.35 }} {...glow(0.3)}>
        <rect x={10.4} y={5} width={7.2} height={4} rx={1.2} />
        <rect x={10.4} y={10.6} width={7.2} height={4} rx={1.2} />
      </motion.g>
      {/* database */}
      <motion.g initial={{ opacity: reduce ? 1 : 0.35 }} {...glow(0.58)}>
        <ellipse cx={24} cy={6.6} rx={3.4} ry={1.6} />
        <path d="M20.6 8.4 V13 C20.6 14 22.1 14.8 24 14.8 C25.9 14.8 27.4 14 27.4 13 V8.4 C27.4 9.4 25.9 10.2 24 10.2 C22.1 10.2 20.6 9.4 20.6 8.4Z" />
      </motion.g>
      {/* the pulse */}
      {!reduce && (
        <motion.circle
          cy={10}
          r={1.5}
          animate={{ cx: [4, 14, 24], opacity: [1, 1, 1] }}
          transition={{ duration: T * 0.62, repeat: Infinity, repeatDelay: T * 0.38, ease: 'easeInOut' }}
          fill="hsl(var(--background))"
          stroke="currentColor"
          strokeWidth={0.9}
        />
      )}
    </svg>
  );
};

/**
 * Fast by default: a speedometer whose arc and needle sweep to full, hold, then ease back and go again.
 * The needle sits in a group whose bounding box is centred on the pivot (via an invisible circle), because framer-motion
 * rotates SVG elements about their own bounding-box centre — not about a coordinate we pass in.
 */
export const GaugeIcon = () => {
  const reduce = useReducedMotion();
  const arc = 'M3.5 16.5 A10.5 10.5 0 0 1 24.5 16.5';
  const loop = { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const, times: [0, 0.5, 0.78, 1] };
  const FULL = 72;
  return (
    <svg viewBox="0 0 28 20" aria-hidden className={BOX} fill="none" stroke="currentColor" strokeLinecap="round">
      {/* track + ticks */}
      <path d={arc} strokeWidth={2} strokeOpacity={0.2} />
      {[-72, -36, 0, 36, 72].map((deg) => (
        <line key={deg} x1={14} y1={4.3} x2={14} y2={5.7} strokeWidth={1} strokeOpacity={0.45} transform={`rotate(${deg} 14 16.5)`} />
      ))}
      {/* value arc */}
      <motion.path
        d={arc}
        strokeWidth={2}
        initial={{ pathLength: reduce ? 1 : 0.05 }}
        animate={reduce ? undefined : { pathLength: [0.05, 1, 1, 0.05] }}
        transition={loop}
      />
      {/* needle: group is centred on the pivot (14, 16.5) so the default centre-origin rotation is exactly right */}
      <motion.g
        initial={{ rotate: reduce ? FULL : -FULL }}
        animate={reduce ? undefined : { rotate: [-FULL, FULL, FULL, -FULL] }}
        transition={loop}
      >
        <circle cx={14} cy={16.5} r={9} stroke="none" fill="transparent" />
        <line x1={14} y1={16.5} x2={14} y2={8} strokeWidth={1.9} />
      </motion.g>
      <circle cx={14} cy={16.5} r={2} fill="currentColor" stroke="none" />
    </svg>
  );
};

/** Ships to production: build → test → deploy lighting up in order, then the check lands. */
export const ShipIcon = () => {
  const reduce = useReducedMotion();
  const xs = [4, 14, 24];
  const T = 3.2;
  return (
    <svg viewBox="0 0 28 20" aria-hidden className={BOX} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10 H24" strokeOpacity={0.22} />
      <motion.path
        d="M4 10 H24"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        animate={reduce ? undefined : { pathLength: [0, 0, 1, 1, 0] }}
        transition={{ duration: T, repeat: Infinity, ease: 'easeInOut', times: [0, 0.1, 0.62, 0.9, 1] }}
      />
      {xs.map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={10} r={3.2} fill="hsl(var(--background))" strokeOpacity={0.35} />
          <motion.circle
            cx={x}
            cy={10}
            r={3.2}
            fill="currentColor"
            stroke="none"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: T, repeat: Infinity, times: [0, 0.1 + i * 0.26, 0.2 + i * 0.26, 0.9, 1] }}
          />
        </g>
      ))}
      {/* the check on the last node */}
      <motion.path
        d="M22.2 10.2 L23.6 11.6 L26 8.6"
        stroke="hsl(var(--background))"
        strokeWidth={1.5}
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        animate={reduce ? undefined : { pathLength: [0, 0, 1, 1, 0] }}
        transition={{ duration: T, repeat: Infinity, times: [0, 0.64, 0.74, 0.9, 1] }}
      />
    </svg>
  );
};
