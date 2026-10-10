'use client';

import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import { useLenis } from 'lenis/react';
import TransitionLink from '@/components/TransitionLink';
import LocalTime from '@/components/LocalTime';
import AsciiArt from '@/components/AsciiArt';
import CodeWindow from '@/components/CodeWindow';
import { Magnetic, Reveal, SplitChars, TextReveal, Tilt } from '@/components/fx';
import { PHOTO, RESUME_URL } from '@/lib/data';

const Hero = () => {
  // hero v3: message left, live code editor right, info strip below
  const lenis = useLenis();
  const explore = () => {
    const y = window.innerHeight * 0.92;
    lenis ? lenis.scrollTo(y, { duration: 1.3 }) : window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden pb-6 pt-24 sm:pt-28">
      <div className="wrap relative z-10 grid flex-1 items-center gap-10 py-6 lg:grid-cols-[1.12fr_1fr] lg:gap-10 xl:gap-16">
        {/* left: message */}
        <div>
          <Reveal immediate delay={0.1} className="mb-6 md:mb-8">
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
            className="display text-[clamp(2.7rem,14vw,5rem)] uppercase sm:text-[clamp(3rem,10.5vw,6.5rem)] lg:text-[clamp(3rem,7.4vw,7.6rem)]"
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

          <Reveal immediate delay={0.75} className="mt-7 max-w-xl md:mt-9">
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              I&apos;m <span className="font-semibold text-foreground">Kartikeya</span> — a CS undergrad who designs and ships full-stack products across{' '}
              <span className="font-medium text-foreground underline decoration-[hsl(var(--c-lime))] decoration-2 underline-offset-4">MERN</span>,{' '}
              <span className="font-medium text-foreground underline decoration-[hsl(var(--c-lime))] decoration-2 underline-offset-4">machine learning</span> and{' '}
              <span className="font-medium text-foreground underline decoration-[hsl(var(--c-lime))] decoration-2 underline-offset-4">IoT</span>.
            </p>
          </Reveal>

          <Reveal immediate delay={0.85} className="mt-7 flex flex-wrap items-center gap-3 md:mt-9">
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

        {/* right: the editor */}
        <Reveal immediate delay={0.5} direction="left" distance={60} className="relative lg:w-full lg:max-w-[34rem] lg:justify-self-end">
          {/* ASCII </> tucked behind the editor — in flow, so it can never collide or get cropped */}
          <AsciiArt className="relative z-0 -mb-8 hidden lg:ml-auto lg:block [--w:min(24rem,28vw)]" />
          <Tilt max={4} className="relative z-10 w-full">
            <CodeWindow />
          </Tilt>
        </Reveal>
      </div>

      {/* info strip — anchors the bottom of the hero */}
      <Reveal immediate delay={1} className="wrap relative z-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line/15 pt-5 md:grid-cols-4 md:gap-0">
          <Cell label="Based in">
            Visakhapatnam, IN · <LocalTime className="font-mono text-muted-foreground" />
          </Cell>
          <Cell label="Focus">Full-Stack · ML · IoT</Cell>
          <Cell label="Currently">Developer Intern, Spotmies</Cell>
          <button
            onClick={explore}
            data-cursor="Scroll"
            className="group col-span-2 flex items-center justify-between gap-3 text-left md:col-span-1 md:border-l md:border-line/15 md:pl-6"
          >
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Explore</span>
              <span className="mt-1 block text-sm font-medium">Scroll for the work</span>
            </span>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line/25 transition-colors duration-300 group-hover:border-transparent group-hover:bg-lime group-hover:text-[#0c0f0a]">
              <ArrowDown size={16} className="animate-bounce [animation-duration:2.2s]" />
            </span>
          </button>
        </div>
      </Reveal>
    </section>
  );
};

const Cell = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="md:border-l md:border-line/15 md:pl-6 md:first:border-l-0 md:first:pl-0">
    <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
    <span className="mt-1 block text-sm font-medium">{children}</span>
  </div>
);

export default Hero;
