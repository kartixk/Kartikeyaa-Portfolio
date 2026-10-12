'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Hairline at the top edge that tracks page scroll progress. */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[75] h-[2px] origin-left bg-grad" />;
};

export default ScrollProgress;
