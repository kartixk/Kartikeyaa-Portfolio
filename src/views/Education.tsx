'use client';

import { ArrowUpRight, MapPin } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import PageHeader from '@/components/PageHeader';
import FloodRow from '@/components/FloodRow';
import { Reveal } from '@/components/fx';
import { certifications, education } from '@/lib/data';

const Education = () => (
  <PageTransition>
    <PageHeader
      index="05"
      eyebrow="Education"
      lines={[<span key="a">Academic</span>, <span key="b" className="serif text-primary">journey.</span>]}
      subtitle="Building a strong foundation in Computer Science — from core fundamentals to specialised IoT systems."
    />

    <section className="wrap pb-24 md:pb-40">
      {education.map((e, i) => (
        <article key={e.school} className="grid gap-8 border-t border-line/15 py-12 md:grid-cols-[1fr_2fr] md:gap-16 md:py-20">
          <Reveal className="md:sticky md:top-28 md:self-start">
            <span className="font-mono text-xs tracking-widest text-primary">0{i + 1}</span>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{e.period}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={13} /> {e.location}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-line/25 px-3.5 py-1 font-mono text-[11px] uppercase tracking-widest">
              <span className={`h-1.5 w-1.5 rounded-full ${e.status === 'Ongoing' ? 'animate-blink bg-primary' : 'bg-muted-foreground'}`} />
              {e.status}
            </span>
          </Reveal>

          <div>
            <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
              <div>
                <h2 className="display text-[clamp(2.2rem,5.4vw,5rem)]">{e.school}</h2>
                <p className="serif mt-3 text-2xl text-primary md:text-3xl">{e.degree}</p>
              </div>
              <div className="shrink-0 md:text-right">
                <p className="display text-[clamp(3rem,6vw,5.5rem)]">{e.grade}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{e.gradeLabel}</p>
              </div>
            </Reveal>
            <ul className="mt-10 border-b border-line/15">
              {e.highlights.map((h) => (
                <Reveal key={h} as="li" delay={0.05} className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-line/15 py-6">
                  <ArrowUpRight size={20} className="mt-1 text-primary" />
                  <p className="text-lg leading-relaxed md:text-xl">{h}</p>
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

export default Education;
