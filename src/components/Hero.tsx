'use client';

import { ReactNode, RefObject, useCallback, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, FileText } from 'lucide-react';
import TransitionLink from '@/components/TransitionLink';
import LocalTime from '@/components/LocalTime';
import Clock from '@/components/desk/Clock';
import Folder from '@/components/desk/Folder';
import MessageBar from '@/components/desk/MessageBar';
import Mountains from '@/components/desk/Mountains';
import ProjectWindow from '@/components/desk/ProjectWindow';
import { useReady } from '@/components/ready';
import { useMedia } from '@/lib/useMedia';
import { cn } from '@/lib/utils';
import { PHOTO, projects, RESUME_URL, type Project } from '@/lib/data';

/* ───────────────────────── desk pieces ───────────────────────── */

/**
 * Absolutely-placed, draggable thing on the desktop.
 * A click that ends a drag is swallowed, so letting go of a folder/link never opens or navigates it.
 */
const Item = ({
  children,
  className,
  rotate = 0,
  delay = 0,
  bounds,
  canDrag,
  cursor = 'Drag',
}: {
  children: ReactNode;
  className?: string;
  rotate?: number;
  delay?: number;
  bounds: RefObject<HTMLElement | null>;
  canDrag: boolean;
  cursor?: string;
}) => {
  const reduce = useReducedMotion();
  const ready = useReady();
  const moved = useRef(false);
  return (
    <motion.div
      drag={canDrag && !reduce}
      dragConstraints={bounds}
      dragElastic={0.12}
      dragMomentum={false}
      onDragStart={() => (moved.current = true)}
      onPointerDownCapture={() => (moved.current = false)}
      onClickCapture={(e) => {
        if (moved.current) {
          e.preventDefault();
          e.stopPropagation();
          moved.current = false;
        }
      }}
      initial={{ opacity: 0, scale: 0.6, rotate: rotate - 12, y: 30 }}
      animate={ready ? { opacity: 1, scale: 1, rotate, y: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 220, damping: 18, delay }}
      whileHover={{ scale: 1.04 }}
      whileDrag={{ scale: 1.08, zIndex: 50 }}
      data-cursor={cursor}
      className={cn('select-none', canDrag && 'touch-none', className)}
    >
      {children}
    </motion.div>
  );
};

