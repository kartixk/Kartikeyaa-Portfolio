import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin gradient bar at the very top that tracks page scroll progress. */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left"
    >
      <div
        className="h-full w-full"
        style={{ background: 'hsl(var(--brand-1))' }}
      />
    </motion.div>
  );
};

export default ScrollProgress;
