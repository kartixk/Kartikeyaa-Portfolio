import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import { ReactNode, useRef, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** max rotation in degrees */
  intensity?: number;
  /** show the cursor-tracking glare */
  glare?: boolean;
  glareColor?: string;
}

/**
 * A 3D parallax card that tilts toward the cursor with a soft moving glare.
 * Lightweight depth effect — no WebGL.
 */
export const TiltCard = ({
  children,
  className,
  intensity = 10,
  glare = false,
  glareColor = 'hsl(var(--brand-1) / 0.12)',
}: TiltCardProps) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [intensity, -intensity]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-intensity, intensity]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(x, [0, 1], ['0%', '100%']);
  const glareY = useTransform(y, [0, 1], ['0%', '100%']);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, ${glareColor}, transparent 55%)`;

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };
  const reset = () => {
    x.set(0.5);
    y.set(0.5);
  };

  if (reduce) {
    return <div className={cn('relative', className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={cn('relative will-change-transform', className)}
    >
      <div style={{ transform: 'translateZ(0.01px)' }} className="relative h-full [transform-style:preserve-3d]">
        {children}
      </div>
      {glare && (
        <motion.div
          aria-hidden
          style={{ background: glareBg }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [transform:translateZ(1px)] group-hover:opacity-100"
        />
      )}
    </motion.div>
  );
};

export default TiltCard;
