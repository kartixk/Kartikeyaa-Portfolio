'use client';

import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import PageHeader from '@/components/PageHeader';
import { Counter, Reveal, TextReveal } from '@/components/fx';
import { skillGroups, strengths } from '@/lib/data';

const accents = ['--c-orange', '--c-violet', '--c-cyan', '--c-lime'];

const Skills = () => (
  <PageTransition>
    <PageHeader
      index="03"
      eyebrow="My toolkit"
      lines={[<span key="a">The tools I</span>, <span key="b" className="serif text-gradient">build with.</span>]}
      subtitle="Technologies I use across the full stack — and the areas I'm actively levelling up in."
    />

    <section className="wrap pb-24 md:pb-40">
      {skillGroups.map((g, gi) => (
        <div key={g.title} className="grid gap-8 border-t border-line/15 py-12 md:grid-cols-[1fr_2.2fr] md:gap-16 md:py-16">
          <Reveal>
            <span className="font-mono text-xs tracking-widest" style={{ color: `hsl(var(${accents[gi % 4]}))` }}>0{gi + 1}</span>
            <h2 className="display mt-4 text-[clamp(2.2rem,4.4vw,4rem)]">{g.title}</h2>
          </Reveal>
          <ul className="flex flex-wrap content-start gap-2.5 sm:gap-3" style={{ ['--h' as string]: `var(${accents[gi % 4]})` }}>
            {g.skills.map((s, i) => (
              <Reveal key={s} as="li" delay={i * 0.04} duration={0.7}>
                <span
                  className="inline-block cursor-default rounded-full border border-[hsl(var(--h)/0.55)] px-4 py-2 font-display text-base font-semibold tracking-tight transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--h))] hover:bg-[hsl(var(--h))] hover:text-[#120d24] sm:px-6 sm:py-3 sm:text-xl md:px-8 md:py-4 md:text-2xl"
                >
                  {s}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      ))}
    </section>

    <section className="wrap pb-24 md:pb-40">
      <div className="mb-14">
        <Reveal>
          <p className="eyebrow mb-6">Strengths</p>
        </Reveal>
        <TextReveal as="h2" className="display text-[clamp(2.8rem,8.5vw,8.5rem)]" lines={[<span key="a">Where I&apos;m</span>, <span key="b" className="serif text-gradient">strongest</span>]} />
      </div>

      <div className="border-b border-line/15">
        {strengths.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06} className="border-t border-line/15 py-8 md:py-10">
            <div className="flex items-end justify-between gap-6">
              <h3 className="display text-[clamp(1.6rem,3.4vw,3rem)]">{s.label}</h3>
              <span className="display text-[clamp(2.2rem,5vw,4.5rem)] tabular-nums text-pink">
                <Counter value={s.value} suffix="%" />
              </span>
            </div>
            <div className="mt-6 h-px w-full bg-line/15">
              <motion.div
                className="h-[3px] -translate-y-px origin-left bg-primary"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: s.value / 100 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: '100%' }}
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  </PageTransition>
);

export default Skills;
