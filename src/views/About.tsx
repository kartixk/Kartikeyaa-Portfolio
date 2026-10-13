'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import PageHeader from '@/components/PageHeader';
import TransitionLink from '@/components/TransitionLink';
import PathChart from '@/components/PathChart';
import ProjectStack from '@/components/ProjectStack';
import { Magnetic, Marquee, Reveal, TextReveal } from '@/components/fx';
import Avatar from '@/components/hero/Avatar';
import { FullStackIcon, GaugeIcon, ShipIcon } from '@/components/PillIcons';
import { experiences, projects, softSkills } from '@/lib/data';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ───────────────────────── 1 · who: portrait stage + proof numbers ───────────────────────── */

/** Floating label that sits around the portrait; its icon is a tiny looping visualisation of what the label says. */
const Chip = ({ label, icon, className, delay }: { label: string; icon: ReactNode; className: string; delay: number }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8, y: 12 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true, margin: '-10% 0px' }}
    transition={{ duration: 0.7, delay, ease: EASE }}
    className={`absolute z-20 hidden items-center gap-2.5 whitespace-nowrap rounded-full border border-line/20 bg-background/85 py-2 pl-3 pr-4 text-sm font-medium shadow-[0_10px_30px_-14px_rgba(0,0,0,0.35)] backdrop-blur sm:inline-flex ${className}`}
  >
    {icon}
    {label}
  </motion.span>
);

/** Rotating ring of text — the one playful detail. Stops for reduced motion. */
const Badge = () => (
  <div aria-hidden className="absolute -right-2 top-[22%] z-20 hidden h-28 w-28 sm:block md:-right-8">
    <svg viewBox="0 0 120 120" className="h-full w-full animate-[spin_22s_linear_infinite] motion-reduce:animate-none">
      <defs>
        <path id="badge-ring" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <text className="fill-current font-mono text-[10.5px] uppercase tracking-[0.28em]">
        <textPath href="#badge-ring">Full-Stack Developer • Visakhapatnam •</textPath>
      </text>
    </svg>
    <span className="absolute inset-0 grid place-items-center text-2xl">✦</span>
  </div>
);

/** Months since joining Spotmies (Dec 2025). Server snapshot is null so the markup never depends on the server's clock. */
const JOINED = { year: 2025, month: 11 };
const subscribe = () => () => {};
const monthsSinceJoining = () => {
  const n = new Date();
  return Math.max(0, (n.getFullYear() - JOINED.year) * 12 + n.getMonth() - JOINED.month);
};

/** What a hiring manager actually scans for: where I am now, how long I've shipped professionally, where I've been. */
const NowStrip = () => {
  const months = useSyncExternalStore(subscribe, monthsSinceJoining, () => null);
  const now = experiences[0];
  const years = months === null ? 0 : Math.floor(months / 12);
  const rest = months === null ? 0 : months % 12;

  return (
    <div className="mx-auto mt-10 grid max-w-3xl divide-y divide-line/15 border-y border-line/15 text-left md:mt-14 md:grid-cols-2 md:divide-x md:divide-y-0">
      <Reveal className="px-0 py-6 md:px-6">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Now
        </p>
        <p className="display mt-3 text-2xl leading-tight">{now.role}</p>
        <p className="mt-1 text-sm text-muted-foreground">{now.company} · full-time</p>
      </Reveal>

      <Reveal delay={0.07} className="px-0 py-6 md:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Shipping professionally</p>
        <p className="display mt-3 flex items-baseline gap-2 text-[clamp(2rem,4vw,2.8rem)] leading-none" aria-live="off">
          {months === null ? (
            <span className="opacity-0">0</span>
          ) : years > 0 ? (
            <>
              {years}
              <span className="text-base font-medium text-muted-foreground">yr</span>
              {rest}
              <span className="text-base font-medium text-muted-foreground">mo</span>
            </>
          ) : (
            <>
              {rest}
              <span className="text-base font-medium text-muted-foreground">months</span>
            </>
          )}
        </p>
      </Reveal>
    </div>
  );
};

/**
 * The freeze-frame moment as a thought bubble over the portrait: three typing dots, then the line every movie says.
 * Types itself once when it scrolls into view; "Rewind" scrolls to the story below ("How I got here").
 * A hidden copy of the full text reserves the bubble's size, so nothing shifts while it types.
 */
const LINES = [
  "Yep, that's me.",
  "You're probably wondering how a guy who started with a few lines of code ended up building things for the web.",
  "Well, let's start from the beginning.",
] as const;

/** one circle of the thought-bubble trail */
const dot = 'absolute rounded-full border border-line/25 bg-background shadow-[0_4px_10px_-4px_rgba(0,0,0,0.25)]';

