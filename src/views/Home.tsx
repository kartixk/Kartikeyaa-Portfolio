'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import TransitionLink from '@/components/TransitionLink';
import FloodRow from '@/components/FloodRow';
import LocalTime from '@/components/LocalTime';
import WorkList from '@/components/WorkList';
import { Counter, Draggable, Magnetic, Reveal, ScrollText, SplitChars, TextReveal, Tilt, VelocityMarquee } from '@/components/fx';
import { experiences, PHOTO, projects, RESUME_URL, skillGroups, stats } from '@/lib/data';

/* ───────────────────────── HERO ───────────────────────── */

const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.2]);

  return (
    <section ref={ref} className="relative flex min-h-svh flex-col justify-end overflow-hidden md:min-h-[min(100svh,58rem)] pb-8 pt-28 sm:pb-10 md:pb-14 md:pt-32">
      <motion.div style={{ y, opacity: fade }} className="wrap relative z-10 w-full">
        {/* status row */}
        <Reveal immediate delay={0.1} className="mb-6 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px] md:mb-12">
          <span className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
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
          className="display text-[clamp(2.9rem,17vw,5.6rem)] uppercase sm:text-[clamp(3.1rem,14.2vw,15.5rem)]"
          lines={[
            <SplitChars key="1" text="Building" />,
            <span key="2" className="flex items-center gap-[0.12em] whitespace-nowrap normal-case">
              <span className="serif text-gradient">reliable</span>
              <span
                data-cursor="Hello"
                className="group relative inline-block h-[0.66em] w-[1.5em] shrink-0 overflow-hidden rounded-full ring-2 ring-pink/60 transition-shadow duration-500 hover:ring-4 hover:ring-lime"
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
              <SplitChars text="Software" />
              <sup className="mt-[0.35em] hidden font-mono text-[clamp(0.6rem,0.9vw,0.8rem)] font-normal normal-case leading-snug tracking-[0.18em] text-muted-foreground lg:block">
                (FULL-STACK
                <br />
                ML · IoT)
              </sup>
            </span>,
          ]}
        />

        {/* intro + CTAs */}
        <div className="mt-8 grid gap-7 md:mt-14 md:grid-cols-[1.3fr_1fr] md:items-end md:gap-8">
          <Reveal immediate delay={0.75}>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              I&apos;m <span className="font-semibold text-foreground">Kartikeya</span> — a CS undergrad who designs and ships full-stack products across{' '}
              <span className="font-medium text-pink">MERN</span>, <span className="font-medium text-violet">machine learning</span> and{' '}
              <span className="font-medium text-cyan">IoT</span>.
            </p>
          </Reveal>
          <Reveal immediate delay={0.85} className="flex flex-wrap items-center gap-3 md:justify-end">
            <Magnetic strength={0.25}>
              <TransitionLink href="/projects" className="btn btn-grad">
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
          <Draggable constraintsRef={ref} rotate={-9} delay={1.5} className="right-[5%] top-[19%] sm:right-[8%] sm:top-[24%] md:right-[12%] md:top-[26%]">
            <span className="block rounded-full bg-grad-pan px-4 py-2.5 font-display text-sm font-bold text-[#120d24] shadow-[0_14px_40px_-12px_hsl(var(--c-pink)/0.8)] sm:px-5 sm:py-3 sm:text-base md:px-7 md:py-4 md:text-xl">
              Drag me! ✋
            </span>
          </Draggable>
          <Draggable constraintsRef={ref} rotate={7} delay={1.65} className="right-[21%] top-[43%] hidden md:block">
            <span className="block rounded-full border-2 border-violet bg-background/60 px-6 py-3 font-display text-lg font-semibold text-violet backdrop-blur">MERN ✺</span>
          </Draggable>
          <Draggable constraintsRef={ref} rotate={-5} delay={1.8} className="right-[4%] top-[40%] sm:top-[45%] md:top-[47%]">
            <span className="grid h-16 w-16 animate-wobble place-items-center rounded-full bg-lime font-display text-base font-bold text-[#120d24] sm:h-24 sm:w-24 sm:text-2xl md:h-28 md:w-28" style={{ ['--r' as string]: '-5deg' }}>ML/AI</span>
          </Draggable>
          <Draggable constraintsRef={ref} rotate={12} delay={1.95} className="left-[67%] top-[16%] hidden lg:block">
            <span className="block rounded-xl bg-cyan px-5 py-3 font-mono text-sm font-semibold uppercase tracking-widest text-[#120d24]">IoT</span>
          </Draggable>
          <Draggable constraintsRef={ref} rotate={-6} delay={2.1} className="left-[44%] top-[12%] hidden lg:block">
            <span className="block rounded-full bg-orange px-5 py-2.5 font-display text-base font-bold text-[#120d24]">React ⚛</span>
          </Draggable>
        </div>
      </div>

      {/* spinning scroll badge */}
      <Reveal immediate delay={1.2} direction="none" className="absolute bottom-40 right-5 z-10 hidden lg:right-12 lg:block">
        <div className="relative grid h-28 w-28 place-items-center">
          <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow" aria-hidden>
            <defs>
              <path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
            </defs>
            <text className="fill-current font-mono text-[9.5px] uppercase tracking-[0.32em]">
              <textPath href="#circ">Scroll down • Scroll down • </textPath>
            </text>
          </svg>
          <ArrowDown size={22} className="text-pink" />
        </div>
      </Reveal>
    </section>
  );
};

/* ───────────────────────── TILTED BANDS ───────────────────────── */

const phrases = ['Full-Stack', 'Machine Learning', 'IoT', 'Scalable APIs', 'Creative Dev'];

