import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ElementType, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  /** delay before the first unit animates in */
  delay?: number;
  /** per-unit stagger */
  stagger?: number;
  by?: 'word' | 'char';
  as?: ElementType;
  once?: boolean;
  immediate?: boolean;
}

/**
 * Staggered word/char reveal for headlines.
 */
export const AnimatedText = ({
  text,
  className,
  delay = 0,
  stagger = 0.05,
  by = 'word',
  as = 'span',
  once = true,
  immediate = true,
}: AnimatedTextProps) => {
  const reduce = useReducedMotion();
  const MotionTag = useMemo(() => motion(as as ElementType), [as]);
  const units = by === 'word' ? text.split(' ') : text.split('');

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay } },
  };
  const child: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: '0.55em', rotateX: -45 },
    show: {
      opacity: 1,
      y: '0em',
      rotateX: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <MotionTag
      className={cn('inline-block', className)}
      variants={container}
      initial="hidden"
      {...(immediate ? { animate: 'show' } : { whileInView: 'show', viewport: { once, margin: '-60px' } })}
      style={{ perspective: 600 }}
    >
      {units.map((unit, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" style={{ paddingBottom: '0.05em' }}>
          <motion.span variants={child} className="inline-block will-change-transform">
            {unit === ' ' ? ' ' : unit}
            {by === 'word' && i < units.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
};

export default AnimatedText;