const FreezeBubble = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const [typedState, setTyped] = useState<number[]>(() => LINES.map(() => 0));
  // reduced motion: show every line at once, no typing
  const typed: number[] = reduce ? LINES.map((l) => l.length) : typedState;

  useEffect(() => {
    if (!inView || reduce) return;
    let stop = false;
    const timers: number[] = [];
    const run = (line: number, i: number) => {
      if (stop) return;
      setTyped((t) => t.map((n, k) => (k === line ? i : n)));
      if (i < LINES[line].length) timers.push(window.setTimeout(() => run(line, i + 1), 26));
      else if (line < LINES.length - 1) timers.push(window.setTimeout(() => run(line + 1, 0), line === 0 ? 550 : 700));
    };
    // 1.3s of "typing…" dots first, like a message about to arrive
    timers.push(window.setTimeout(() => run(0, 0), 1300));
    return () => {
      stop = true;
      timers.forEach(window.clearTimeout);
    };
  }, [inView, reduce]);

  const started = typed[0] > 0;
  const done = typed[LINES.length - 1] >= LINES[LINES.length - 1].length;
  const rewind = () => {
    const el = document.getElementById('path');
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.6 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={ref} className="absolute bottom-full left-1/2 z-30 mb-3 w-[min(92vw,25rem)] -translate-x-1/2 sm:left-[70%] sm:-mb-2 lg:left-[72%] lg:translate-x-0 lg:-mb-3">
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-5% 0px' }}
        transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
        className="relative rounded-[1.6rem] border border-line/20 bg-background/95 px-5 py-4 text-left shadow-[0_18px_44px_-18px_rgba(0,0,0,0.45)] backdrop-blur"
      >
        {/* reserve the final size */}
        <div aria-hidden className="invisible">
          <p className="display text-[1.7rem] leading-[1.1]">{LINES[0]}</p>
          <p className="mt-2 text-[0.95rem] leading-snug">{LINES[1]}</p>
          <p className="serif mt-3 text-[1.2rem] leading-snug">{LINES[2]}</p>
          <span className="mt-3 inline-block h-9" />
        </div>

        <div className="absolute inset-0 px-5 py-4">
          {!started && !reduce ? (
            <span className="flex h-full items-center gap-1.5" aria-label="typing">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full bg-foreground/60"
                  animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                />
              ))}
            </span>
          ) : (
            <>
              <p className="display text-[1.7rem] leading-[1.1] tracking-[-0.02em]">
                <span className="serif">{LINES[0].slice(0, typed[0])}</span>
              </p>
              <p className="mt-2 text-[0.95rem] leading-snug text-muted-foreground" aria-live="polite">
                {LINES[1].slice(0, typed[1])}
                {typed[1] > 0 && typed[1] < LINES[1].length && <span aria-hidden className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] animate-pulse bg-current" />}
              </p>
              <p className="serif mt-3 min-h-[1.4em] text-[1.2rem] leading-snug">
                {LINES[2].slice(0, typed[2])}
                {typed[2] > 0 && !done && <span aria-hidden className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] animate-pulse bg-current" />}
              </p>
              <motion.button
                type="button"
                onClick={rewind}
                initial={{ opacity: 0, y: 6 }}
                animate={done || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="group mt-3 inline-flex items-center gap-2 rounded-full border border-line/25 px-3.5 py-1.5 text-xs font-semibold transition-colors hover:border-transparent hover:bg-foreground hover:text-background"
              >
                <RotateCcw size={13} className="transition-transform duration-500 group-hover:-rotate-[360deg]" />
                Rewind the tape
              </motion.button>
            </>
          )}
        </div>

        {/* thought-bubble trail: three shrinking circles on one diagonal, from the bubble toward the head */}
        {/* wide screens: bubble sits up-and-right of the head, so the trail leaves its lower-left corner */}
        <span aria-hidden className="pointer-events-none absolute -bottom-14 left-0 hidden h-14 w-14 lg:block">
          <span className={`${dot} left-[26px] top-[2px] h-[18px] w-[18px]`} />
          <span className={`${dot} left-[10px] top-[24px] h-[12px] w-[12px]`} />
          <span className={`${dot} left-[0px] top-[40px] h-[8px] w-[8px]`} />
        </span>
        {/* smaller screens: bubble is nearly above the head, so the trail drops from its lower middle */}
        <span aria-hidden className="pointer-events-none absolute -bottom-14 left-1/2 block h-14 w-14 -translate-x-1/2 sm:left-[33%] lg:hidden">
          <span className={`${dot} left-[26px] top-[2px] h-[18px] w-[18px]`} />
          <span className={`${dot} left-[20px] top-[24px] h-[12px] w-[12px]`} />
          <span className={`${dot} left-[15px] top-[40px] h-[8px] w-[8px]`} />
        </span>
      </motion.div>
    </div>
  );
};

