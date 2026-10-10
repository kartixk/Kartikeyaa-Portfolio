'use client';

import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import { useLenis } from 'lenis/react';
import TransitionLink from '@/components/TransitionLink';
import LocalTime from '@/components/LocalTime';
import AsciiArt from '@/components/AsciiArt';
import CodeWindow from '@/components/CodeWindow';
import { Magnetic, ProjectCover, Reveal, SplitChars, TextReveal, Tilt } from '@/components/fx';
import { getProject, PHOTO, RESUME_URL } from '@/lib/data';

const featured = getProject('zenith-zap');

/**
 * Hero — one screen, three layers:
 *  1. message (left): status, headline, intro, actions, where I've worked
 *  2. stage (right): live code editor with the ASCII </> crowning it and one real project card
 *  3. base bar: location/time and a scroll cue
 * Type is sized from both width and height so everything fits above the fold on 1280×720 laptops.
 */
const Hero = () => {
  const lenis = useLenis();
  const explore = () => {
    const y = window.innerHeight * 0.95;
    lenis ? lenis.scrollTo(y, { duration: 1.3 }) : window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden pt-[5.25rem] lg:pt-24">
      <div className="wrap relative z-10 grid flex-1 items-center gap-12 py-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-10 xl:gap-16">
        {/* ── message ── */}
        <div>
          <Reveal immediate delay={0.1} className="mb-5 md:mb-7">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-line/20 bg-card/60 py-1.5 pl-3 pr-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur sm:text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
              </span>
              Available for work
            </span>
          </Reveal>

          <TextReveal
            as="h1"
            immediate
            delay={0.15}
            className="display text-[clamp(2.7rem,14vw,5rem)] uppercase sm:text-[clamp(3rem,10.5vw,6.5rem)] lg:text-[clamp(3rem,min(7vw,12svh),8rem)]"
            lines={[
              <SplitChars key="1" text="Building" />,
              <span key="2" className="flex items-center gap-[0.12em] whitespace-nowrap normal-case">
                <span className="serif text-gradient">reliable</span>
                <span
                  data-cursor="Hello"
                  className="group relative inline-block h-[0.66em] w-[1.5em] shrink-0 overflow-hidden rounded-full ring-2 ring-line/30 transition-shadow duration-500 hover:ring-4 hover:ring-lime"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={PHOTO}
                    alt="Portrait of B Venkata Sai Kartikeya"
                    className="h-full w-full scale-110 object-cover object-[50%_58%] grayscale transition-all duration-700 group-hover:scale-100 group-hover:grayscale-0"
                  />
                </span>
              </span>,
              <SplitChars key="3" text="Software" />,
            ]}
          />

          <Reveal immediate delay={0.7} className="mt-6 max-w-xl md:mt-8">
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              I&apos;m <span className="font-semibold text-foreground">Kartikeya</span> — a CS undergrad who designs and ships full-stack products across{' '}
              <span className="font-medium text-foreground underline decoration-[hsl(var(--c-lime))] decoration-2 underline-offset-4">MERN</span>,{' '}
              <span className="font-medium text-foreground underline decoration-[hsl(var(--c-lime))] decoration-2 underline-offset-4">machine learning</span> and{' '}
              <span className="font-medium text-foreground underline decoration-[hsl(var(--c-lime))] decoration-2 underline-offset-4">IoT</span>.
            </p>
          </Reveal>

          <Reveal immediate delay={0.8} className="mt-6 flex flex-wrap items-center gap-3 md:mt-8">
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

          <Reveal immediate delay={0.9} className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1.5 lg:[@media(max-height:740px)]:hidden">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Worked with</span>
            <span className="hidden h-px w-8 bg-line/25 sm:block" />
            <span className="text-sm font-medium text-foreground/80">Spotmies · NTPC · Zenith-Zap</span>
          </Reveal>
        </div>

        {/* ── stage ── */}
        <Reveal
          immediate
          delay={0.45}
          direction="left"
          distance={50}
          className="relative mx-auto w-full max-w-[34rem] pb-7 lg:mx-0 lg:justify-self-end lg:pb-3"
        >
          <div className="relative lg:rounded-[2rem] lg:border lg:border-line/10 lg:bg-gradient-to-b lg:from-card/50 lg:to-transparent lg:p-5">
            {/* the </> sits inside the stage, fading into the editor */}
            <div
              aria-hidden
              className="pointer-events-none -mb-5 hidden justify-center pt-1 lg:flex"
              style={{ WebkitMaskImage: 'linear-gradient(to bottom, #000 45%, transparent)', maskImage: 'linear-gradient(to bottom, #000 45%, transparent)' }}
            >
              <AsciiArt className="[--w:14rem] [@media(max-height:740px)]:[--w:11rem]" />
            </div>

            <Tilt max={3} className="relative z-10 w-full">
              <CodeWindow />
            </Tilt>

            {/* one real project, floating off the corner */}
            {featured && (
              <div className="absolute -bottom-8 -right-2 z-20 hidden w-44 sm:block lg:hidden xl:-right-7 xl:block xl:w-48" style={{ ['--r' as string]: '4deg' }}>
                <div className="animate-float">
                  <TransitionLink
                    href={`/projects/${featured.slug}`}
                    data-cursor="View"
                    className="group block overflow-hidden rounded-xl border border-line/20 bg-card shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-[16/10]">
                      <ProjectCover kind={featured.cover} hue={featured.hue} hue2={featured.hue2} image={featured.image} alt={`${featured.title} preview`} />
                    </div>
                    <div className="flex items-center justify-between gap-2 px-3 py-2">
                      <span className="min-w-0">
                        <span className="block truncate font-display text-[13px] font-semibold tracking-tight">Zenith-Zap</span>
                        <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Live project</span>
                      </span>
                      <ArrowUpRight size={15} className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </TransitionLink>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* ── base bar ── */}
      <Reveal immediate delay={1} className="wrap relative z-10">
        <div className="flex items-center justify-between gap-4 border-t border-line/15 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
          <span>
            Visakhapatnam, IN · <LocalTime />
          </span>
          <span className="hidden md:block">Full-Stack · ML · IoT</span>
          <button onClick={explore} data-cursor="Scroll" className="group inline-flex items-center gap-3 uppercase tracking-[0.18em] transition-colors hover:text-foreground">
            Scroll
            <span className="grid h-9 w-9 place-items-center rounded-full border border-line/25 transition-colors duration-300 group-hover:border-transparent group-hover:bg-lime group-hover:text-[#0c0f0a]">
              <ArrowDown size={15} className="animate-bounce [animation-duration:2.2s]" />
            </span>
          </button>
        </div>
      </Reveal>
    </section>
  );
};

export default Hero;
