'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useDragControls, useReducedMotion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowUpRight, Github } from 'lucide-react';
import TransitionLink from '@/components/TransitionLink';
import { ProjectCover } from '@/components/fx';
import { useMedia } from '@/lib/useMedia';
import type { Project } from '@/lib/data';

const real = (u?: string) => (u && u !== '#' ? u : undefined);

/**
 * Finder-style window for a project. Opens centred over the page (drag it by the title bar on desktop),
 * closes with the red dot, Esc, or a click outside. Locks page scroll while open.
 */
export const ProjectWindow = ({ project, onClose }: { project: Project | null; onClose: () => void }) => {
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const controls = useDragControls();
  const canDrag = useMedia('(min-width: 768px) and (hover: hover)');
  const win = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    lenis?.stop();
    win.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lenis?.start();
    };
  }, [project, lenis, onClose]);

  const live = real(project?.link);
  const source = real(project?.github);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onPointerDown={(e) => e.target === e.currentTarget && onClose()}
          className="fixed inset-0 z-[85] grid place-items-center overflow-y-auto bg-black/55 p-3 backdrop-blur-[3px] sm:p-6"
        >
          <motion.div
            ref={win}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} — project details`}
            drag={canDrag && !reduce}
            dragListener={false}
            dragControls={controls}
            dragMomentum={false}
            dragElastic={0.05}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.86, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-line/20 bg-card text-card-foreground shadow-[0_50px_120px_-30px_rgba(0,0,0,0.8)] outline-none"
          >
            {/* title bar */}
            <div
              onPointerDown={(e) => canDrag && controls.start(e)}
              className={`flex items-center gap-3 border-b border-line/10 bg-secondary/70 px-4 py-2.5 ${canDrag ? 'cursor-grab active:cursor-grabbing' : ''}`}
            >
              <div className="flex gap-1.5">
                <button onClick={onClose} onPointerDown={(e) => e.stopPropagation()} aria-label="Close window" className="group/dot grid h-3 w-3 place-items-center rounded-full bg-[#ff5f57]">
                  <span className="text-[8px] font-bold leading-none text-black/60 opacity-0 transition-opacity group-hover/dot:opacity-100">×</span>
                </button>
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <p className="min-w-0 flex-1 truncate text-center font-mono text-[11px] tracking-wide text-muted-foreground">
                ~/projects/{project.slug}
              </p>
              <span className="w-12" aria-hidden />
            </div>

            <div className="grid md:grid-cols-[1.05fr_1fr]">
              <div className="group relative aspect-[16/10] md:aspect-auto md:min-h-[22rem]">
                <ProjectCover kind={project.cover} hue={project.hue} hue2={project.hue2} image={project.image} alt={`${project.title} preview`} />
              </div>

              <div className="flex flex-col p-5 sm:p-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{project.category.join(' · ')}</p>
                <h2 className="display mt-3 text-[clamp(1.8rem,4vw,2.6rem)]">{project.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{project.subtitle}</p>
                <p className="mt-5 text-base leading-snug">{project.outcome}</p>

                <ul className="mt-5 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {project.description.slice(0, 2).map((d) => (
                    <li key={d} className="flex gap-2">
                      <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-lime" />
                      {d}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span key={t} className="rounded-full border border-line/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex flex-wrap gap-2.5 pt-7">
                  <TransitionLink href={`/projects/${project.slug}`} onClick={onClose} className="btn btn-grad !px-5 !py-3">
                    Open case study <ArrowUpRight size={15} />
                  </TransitionLink>
                  {live && (
                    <a href={live} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !px-5 !py-3">
                      Live site <ArrowUpRight size={15} />
                    </a>
                  )}
                  {source && (
                    <a href={source} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !px-5 !py-3">
                      <Github size={15} /> Source
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectWindow;
