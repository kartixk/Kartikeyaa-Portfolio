'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Two silhouette ridges that drift against the pointer for depth. */
export const Mountains = () => {
  const back = useRef<SVGSVGElement>(null);
  const front = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const move = (e: PointerEvent) => {
      const px = e.clientX / window.innerWidth - 0.5;
      const py = e.clientY / window.innerHeight - 0.5;
      if (back.current) back.current.style.transform = `translate3d(${px * -18}px, ${py * -8}px, 0)`;
      if (front.current) front.current.style.transform = `translate3d(${px * 30}px, ${py * 10}px, 0)`;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [reduce]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] overflow-hidden">
      <svg ref={back} viewBox="0 0 1440 400" preserveAspectRatio="none" className="absolute -inset-x-[3%] bottom-0 h-[88%] w-[106%] transition-transform duration-500 ease-out">
        <path fill="rgb(var(--line) / 0.045)" d="M0 400V250l70-34 90 48 96-96 84 70 86-56 110 96 100-130 96 100 80-58 104 92 98-112 100 86 84-62 96 78 96-52 130 90v110Z" />
      </svg>
      <svg ref={front} viewBox="0 0 1440 400" preserveAspectRatio="none" className="absolute -inset-x-[4%] bottom-0 h-[62%] w-[108%] transition-transform duration-500 ease-out">
        <path fill="rgb(var(--line) / 0.07)" d="M0 400V300l120-44 100 54 130-78 110 64 120-40 90 56 150-86 120 82 110-52 100 60 130-68 140 76v90Z" />
      </svg>
    </div>
  );
};

export default Mountains;
