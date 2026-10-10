'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Folder from '@/components/desk/Folder';
import ProjectWindow from '@/components/desk/ProjectWindow';
import type { Project } from '@/lib/data';

/**
 * Projects as desktop folders. Hover (or focus) a tile and the sheets fan out of the folder;
 * click to open the project window, which links on to the full case study.
 */
const FolderGrid = ({ items, startIndex = 0 }: { items: Project[]; startIndex?: number }) => {
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <motion.ul layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
        <AnimatePresence mode="popLayout">
          {items.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.7, delay: Math.min(i, 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={() => setOpen(p)}
                aria-haspopup="dialog"
                data-cursor="Open"
                className="group/folder flex h-full w-full flex-col rounded-3xl border border-line/10 bg-card/40 p-4 text-left outline-none transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-line/25 hover:bg-card/70 focus-visible:border-lime sm:p-5"
              >
                <div
                  className="grid place-items-center rounded-2xl py-9 sm:py-10"
                  style={{ backgroundImage: 'radial-gradient(rgb(var(--line) / 0.14) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                >
                  <div className="w-[56%] max-w-[10.5rem]">
                    <Folder project={p} />
                  </div>
                </div>

                <div className="mt-5 flex flex-1 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {String(startIndex + i + 1).padStart(2, '0')} / {p.category.join(' · ')}
                    </p>
                    <h3 className="display mt-2 text-[clamp(1.5rem,2.2vw,1.9rem)] leading-[0.95]">{p.title}</h3>
                    <p className="mt-2.5 text-sm leading-snug text-muted-foreground">{p.outcome}</p>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line/25 transition-all duration-500 group-hover/folder:rotate-45 group-hover/folder:border-transparent group-hover/folder:bg-lime group-hover/folder:text-[#0c0f0a]">
                    <ArrowUpRight size={17} />
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-full border border-line/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      <ProjectWindow project={open} onClose={close} />
    </>
  );
};

export default FolderGrid;
