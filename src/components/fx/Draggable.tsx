'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode, RefObject } from 'react';
import { cn } from '@/lib/utils';

interface DraggableProps {
  children: ReactNode;
  /** element the sticker is allowed to travel within */
  constraintsRef: RefObject<HTMLElement | null>;
  className?: string;
  /** resting rotation in degrees */
  rotate?: number;
  delay?: number;
}

/** A sticker you can grab and throw around. Springs back softly at the edges. */
export const Draggable = ({ children, constraintsRef, className, rotate = 0, delay = 0 }: DraggableProps) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      drag={!reduce}
      dragConstraints={constraintsRef}
      dragElastic={0.18}
      dragMomentum
      dragTransition={{ bounceStiffness: 260, bounceDamping: 18, power: 0.35 }}
      initial={{ opacity: 0, scale: 0.4, rotate: rotate - 25 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{ type: 'spring', stiffness: 220, damping: 14, delay }}
      whileHover={{ scale: 1.07 }}
      whileDrag={{ scale: 1.14, rotate: rotate + 4, zIndex: 40 }}
      data-cursor="Drag"
      className={cn('absolute select-none touch-none', className)}
    >
      {children}
    </motion.div>
  );
};

export default Draggable;
