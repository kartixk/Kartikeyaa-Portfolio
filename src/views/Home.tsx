'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import TransitionLink from '@/components/TransitionLink';
import FloodRow from '@/components/FloodRow';
import LocalTime from '@/components/LocalTime';
import { Counter, Draggable, Magnetic, Marquee, ProjectCover, Reveal, ScrollText, TextReveal } from '@/components/fx';
import { experiences, PHOTO, projects, RESUME_URL, skillGroups, stats } from '@/lib/data';

/* ───────────────────────── HERO ───────────────────────── */

const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.2]);

  return (
    <section ref={ref} className="relative flex min-h-svh flex-col justify-end overflow-hidden pb-10 pt-32 md:pb-14">
      <motion.div style={{ y, opacity: fade }} className="wrap relative z-10 w-full">
        {/* status row */}
        <Reveal immediate delay={0.1} className="mb-8 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:mb-12">
          <span className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Available for work
          </span>
          <span className="hidden sm:block">
            Visakhapatnam, IN — <LocalTime />
          </span>
        </Reveal>

        {/* headline */}
        <TextReveal
            as="h1"
            immediate
            delay={0.15}
            className="display text-[clamp(3.1rem,17vw,5.6rem)] uppercase sm:text-[clamp(3.1rem,14.2vw,15.5rem)]"
            lines={[
              <span key="1">Building</span>,
              <span key="2" className="flex items-center gap-[0.12em] whitespace-nowrap normal-case">
                <span className="serif text-primary">reliable</span>
                <span
                  data-cursor="Hello"
                  className="group relative inline-block h-[0.66em] w-[1.5em] shrink-0 overflow-hidden rounded-full border border-line/30"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={PHOTO}
                    alt="Portrait of B Venkata Sai Kartikeya"
                    className="h-full w-full scale-110 object-cover object-[50%_58%] grayscale transition-all duration-700 group-hover:scale-100 group-hover:grayscale-0"
                  />
                </span>
              </span>,
              <span key="3" className="flex items-start gap-3">
                Software
                <sup className="mt-[0.35em] hidden font-mono text-[clamp(0.6rem,0.9vw,0.8rem)] font-normal normal-case leading-snug tracking-[0.18em] text-muted-foreground lg:block">
                  (FULL-STACK
                  <br />
                  ML · IoT)
                </sup>
              </span>,
            ]}
          />

        {/* intro + CTAs */}
        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[1.3fr_1fr] md:items-end">
          <Reveal immediate delay={0.75}>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              I&apos;m <span className="font-semibold text-foreground">Kartikeya</span> — a CS undergrad who designs and ships full-stack products across{' '}
              <span className="text-foreground">MERN</span>, <span className="text-foreground">machine learning</span> and{' '}
              <span className="text-foreground">IoT</span>.
            </p>
          </Reveal>
          <Reveal immediate delay={0.85} className="flex flex-wrap items-center gap-3 md:justify-end">
            <Magnetic strength={0.25}>
              <TransitionLink href="/projects" className="btn btn-solid">
                View projects <ArrowUpRight size={16} />
              </TransitionLink>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a href={RESUME_URL} download="Kartikeya_Resume.pdf" className="btn btn-ghost">
                Resume <Download size={15} />
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </motion.div>

      {/* draggable stickers — grab them */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="pointer-events-auto relative h-full w-full">
          <Draggable constraintsRef={ref} rotate={-9} delay={1.5} className="right-[7%] top-[24%] md:right-[12%] md:top-[26%]">
            <span className="block rounded-full bg-primary px-5 py-3 font-display text-base font-bold text-primary-foreground shadow-[0_14px_40px_-12px_hsl(var(--primary)/0.7)] md:px-7 md:py-4 md:text-xl">
              Drag me! ✋
            </span>
          </Draggable>
          <Draggable constraintsRef={ref} rotate={7} delay={1.65} className="right-[21%] top-[43%] hidden md:block">
            <span className="block rounded-full border border-foreground bg-background/60 px-6 py-3 font-display text-lg font-semibold backdrop-blur">MERN ✺</span>
          </Draggable>
          <Draggable constraintsRef={ref} rotate={-5} delay={1.8} className="right-[4%] top-[47%] hidden sm:block">
            <span className="grid h-24 w-24 place-items-center rounded-full bg-accent font-display text-2xl font-bold text-accent-foreground md:h-28 md:w-28">ML/AI</span>
          </Draggable>
          <Draggable constraintsRef={ref} rotate={12} delay={1.95} className="left-[67%] top-[16%] hidden lg:block">
            <span className="block rounded-xl bg-foreground px-5 py-3 font-mono text-sm font-semibold uppercase tracking-widest text-background">IoT</span>
          </Draggable>
        </div>
      </div>

      {/* spinning scroll badge */}
      <Reveal immediate delay={1.2} direction="none" className="absolute bottom-40 right-5 z-10 hidden md:block lg:right-12">
        <div className="relative grid h-28 w-28 place-items-center">
          <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow" aria-hidden>
            <defs>
              <path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
            </defs>
            <text className="fill-current font-mono text-[9.5px] uppercase tracking-[0.32em]">
              <textPath href="#circ">Scroll down • Scroll down • </textPath>
            </text>
          </svg>
          <ArrowDown size={22} className="text-primary" />
        </div>
      </Reveal>
    </section>
  );
};