const FolderButton = ({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) => (
  <button type="button" onClick={() => onOpen(project)} aria-haspopup="dialog" className="group/label flex w-full flex-col items-center gap-2 text-center outline-none">
    <Folder project={project} />
    <span className="max-w-full rounded-md px-2 py-0.5 text-[13px] font-medium leading-tight text-foreground transition-colors group-hover/label:bg-lime group-hover/label:text-[#0c0f0a] group-focus-visible/label:bg-lime group-focus-visible/label:text-[#0c0f0a]">
      {project.title}
    </span>
  </button>
);

const Sticky = ({ className }: { className?: string }) => (
  <div className={cn('relative rounded-md bg-[hsl(76_88%_72%)] p-5 text-[#0c0f0a] shadow-[0_26px_50px_-18px_rgba(0,0,0,0.55)] sm:p-6', className)}>
    {/* folded corner */}
    <span aria-hidden className="absolute bottom-0 right-0 h-7 w-7 rounded-tl-md bg-gradient-to-br from-black/15 to-transparent" />
    <p className="font-display text-[1.45rem] font-semibold leading-[1.12] tracking-tight sm:text-[1.6rem]">
      I&apos;m Kartikeya, a Full-Stack Developer who ships MERN, ML &amp; IoT products
    </p>
    <p className="mt-3 text-[13px] leading-relaxed text-black/70 sm:text-sm">
      Internships at <strong className="font-semibold text-black">Spotmies</strong>, <strong className="font-semibold text-black">NTPC</strong> and{' '}
      <strong className="font-semibold text-black">Zenith-Zap</strong> — building scalable web apps, an 82%-accurate sentiment model and live IoT dashboards.
    </p>
    <TransitionLink href="/contact" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-black/15 px-3.5 py-2 text-sm font-semibold transition-colors hover:bg-black hover:text-[hsl(76_88%_72%)]">
      <ArrowUpRight size={15} /> Say hello
    </TransitionLink>
  </div>
);

const NowCard = ({ className }: { className?: string }) => (
  <TransitionLink
    href="/about"
    className={cn('group block rounded-2xl bg-[#f4f5ef] p-4 text-[#0c0f0a] shadow-[0_26px_50px_-18px_rgba(0,0,0,0.55)]', className)}
  >
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={PHOTO} alt="" draggable={false} className="h-10 w-10 rounded-full object-cover object-[50%_30%]" />
      <div className="min-w-0 flex-1">
        <p className="font-display text-[15px] font-semibold leading-tight">B Venkata Sai Kartikeya</p>
        <p className="text-xs text-black/55">Visakhapatnam, IN</p>
      </div>
      <ArrowUpRight size={18} className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </div>
    <p className="mt-3 text-[13px] leading-snug">
      Developer Intern at Spotmies LLP — currently exploring <span className="font-semibold">ML, NLP and IoT</span>.
    </p>
    <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-black/55">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#5aa000]" /> Open to work
      </span>
      <LocalTime />
    </div>
  </TransitionLink>
);

const ResumeFile = () => (
  <a href={RESUME_URL} download="Kartikeya_Resume.pdf" className="group/file flex w-full flex-col items-center gap-2 text-center outline-none" aria-label="Download resume (PDF)">
    <span className="relative block aspect-[4/5] w-full rounded-lg bg-[#f6f7f2] shadow-[0_20px_36px_-14px_rgba(0,0,0,0.6)] ring-1 ring-black/10 transition-transform duration-300 group-hover/file:-translate-y-1">
      <span className="flex items-center justify-between px-2.5 pt-2 text-[#0c0f0a]">
        <FileText size={14} className="text-[#d6453d]" />
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-black/50">pdf</span>
      </span>
      <span className="mt-3 block space-y-1.5 px-2.5" aria-hidden>
        {[90, 100, 70, 100, 85, 55].map((w, i) => (
          <span key={i} className="block h-[3px] rounded-full bg-black/15" style={{ width: `${w}%` }} />
        ))}
      </span>
    </span>
    <span className="rounded-md px-2 py-0.5 text-[13px] font-medium text-foreground transition-colors group-hover/file:bg-lime group-hover/file:text-[#0c0f0a] group-focus-visible/file:bg-lime group-focus-visible/file:text-[#0c0f0a]">
      Resume.pdf
    </span>
  </a>
);

/* ───────────────────────── hero ───────────────────────── */

const FOLDER_POS = ['left-[32%] top-[23%]', 'left-[47%] top-[20%]', 'left-[38.5%] top-[50%]', 'left-[57%] top-[53%]'];
const FOLDER_TILT = [-1, 1.2, -0.8, 1];

/**
 * Hero as a desktop. Large screens: a canvas where the note, widgets, resume and project folders can be dragged
 * around (click a folder to open its window). Small screens: the same pieces in a tidy stack — no dragging, so the page still scrolls.
 */
const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const canDrag = useMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');

  return (
    <section ref={ref} className="relative min-h-svh overflow-hidden">
      <Mountains />

      {/* giant ghost name */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[24%] z-0 hidden select-none text-center lg:block">
        <p className="display text-[clamp(7rem,19vw,22rem)] leading-[0.8] text-line/[0.085]">KARTIKEYA</p>
      </div>
      <h1 className="sr-only">Kartikeya — Full-Stack Developer</h1>

      {/* ── desktop canvas (md+) ── */}
      <div className="absolute inset-0 hidden lg:block">
        <Item bounds={ref} canDrag={canDrag} rotate={-2.5} delay={0.2} className="absolute left-[4%] top-[17%] z-20 w-[min(24rem,28vw)]">
          <Sticky />
        </Item>

        <Item bounds={ref} canDrag={canDrag} delay={0.4} className="absolute right-[4%] top-[15%] z-10 w-[min(8.5rem,11vw)]">
          <Clock />
        </Item>

        <Item bounds={ref} canDrag={canDrag} rotate={1.5} delay={0.55} className="absolute right-[4%] top-[41%] z-10 w-[min(20rem,25vw)]">
          <NowCard />
        </Item>

        {projects.map((p, i) => (
          <Item
            key={p.slug}
            bounds={ref}
            canDrag={canDrag}
            rotate={FOLDER_TILT[i % 4]}
            delay={0.3 + i * 0.1}
            cursor="Open"
            className={cn('absolute z-10 w-[clamp(7.6rem,12vw,11.5rem)]', FOLDER_POS[i % 4])}
          >
            <FolderButton project={p} onOpen={setOpen} />
          </Item>
        ))}

        <Item bounds={ref} canDrag={canDrag} rotate={-3} delay={0.8} cursor="Download" className="absolute left-[13%] top-[68%] z-10 w-[clamp(4.6rem,7vw,6rem)]">
          <ResumeFile />
        </Item>

        <div className="absolute inset-x-0 bottom-[6.5%] z-20 flex justify-center px-6">
          <MessageBar className="w-[min(32rem,52vw)]" />
        </div>

        <p className="absolute bottom-6 left-[4%] z-10 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground lg:block">
          Drag anything · click a folder to open it
        </p>
        <p className="absolute bottom-6 right-[4%] z-10 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground lg:block">
          Visakhapatnam, IN · <LocalTime />
        </p>
      </div>

      {/* ── stacked layout (below md) ── */}
      <div className="wrap relative z-10 flex flex-col gap-7 pb-12 pt-28 lg:hidden">
        <div>
          <p aria-hidden className="display text-[clamp(3.2rem,17vw,5rem)] leading-[0.85]">
            Kartikeya
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">A full-stack developer</p>
        </div>
        <Sticky className="-rotate-1" />
        <div className="grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-4">
          {projects.map((p) => (
            <FolderButton key={p.slug} project={p} onOpen={setOpen} />
          ))}
        </div>
        <div className="grid grid-cols-[1fr_5.5rem] items-end gap-5 sm:max-w-xl">
          <NowCard />
          <ResumeFile />
        </div>
        <div className="flex items-center gap-4">
          <Clock className="h-24 w-24 shrink-0" />
          <MessageBar className="min-w-0 flex-1" />
        </div>
      </div>

      <ProjectWindow project={open} onClose={close} />
    </section>
  );
};

export default Hero;
