'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import PageHeader from '@/components/PageHeader';
import TransitionLink from '@/components/TransitionLink';
import FloodRow from '@/components/FloodRow';
import WorkList from '@/components/WorkList';
import { Magnetic, Marquee, Reveal, ScrollText, TextReveal } from '@/components/fx';
import { interests, PHONE, PHOTO, softSkills, specializations, timeline } from '@/lib/data';
import { SITE } from '@/lib/site';

const facts = [
  { k: 'Based in', v: 'Visakhapatnam, India' },
  { k: 'Studying', v: 'B.Tech CSE (IoT) · GITAM University' },
  { k: 'Focus', v: 'Full-Stack · ML · IoT' },
  { k: 'Email', v: SITE.email, href: `mailto:${SITE.email}` },
  { k: 'Phone', v: PHONE, href: 'tel:+918250977949' },
];

const Portrait = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-9%', '9%']);

  return (
    <motion.div ref={ref} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-10% 0px' }} data-cursor="Hi!" className="group relative aspect-[4/5]">
    <motion.div
      variants={{
        hidden: { clipPath: 'inset(100% 0% 0% 0% round 28px)' },
        show: { clipPath: 'inset(0% 0% 0% 0% round 28px)', transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } },
      }}
      className="absolute inset-0 overflow-hidden rounded-[28px] bg-muted"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={PHOTO}
        alt="B Venkata Sai Kartikeya"
        style={{ y, scale: 1.2 }}
        className="h-full w-full object-cover object-[50%_30%] grayscale transition-[filter] duration-700 group-hover:grayscale-0"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-6 text-[#f1ecdc]">
        <div>
          <p className="display text-2xl">Kartikeya</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] opacity-80">Full-Stack Developer</p>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-widest opacity-70">Vizag, IN</span>
      </div>
    </motion.div>
    </motion.div>
  );
};

const Journey = () => {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <ol ref={ref} className="relative">
      <span aria-hidden className="absolute bottom-0 left-[7px] top-0 w-px bg-line/15 md:left-[11rem]" />
      <motion.span aria-hidden style={{ scaleY }} className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-primary md:left-[11rem]" />
      {timeline.map((t, i) => (
        <Reveal key={i} as="li" delay={0.03} className="relative grid gap-2 pb-12 pl-8 md:grid-cols-[11rem_1fr] md:gap-12 md:pb-16 md:pl-0">
          <span className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border border-primary bg-background md:left-[calc(11rem-7px)]" />
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground md:pt-1.5 md:text-right md:pr-8">{t.year}</p>
          <div className="md:pl-8">
            <h3 className="display text-2xl leading-[1.05] md:text-3xl">{t.title}</h3>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">{t.description}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
};

const About = () => (
  <PageTransition>
    <PageHeader
      index="01"
      eyebrow="About me"
      lines={[<span key="a">Crafting</span>, <span key="b" className="serif text-gradient">reliable</span>, <span key="c">software.</span>]}
      subtitle="Computer Science undergraduate at GITAM University. I turn ideas into production-ready applications — MERN stack first, clean architecture always."
    />

    {/* bio */}
    <section className="wrap pb-24 md:pb-40">
      <div className="grid gap-14 lg:grid-cols-[5fr_7fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Portrait />
        </div>
        <div>
          <ScrollText
            className="display text-[clamp(1.7rem,3.6vw,3.4rem)] leading-[1.12] tracking-[-0.03em]"
            text="I enjoy taking ideas from a simple sketch to a reliable, production-ready application. My recent work lives in the MERN stack and real-time IoT monitoring systems. I care about clear architecture, maintainable code and smooth user experiences more than chasing every new buzzword."
            highlight={['reliable', 'clear', 'maintainable']}
          />

          <dl className="mt-16 border-t border-line/15">
            {facts.map((f) => (
              <Reveal key={f.k} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-line/15 py-5 md:grid-cols-[10rem_1fr]">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{f.k}</dt>
                <dd className="text-lg font-medium">
                  {f.href ? (
                    <a href={f.href} className="link-u">
                      {f.v}
                    </a>
                  ) : (
                    f.v
                  )}
                </dd>
              </Reveal>
            ))}
          </dl>

          <Reveal className="mt-10 flex flex-wrap gap-3">
            <Magnetic strength={0.25}>
              <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                GitHub <ArrowUpRight size={16} />
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                LinkedIn <ArrowUpRight size={16} />
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <TransitionLink href="/contact" className="btn btn-solid">
                Let&apos;s talk <ArrowUpRight size={16} />
              </TransitionLink>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>

    {/* specializations */}
    <section className="wrap pb-24 md:pb-40">
      <Reveal>
        <p className="eyebrow mb-10">What I specialise in</p>
      </Reveal>
      <div className="border-b border-line/15">
        {specializations.map((s, i) => (
          <Reveal key={s} delay={i * 0.05}>
            <FloodRow>
              <div className="flex items-baseline justify-between gap-6 py-7 md:py-9 md:pl-4 md:pr-6">
                <div className="flex items-baseline gap-6 md:gap-12">
                  <span className="font-mono text-xs tracking-widest opacity-60">0{i + 1}</span>
                  <h3 className="display text-[clamp(1.6rem,4.6vw,4.2rem)]">{s}</h3>
                </div>
                <ArrowUpRight className="hidden shrink-0 md:block" />
              </div>
            </FloodRow>
          </Reveal>
        ))}
      </div>
    </section>

    {/* journey */}
    <section className="wrap pb-24 md:pb-40">
      <div className="mb-16 md:mb-24">
        <Reveal>
          <p className="eyebrow mb-6">The journey</p>
        </Reveal>
        <TextReveal as="h2" className="display text-[clamp(2.8rem,8.5vw,8.5rem)]" lines={[<span key="a">How I got</span>, <span key="b" className="serif text-gradient">here</span>]} />
      </div>
      <Journey />
    </section>

    {/* interests */}
    <section className="wrap pb-24 md:pb-40">
      <Reveal>
        <p className="eyebrow mb-10">Areas of interest</p>
      </Reveal>
      <div className="grid border-t border-line/15 md:grid-cols-2">
        {interests.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.06} className={`border-b border-line/15 py-10 md:py-14 ${i % 2 === 0 ? 'md:border-r md:pr-12' : 'md:pl-12'}`}>
            <span className="font-mono text-xs tracking-widest text-primary">0{i + 1}</span>
            <h3 className="display mt-5 text-[clamp(1.9rem,3.6vw,3.2rem)]">{it.title}</h3>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">{it.description}</p>
          </Reveal>
        ))}
      </div>
    </section>

    {/* projects — easy to reach from the About page, with a hover image preview */}
    <section className="wrap pb-16 sm:pb-24 md:pb-40">
      <div className="mb-10 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
        <div>
          <Reveal>
            <p className="eyebrow mb-5 md:mb-6">Selected work</p>
          </Reveal>
          <TextReveal
            as="h2"
            className="display text-[clamp(2.5rem,8.5vw,8.5rem)]"
            lines={[<span key="a">Things I&apos;ve</span>, <span key="b" className="serif text-gradient">built</span>]}
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

    {/* soft skills */}
    <section className="border-y border-line/15 py-8" aria-label="Soft skills">
      <Marquee duration={40}>
        {softSkills.map((s) => (
          <span key={s} className="mx-6 flex items-center gap-12">
            <span className="display text-[clamp(2.2rem,6vw,5rem)]">{s}</span>
            <span className="text-3xl text-gradient">✺</span>
          </span>
        ))}
      </Marquee>
    </section>
  </PageTransition>
);

export default About;