/**
 * The portrait steps out of a peach arch (the crown of the head breaks it) and stands on a ground line.
 * Underneath: one sentence and a strip with where I am now and how long I've shipped.
 */
const WhoBlock = () => (
  <section className="wrap pb-20 md:pb-32">
    <div className="mx-auto max-w-4xl text-center">
      <div className="relative mx-auto mt-40 w-[min(88vw,26rem)] sm:mt-36">
        <FreezeBubble />
        <motion.div
          aria-hidden
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-x-[9%] bottom-0 top-[17%] overflow-hidden rounded-t-[999px] bg-[linear-gradient(180deg,hsl(var(--c-lime)),hsl(var(--c-lime)/0.72))]"
        >
          <div className="absolute -left-[20%] bottom-[24%] h-[18%] w-[70%] rounded-full bg-white/35" />
          <div className="absolute -right-[24%] bottom-[44%] h-[15%] w-[62%] rounded-full bg-white/25" />
        </motion.div>

        <motion.div
          data-cursor="Hi!"
          className="relative z-10"
          initial={{ filter: 'grayscale(1) contrast(1.35) brightness(1.15)', scale: 1.035 }}
          whileInView={{ filter: 'grayscale(0) contrast(1) brightness(1)', scale: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Avatar />
        </motion.div>

        {/* viewfinder: four corner marks and a REC tag, as if the frame has just been held */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 1.06 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="pointer-events-none absolute inset-x-[4%] -top-1 bottom-0 z-20 text-foreground/40 sm:inset-x-[6%] sm:-top-3"
        >
          <span className="absolute left-0 top-0 h-6 w-6 rounded-tl-md border-l-2 border-t-2 border-current" />
          <span className="absolute right-0 top-0 h-6 w-6 rounded-tr-md border-r-2 border-t-2 border-current" />
          <span className="absolute bottom-0 left-0 h-6 w-6 rounded-bl-md border-b-2 border-l-2 border-current" />
          <span className="absolute bottom-0 right-0 h-6 w-6 rounded-br-md border-b-2 border-r-2 border-current" />
          <span className="absolute left-3 top-3 hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 motion-reduce:animate-none" />
            Rec
          </span>
        </motion.div>

        <Chip label="Full-stack, end to end" icon={<FullStackIcon />} delay={0.5} className="-left-4 top-[30%] md:-left-24" />
        <Chip label="Fast by default" icon={<GaugeIcon />} delay={0.62} className="-left-1 top-[58%] md:-left-16" />
        <Chip label="Ships to production" icon={<ShipIcon />} delay={0.74} className="-right-1 top-[64%] md:-right-28" />
        <Badge />
      </div>
      <div aria-hidden className="mx-auto h-px w-full max-w-3xl bg-line/20" />

      <Reveal className="mt-10 md:mt-14">
        <p className="display mx-auto max-w-2xl text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.15] tracking-[-0.025em] text-balance">
          Full-stack developer who ships <span className="serif text-primary">reliable</span> products — web, mobile and real-time IoT.
        </p>
      </Reveal>

      <NowStrip />
    </div>
  </section>
);

/* ───────────────────────── 2 · work: every project, stacked as you scroll ───────────────────────── */

const WorkSection = () => (
  <section className="wrap pb-20 md:pb-32">
    <div className="mb-10 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
      <div>
        <Reveal>
          <p className="eyebrow mb-5 md:mb-6">Selected work</p>
        </Reveal>
        <TextReveal
          as="h2"
          className="display text-[clamp(2.4rem,6.5vw,6rem)] leading-[0.98]"
          lines={[<span key="a">Projects</span>, <span key="b" className="serif text-primary">built by me</span>]}
        />
      </div>
      <Reveal delay={0.1}>
        <Magnetic strength={0.25}>
          <TransitionLink href="/projects" className="btn btn-ghost">
            All projects <ArrowUpRight size={16} />
          </TransitionLink>
        </Magnetic>
      </Reveal>
    </div>
    <ProjectStack items={projects} />
  </section>
);

/* ───────────────────────── 3 · path: a timeline you click through, not scroll through ───────────────────────── */

const About = () => (
  <PageTransition>
    <PageHeader
      index="01"
      eyebrow="About me"
      lines={[<span key="a">Crafting</span>, <span key="b" className="serif text-gradient">reliable</span>, <span key="c">software.</span>]}
    />

    <WhoBlock />
    <PathChart />
    <WorkSection />

    {/* soft skills */}
    <section className="border-y border-line/15 py-8" aria-label="Soft skills">
      <Marquee duration={40}>
        {softSkills.map((s) => (
          <span key={s} className="mx-6 flex items-center gap-12">
            <span className="display text-[clamp(2.2rem,6vw,5rem)]">{s}</span>
            <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-current opacity-50" />
          </span>
        ))}
      </Marquee>
    </section>
  </PageTransition>
);

export default About;
