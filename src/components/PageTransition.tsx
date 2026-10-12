'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

/** Gentle fade on mount — the heavy lifting is done by the route wipe. */
const PageTransition = ({ children }: { children: ReactNode }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={{ opacity: reduce ? 0 : 0.001 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
};

export default PageTransition;