/* ───────────────────────── TICKER ───────────────────────── */

const ticker = ['Full-Stack', 'Machine Learning', 'IoT', 'Scalable APIs', 'Creative Dev'];

const Ticker = () => (
  <section className="overflow-hidden border-y border-line/15 py-6 md:py-8" aria-hidden>
    <Marquee duration={60} pauseOnHover={false}>
      {ticker.map((w, i) => (
        <span key={w} className="mx-5 flex items-center gap-10 md:mx-8 md:gap-16">
          <span className={`display text-[clamp(3rem,8.5vw,8rem)] ${['', 'serif text-primary', 'text-outline'][i % 3]}`}>{w}</span>
          <span className="animate-spin-slow text-3xl text-primary md:text-5xl">✺</span>
        </span>
      ))}
    </Marquee>
  </section>
);

/* ───────────────────────── WORK ───────────────────────── */

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
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group/row grid grid-cols-[auto_1fr_auto] items-center gap-x-4 border-t border-line/15 py-7 transition-opacity duration-500 group-hover/list:opacity-30 hover:!opacity-100 md:grid-cols-[5rem_1fr_auto_4.5rem] md:gap-x-8 md:py-11"
            >
              <span className="font-mono text-xs tracking-widest text-muted-foreground">0{i + 1}</span>
              <div className="min-w-0">
                <h3 className="display text-[clamp(1.9rem,5.2vw,5rem)] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/row:translate-x-3 group-hover/row:text-primary md:group-hover/row:translate-x-6">
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
              <span className="grid h-11 w-11 place-items-center justify-self-end rounded-full border border-line/25 transition-all duration-500 group-hover/row:rotate-45 group-hover/row:border-primary group-hover/row:bg-primary group-hover/row:text-primary-foreground md:h-14 md:w-14">
                <ArrowUpRight size={20} />
              </span>
            </TransitionLink>
          </li>
        ))}
      </ul>

      {/* cursor-following preview (desktop) */}
      <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-30 hidden lg:block" style={{ x: sx, y: sy }}>
        <div className="-translate-x-1/2 -translate-y-1/2">
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={current.slug}
                initial={{ scale: 0.55, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: -4 }}
                exit={{ scale: 0.55, opacity: 0, rotate: 6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="group h-[230px] w-[330px] overflow-hidden rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
              >
                <ProjectCover kind={current.cover} hue={current.hue} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

/* ───────────────────────── PAGE ───────────────────────── */

const Home = () => (
  <PageTransition>
    <Hero />
    <Ticker />

    {/* selected work */}
    <section className="wrap section">
      <div className="mb-14 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
        <div>
          <Reveal>
            <p className="eyebrow mb-6">Selected work</p>
          </Reveal>
          <TextReveal
            as="h2"
            className="display text-[clamp(2.8rem,8.5vw,8.5rem)]"
            lines={[
              <span key="a">Things I&apos;ve</span>,
              <span key="b">
                <span className="serif text-primary">shipped</span> ({String(projects.length).padStart(2, '0')})
              </span>,
            ]}
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
      <WorkList />
    </section>

    {/* statement */}
    <section className="wrap section pt-8 md:pt-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_4fr]">
        <Reveal>
          <p className="eyebrow">The human</p>
        </Reveal>
        <div>
          <ScrollText
            className="display text-[clamp(1.9rem,4.7vw,4.6rem)] leading-[1.08] tracking-[-0.035em]"
            text="Engineer by logic, builder by obsession. I turn ideas into production-ready software — clear architecture, maintainable code, and interfaces that feel fast, smart and alive."
            highlight={['logic', 'obsession', 'alive']}
          />
          <Reveal delay={0.1} className="mt-12 flex flex-wrap items-center gap-3">
            <Magnetic strength={0.25}>
              <TransitionLink href="/about" className="btn btn-solid">
                More about me <ArrowUpRight size={16} />
              </TransitionLink>
            </Magnetic>
            <Magnetic strength={0.25}>
              <TransitionLink href="/contact" className="btn btn-ghost">
                Get in touch
              </TransitionLink>
            </Magnetic>
          </Reveal>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-2 border-t border-line/15 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="border-b border-line/15 py-10 pr-4 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:pl-8 lg:first:pl-0">
            <div className="display text-[clamp(3.2rem,7vw,6.5rem)]">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>

    {/* experience */}
    <section className="wrap section pt-8 md:pt-12">
      <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Reveal>
            <p className="eyebrow mb-6">Experience</p>
          </Reveal>
          <TextReveal
            as="h2"
            className="display text-[clamp(2.8rem,8.5vw,8.5rem)]"
            lines={[<span key="a">Where I&apos;ve</span>, <span key="b" className="serif text-primary">worked</span>]}
          />
        </div>
        <Reveal delay={0.1}>
          <Magnetic strength={0.25}>
            <TransitionLink href="/experience" className="btn btn-ghost">
              Full experience <ArrowUpRight size={16} />
            </TransitionLink>
          </Magnetic>
        </Reveal>
      </div>

      <div className="border-b border-line/15">
        {experiences.map((e, i) => (
          <Reveal key={e.company} delay={i * 0.06}>
            <FloodRow>
              <div className="grid items-center gap-3 py-8 md:grid-cols-[14rem_1fr_1fr] md:gap-8 md:py-10 md:pl-4">
                <span className="font-mono text-xs uppercase tracking-[0.18em] opacity-60">{e.short}</span>
                <div>
                  <h3 className="display text-3xl md:text-5xl">{e.company}</h3>
                  <p className="mt-1.5 opacity-70">{e.role}</p>
                </div>
                <p className="flex items-center gap-2 text-base md:justify-end md:pr-4">
                  <ArrowUpRight size={16} className="shrink-0" /> {e.highlight}
                </p>
              </div>
            </FloodRow>
          </Reveal>
        ))}
      </div>
    </section>

    {/* toolkit */}
    <section className="wrap section pt-8 md:pt-12">
      <div className="mb-14">
        <Reveal>
          <p className="eyebrow mb-6">Toolkit</p>
        </Reveal>
        <TextReveal
          as="h2"
          className="display text-[clamp(2.8rem,8.5vw,8.5rem)]"
          lines={[<span key="a">Tools I</span>, <span key="b" className="serif text-primary">build with</span>]}
        />
      </div>
      <div className="border-b border-line/15">
        {skillGroups.map((g, i) => (
          <Reveal key={g.title} delay={i * 0.06}>
            <FloodRow>
              <div className="grid gap-4 py-8 md:grid-cols-[5rem_16rem_1fr] md:items-baseline md:gap-8 md:py-10 md:pl-4">
                <span className="font-mono text-xs tracking-widest opacity-60">0{i + 1}</span>
                <h3 className="display text-3xl md:text-4xl">{g.title}</h3>
                <p className="text-lg leading-relaxed opacity-80 md:pr-4">{g.skills.join('  /  ')}</p>
              </div>
            </FloodRow>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 flex justify-center">
        <Magnetic strength={0.25}>
          <TransitionLink href="/skills" className="btn btn-ghost">
            See the full skillset <ArrowUpRight size={16} />
          </TransitionLink>
        </Magnetic>
      </Reveal>
    </section>
  </PageTransition>
);

export default Home;
