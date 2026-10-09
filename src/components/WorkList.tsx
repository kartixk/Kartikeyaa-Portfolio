'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import TransitionLink from '@/components/TransitionLink';
import { ProjectCover } from '@/components/fx';
import { projects } from '@/lib/data';

/**
 * Project index. Desktop: hovering a row pops a live image preview that follows the cursor.
 * Touch / small screens: every row carries its own thumbnail, since there is no hover.
 */
const WorkList = () => {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 28, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 28, mass: 0.5 });
  const current = active !== null ? projects[active] : null;

  return (
    <div
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="group/list border-b border-line/15">
        {projects.map((p, i) => (
          <li key={p.slug}>
            <TransitionLink
              href={`/projects/${p.slug}`}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group/row block border-t border-line/15 py-6 transition-opacity duration-500 lg:group-hover/list:opacity-30 lg:hover:!opacity-100 md:py-10"
            >
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 sm:gap-x-4 md:grid-cols-[5rem_1fr_auto_4.5rem] md:gap-x-8">
                <span className="font-mono text-xs tracking-widest text-muted-foreground">0{i + 1}</span>
                <div className="min-w-0">
                  <h3 className="display text-[clamp(1.75rem,5.2vw,5rem)] transition-transform [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] [transition-duration:500ms] group-hover/row:translate-x-3 group-hover/row:text-gradient md:group-hover/row:translate-x-6">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground md:hidden">{p.subtitle}</p>
                </div>
                <div className="hidden flex-wrap justify-end gap-2 md:flex">
                  {p.tech.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-full border border-line/25 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="grid h-11 w-11 place-items-center justify-self-end rounded-full border border-line/25 transition-all duration-500 group-hover/row:rotate-45 group-hover/row:border-transparent group-hover/row:bg-grad group-hover/row:text-[#120d24] md:h-14 md:w-14">
                  <ArrowUpRight size={20} />
                </span>
              </div>

              {/* inline thumbnail for touch & small screens */}
              <div className="group mt-5 aspect-[16/8] overflow-hidden rounded-2xl lg:hidden">
                <ProjectCover kind={p.cover} hue={p.hue} hue2={p.hue2} image={p.image} alt={`${p.title} preview`} />
              </div>
            </TransitionLink>
          </li>
        ))}
      </ul>

      {/* cursor-following image preview (desktop) */}
      <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-30 hidden lg:block" style={{ x: sx, y: sy }}>
        <div className="-translate-x-1/2 -translate-y-1/2">
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={current.slug}
                initial={{ scale: 0.5, opacity: 0, rotate: -12 }}
                animate={{ scale: 1, opacity: 1, rotate: -4 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="group h-[260px] w-[380px] overflow-hidden rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/20"
              >
                <ProjectCover kind={current.cover} hue={current.hue} hue2={current.hue2} image={current.image} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default WorkList;
