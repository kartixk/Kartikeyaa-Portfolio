'use client';

import { ArrowUpRight, MapPin } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import PageHeader from '@/components/PageHeader';
import FloodRow from '@/components/FloodRow';
import { Reveal } from '@/components/fx';
import { certifications, experiences } from '@/lib/data';

const Experience = () => (
  <PageTransition>
    <PageHeader
      index="04"
      eyebrow="Professional journey"
      lines={[<span key="a">Where I&apos;ve</span>, <span key="b" className="serif text-primary">worked.</span>]}
      subtitle="Internships where I shipped real features, collaborated across teams and drove measurable impact."
      meta={`${String(experiences.length).padStart(2, '0')} roles`}
    />

    <section className="wrap pb-24 md:pb-40">
      {experiences.map((e, i) => (
        <article key={e.company} className="grid gap-8 border-t border-line/15 py-12 md:grid-cols-[1fr_2fr] md:gap-16 md:py-20">
          <Reveal className="md:sticky md:top-28 md:self-start">
            <span className="font-mono text-xs tracking-widest text-primary">0{i + 1}</span>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{e.period}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={13} /> {e.location}
            </p>
          </Reveal>
          <div>
            <Reveal>
              <h2 className="display text-[clamp(2.4rem,6.4vw,6rem)]">{e.company}</h2>
              <p className="serif mt-3 text-2xl text-primary md:text-3xl">{e.role}</p>
            </Reveal>
            <ul className="mt-10 border-b border-line/15">
              {e.points.map((p, j) => (
                <Reveal key={j} as="li" delay={0.05} className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-line/15 py-6">
                  <ArrowUpRight size={20} className="mt-1 text-primary" />
                  <p className="text-lg leading-relaxed md:text-xl">{p}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </section>

    <section className="wrap pb-24 md:pb-40">
      <Reveal>
        <p className="eyebrow mb-10">Certifications &amp; training</p>
      </Reveal>
      <div className="border-b border-line/15">
        {certifications.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06}>
            <FloodRow>
              <div className="grid items-baseline gap-2 py-8 md:grid-cols-[1fr_auto] md:gap-8 md:py-10 md:pl-4 md:pr-6">
                <div>
                  <h3 className="display text-[clamp(1.8rem,4vw,3.4rem)]">{c.title}</h3>
                  <p className="mt-2 opacity-70">{c.org}</p>
                </div>
                <span className="font-mono text-xs uppercase tracking-[0.18em] opacity-70">{c.period}</span>
              </div>
            </FloodRow>
          </Reveal>
        ))}
      </div>
    </section>
  </PageTransition>
);

export default Experience;
