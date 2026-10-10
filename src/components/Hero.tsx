'use client';

import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import TransitionLink from '@/components/TransitionLink';
import LocalTime from '@/components/LocalTime';
import Avatar from '@/components/hero/Avatar';
import { CloudsBack, CloudsFront } from '@/components/hero/Clouds';
import { useReady } from '@/components/ready';
import { Magnetic, Reveal, TextReveal } from '@/components/fx';
import { RESUME_URL } from '@/lib/data';

/**
 * Hero, in the spirit of an editorial "character" opener: a bold colour field, an oversized tone-on-tone name,
 * an illustrated character in front of it, and layered clouds + bubbles that melt into the page.
 * Stacking order: name → back clouds → character → front clouds → text.
 */
const Hero = () => {
  const lenis = useLenis();
  const ready = useReady();
  const explore = () => {
    const y = window.innerHeight * 0.98;
    lenis ? lenis.scrollTo(y, { duration: 1.3 }) : window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section className="relative isolate min-h-svh overflow-hidden bg-[hsl(76_96%_58%)] text-[#0c0f0a]">
      {/* tone-on-tone name */}
      <div className="absolute inset-x-0 top-[24svh] z-0 select-none px-[3vw] sm:top-[22svh]">
        <TextReveal
          as="h1"
          immediate
          delay={0.1}
          className="display whitespace-nowrap text-center text-[15.6vw] uppercase leading-[0.8] text-[#0c0f0a]/[0.2]"
          lines={['Kartikeya']}
        />
        <Reveal immediate delay={0.7} className="mt-3 flex justify-end pr-[2vw] sm:mt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#0c0f0a]/65 sm:text-xs md:text-sm">A Full-Stack Developer</p>
        </Reveal>
      </div>

      <CloudsBack />

      {/* character */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-[2svh] z-20 flex justify-center">
        <motion.div
          initial={{ y: 160, opacity: 0, scale: 0.94 }}
          animate={ready ? { y: 0, opacity: 1, scale: 1 } : undefined}
          transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.35 }}
          className="w-[min(78svh,142vw)] shrink-0 sm:w-[min(72svh,110vw)] lg:w-[min(72svh,64vw)]"
        >
          <div className="animate-float" style={{ animationDuration: '7s' }}>
            <Avatar />
          </div>
        </motion.div>
      </div>

      <CloudsFront />
      {/* solid base so the actions below stay legible on small screens */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 z-30 h-[17svh] bg-background lg:hidden" />

      {/* desktop: intro + actions float on the colour field, either side of the character */}
      <div className="absolute inset-x-0 top-[49svh] z-30 hidden lg:block">
        <div className="wrap flex items-start justify-between">
          <Reveal immediate delay={0.9} className="max-w-[22rem]">
            <p className="font-display text-[1.35rem] font-semibold leading-snug tracking-tight">
              I design &amp; ship full-stack products across MERN, ML and IoT.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Magnetic strength={0.2}>
                <TransitionLink href="/projects" className="btn !bg-[#0c0f0a] !px-5 !py-3 !text-[#f1f2ea] [--btn-fill:#fff] hover:!text-[#0c0f0a]">
                  View projects <ArrowUpRight size={15} />
                </TransitionLink>
              </Magnetic>
              <a href={RESUME_URL} download="Kartikeya_Resume.pdf" className="btn border border-[#0c0f0a]/50 !px-5 !py-3 text-[#0c0f0a] [--btn-fill:#0c0f0a] hover:!border-transparent hover:!text-[#f1f2ea]">
                Resume <Download size={14} />
              </a>
            </div>
          </Reveal>

          <Reveal immediate delay={1} className="flex items-center gap-4">
            <span className="text-right font-mono text-[10px] uppercase tracking-[0.2em] text-[#0c0f0a]/70">
              Visakhapatnam, IN
              <br />
              <LocalTime />
            </span>
            <button
              onClick={explore}
              aria-label="Scroll to the work"
              data-cursor="Scroll"
              className="grid h-12 w-12 place-items-center rounded-full border border-[#0c0f0a]/50 transition-colors duration-300 hover:bg-[#0c0f0a] hover:text-[#f1f2ea]"
            >
              <ArrowDown size={18} className="animate-bounce [animation-duration:2.2s]" />
            </button>
          </Reveal>
        </div>
      </div>

      {/* phones & tablets: actions sit on the solid base */}
      <Reveal immediate delay={0.9} className="absolute inset-x-0 bottom-0 z-40 flex h-[17svh] flex-wrap items-center justify-center gap-3 px-4 text-foreground lg:hidden">
        <TransitionLink href="/projects" className="btn btn-grad !px-5 !py-3">
          View projects <ArrowUpRight size={15} />
        </TransitionLink>
        <a href={RESUME_URL} download="Kartikeya_Resume.pdf" className="btn btn-ghost !px-5 !py-3">
          Resume <Download size={14} />
        </a>
      </Reveal>
    </section>
  );
};

export default Hero;
