'use client';

import { motion } from 'framer-motion';
import Avatar from '@/components/hero/Avatar';
import { CloudsBack, CloudsFront } from '@/components/hero/Clouds';
import { useReady } from '@/components/ready';
import { Reveal, TextReveal } from '@/components/fx';

/** Italic serif word with a hand-drawn underline stroke (matches the "Kartikeya" italic); optional hover wiggle. */
const Marked = ({ children, wiggle }: { children: string; wiggle?: boolean }) => (
  <motion.em
    className="serif relative inline-block text-foreground lg:text-[#0c0f0a]"
    whileHover={wiggle ? { rotate: [0, -4, 3, -2, 0], transition: { duration: 0.5 } } : undefined}
  >
    {children}
    <svg aria-hidden viewBox="0 0 100 8" preserveAspectRatio="none" className="absolute -bottom-[0.14em] left-0 h-[0.26em] w-full overflow-visible">
      <path d="M1 5 C 18 1, 34 7, 52 3.5 S 86 2, 99 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  </motion.em>
);


/**
 * Hero. Reading order is the point: who I am → what I do → proof → what to click.
 *  - lg+: copy on the left of the colour field, the illustrated portrait anchored bottom-right between the clouds
 *  - below lg: portrait on top (right-leaning) on the colour field; copy underneath on the page background,
 *    which the front clouds already blend into
 * Copy colours follow the surface: ink on cyan (lg), foreground on the page background (mobile).
 */
const Hero = () => {
  const ready = useReady();

  return (
    <section className="relative isolate flex flex-col overflow-hidden bg-background lg:block lg:h-svh lg:min-h-[40rem]">
      {/* ── visual: colour field + clouds + portrait ── */}
      <div className={`relative h-[max(50svh,25rem)] shrink-0 overflow-hidden bg-[hsl(187_92%_55%)] lg:absolute lg:inset-0 lg:h-auto`}>
        <CloudsBack />

        <div className="pointer-events-none absolute -bottom-[1svh] right-[-8vw] z-20 sm:right-[6vw] lg:-bottom-[2svh] lg:right-[3vw]">
          <motion.div
            initial={{ y: 48, opacity: 0 }}
            animate={ready ? { y: 0, opacity: 1 } : undefined}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="w-[min(78vw,22rem)] shrink-0 lg:w-[min(66svh,44vw)]"
          >
            {/* desktop, light theme: shoulders dissolve into the off-white clouds instead of ending in a flat cut (dark theme needs no fade) */}
            <div className="lg:[-webkit-mask-image:linear-gradient(to_bottom,#000_82%,transparent_97%)] lg:[mask-image:linear-gradient(to_bottom,#000_82%,transparent_97%)] dark:lg:[-webkit-mask-image:none] dark:lg:[mask-image:none]">
              <Avatar />
            </div>
          </motion.div>
        </div>

        <CloudsFront />
        {/* below lg the portrait is cut by the panel edge — fade it into the page background the copy sits on */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-24 bg-gradient-to-t from-background via-background/70 to-transparent lg:hidden" />
      </div>

      {/* ── copy ── */}
      <div className="relative z-30 text-foreground lg:absolute lg:inset-x-0 lg:top-0 lg:pt-[max(8rem,25svh)] lg:text-[#0c0f0a]">
        <div className="wrap pb-14 pt-2 lg:pb-0 lg:pt-0">
          <div className="max-w-[36rem] lg:max-w-[44rem] 2xl:max-w-[60rem]">
            <TextReveal
              as="h1"
              immediate
              delay={0.15}
              className="display text-[clamp(2.4rem,10.5vw,3.75rem)] lg:text-[clamp(2.6rem,min(4.4vw,8svh),5.25rem)]"
              lines={[
                <span key="a">
                  Hi, I&apos;m <span className="serif">Kartikeya</span>
                </span>,
                <span key="b">a Full-Stack Developer.</span>,
              ]}
            />

            {/* supporting copy: heading → line 1 → line 2, each one beat after the last */}
            <p className="mt-5 max-w-xl font-[family-name:var(--font-serif)] text-[1.5rem] leading-[1.25] text-foreground/90 sm:mt-6 xl:text-[1.75rem] lg:text-[#0f0f0f]/90">
              <Reveal as="span" immediate delay={0.5} duration={0.7} distance={16} className="block text-balance">
                From the first query to the final deploy,
              </Reveal>
              <Reveal as="span" immediate delay={0.68} duration={0.7} distance={16} className="block text-balance">
                I build what lives on your <Marked>screen</Marked> and in your <Marked wiggle>pocket</Marked>.
              </Reveal>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
