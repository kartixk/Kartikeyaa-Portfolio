'use client';

import { ArrowUpRight } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import TransitionLink from '@/components/TransitionLink';
import FloodRow from '@/components/FloodRow';
import WorkList from '@/components/WorkList';
import Hero from '@/components/Hero';
import { Counter, Magnetic, Reveal, ScrollText, TextReveal, Tilt, VelocityMarquee } from '@/components/fx';
import { experiences, projects, skillGroups, stats } from '@/lib/data';

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
    <div className="absolute -left-[5%] top-3 w-[110%] -rotate-2 bg-grad-pan py-2.5 text-[#0c0f0a] shadow-[0_20px_60px_-20px_hsl(var(--c-lime)/0.4)] sm:py-4">
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

const tileColors = ['bg-lime text-[#0c0f0a]', 'bg-foreground text-background', 'bg-card text-foreground ring-1 ring-line/20', 'bg-lime text-[#0c0f0a]'];

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
              <div className={`${tileColors[i]} flex h-full min-h-[10.5rem] flex-col justify-between rounded-3xl p-5 sm:min-h-[14rem] sm:p-7`}>
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