const Band = ({ reverse }: { reverse?: boolean }) => (
  <>
    {phrases.map((w, i) => (
      <span key={w} className="mx-4 flex items-center gap-8 sm:mx-6 sm:gap-12">
        <span className={`display text-[clamp(1.7rem,5.2vw,4.8rem)] ${(i + (reverse ? 1 : 0)) % 2 ? 'serif' : ''}`}>{w}</span>
        <span className="animate-spin-slow text-2xl sm:text-4xl">✺</span>
      </span>
    ))}
  </>
);

const Bands = () => (
  <section aria-hidden className="relative my-4 h-[9.5rem] overflow-hidden sm:h-[13rem] md:my-8 md:h-[17rem]">
    <div className="absolute -left-[5%] top-3 w-[110%] -rotate-2 bg-grad-pan py-2.5 text-[#120d24] shadow-[0_20px_60px_-20px_hsl(var(--c-pink)/0.6)] sm:py-4">
      <VelocityMarquee direction={-1} speed={3.2}>
        <Band />
      </VelocityMarquee>
    </div>
    <div className="absolute -left-[5%] top-[4.6rem] w-[110%] rotate-2 bg-foreground py-2.5 text-background sm:top-[6.2rem] sm:py-4 md:top-[8.2rem]">
      <VelocityMarquee direction={1} speed={3.2}>
        <Band reverse />
      </VelocityMarquee>
    </div>
  </section>
);

/* ───────────────────────── PAGE ───────────────────────── */

const tileColors = ['bg-pink', 'bg-violet', 'bg-cyan', 'bg-lime'];

const SectionTitle = ({ eyebrow, lines }: { eyebrow: string; lines: React.ReactNode[] }) => (
  <div>
    <Reveal>
      <p className="eyebrow mb-5 md:mb-6">{eyebrow}</p>
    </Reveal>
    <TextReveal as="h2" className="display text-[clamp(2.5rem,8.5vw,8.5rem)]" lines={lines} />
  </div>
);

const Home = () => (
  <PageTransition>
    <Hero />
    <Bands />

    {/* about */}
    <section className="wrap section">
      <div className="grid gap-8 lg:grid-cols-[1fr_4fr] lg:gap-10">
        <Reveal>
          <p className="eyebrow">About me</p>
        </Reveal>
        <div>
          <ScrollText
            className="display text-[clamp(1.7rem,4.7vw,4.6rem)] leading-[1.1] tracking-[-0.035em]"
            text="Engineer by logic, builder by obsession. I turn ideas into production-ready software — clear architecture, maintainable code, and interfaces that feel fast, smart and alive."
            highlight={['logic', 'obsession', 'alive']}
          />
          <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center gap-3 md:mt-12">
            <Magnetic strength={0.25}>
              <TransitionLink href="/about" className="btn btn-grad">
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

      <div className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 md:mt-24 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <Tilt className="h-full" max={9}>
              <div className={`${tileColors[i]} flex h-full min-h-[10.5rem] flex-col justify-between rounded-3xl p-5 text-[#120d24] sm:min-h-[14rem] sm:p-7`}>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] opacity-70 sm:text-[11px]">0{i + 1}</p>
                <div>
                  <div className="display text-[clamp(2.8rem,7vw,6.2rem)]">
                    <Counter value={s.value} suffix={s.suffix} />
                  </div>
                  <p className="mt-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] sm:text-[11px]">{s.label}</p>
                </div>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>

    {/* selected work — sits directly below About */}
    <section className="wrap pb-16 pt-4 sm:pb-24 md:pb-36">
      <div className="mb-10 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
        <SectionTitle
          eyebrow="Selected work"
          lines={[
            <span key="a">Things I&apos;ve</span>,
            <span key="b">
              <span className="serif text-gradient">shipped</span> ({String(projects.length).padStart(2, '0')})
            </span>,
          ]}
        />
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

    {/* experience */}
    <section className="wrap pb-16 sm:pb-24 md:pb-36">
      <div className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
        <SectionTitle eyebrow="Experience" lines={[<span key="a">Where I&apos;ve</span>, <span key="b" className="serif text-gradient">worked</span>]} />
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
              <div className="grid items-center gap-2 py-6 md:grid-cols-[14rem_1fr_1fr] md:gap-8 md:py-10 md:pl-4">
                <span className="font-mono text-xs uppercase tracking-[0.18em] opacity-60">{e.short}</span>
                <div>
                  <h3 className="display text-[clamp(1.8rem,5vw,3rem)]">{e.company}</h3>
                  <p className="mt-1.5 opacity-70">{e.role}</p>
                </div>
                <p className="flex items-center gap-2 text-sm sm:text-base md:justify-end md:pr-4">
                  <ArrowUpRight size={16} className="shrink-0" /> {e.highlight}
                </p>
              </div>
            </FloodRow>
          </Reveal>
        ))}
      </div>
    </section>

    {/* toolkit */}
    <section className="wrap pb-16 sm:pb-24 md:pb-36">
      <div className="mb-10 md:mb-14">
        <SectionTitle eyebrow="Toolkit" lines={[<span key="a">Tools I</span>, <span key="b" className="serif text-gradient">build with</span>]} />
      </div>
      <div className="border-b border-line/15">
        {skillGroups.map((g, i) => (
          <Reveal key={g.title} delay={i * 0.06}>
            <FloodRow>
              <div className="grid gap-3 py-6 md:grid-cols-[5rem_16rem_1fr] md:items-baseline md:gap-8 md:py-10 md:pl-4">
                <span className="font-mono text-xs tracking-widest opacity-60">0{i + 1}</span>
                <h3 className="display text-[clamp(1.8rem,4.5vw,2.5rem)]">{g.title}</h3>
                <p className="text-base leading-relaxed opacity-80 sm:text-lg md:pr-4">{g.skills.join('  /  ')}</p>
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
