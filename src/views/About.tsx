'use client';

import { useSyncExternalStore, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
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
 * The portrait steps out of a peach arch (the crown of the head breaks it) and stands on a ground line.
 * Underneath: one sentence and a strip with where I am now and how long I've shipped.
 */
const WhoBlock = () => (
  <section className="wrap pb-20 md:pb-32">
    <div className="mx-auto max-w-4xl text-center">
      <div className="relative mx-auto w-[min(88vw,26rem)]">
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

        <div data-cursor="Hi!" className="relative z-10">
          <Avatar />
        </div>

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
    <WorkSection />
    <PathChart />

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
