'use client';

import { useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import TransitionLink from '@/components/TransitionLink';
import { Draggable, Magnetic, Reveal, TextReveal } from '@/components/fx';

const NotFound = () => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <PageTransition>
      <div ref={ref} className="relative flex min-h-svh flex-col justify-center overflow-hidden pb-16 pt-32">
        <div className="wrap relative z-10">
          <Reveal immediate direction="none">
            <p className="eyebrow mb-6">Error — page not found</p>
          </Reveal>
          <TextReveal as="h1" immediate delay={0.1} className="display text-[clamp(8rem,34vw,34rem)] leading-[0.8]" lines={[<span key="a">404</span>]} />
          <Reveal immediate delay={0.5} className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-xl leading-snug text-muted-foreground">
              This page <span className="serif text-primary">drifted away.</span> It doesn&apos;t exist or has moved — let&apos;s get you back on track.
            </p>
            <Magnetic strength={0.25}>
              <TransitionLink href="/" className="btn btn-solid !px-8 !py-5 !text-base">
                <ArrowLeft size={18} /> Back home
              </TransitionLink>
            </Magnetic>
          </Reveal>
        </div>
        <Draggable constraintsRef={ref} rotate={-10} delay={1} className="right-[10%] top-[28%]">
          <span className="block rounded-full bg-primary px-6 py-3 font-display text-lg font-bold text-primary-foreground">Lost? Drag me 🧭</span>
        </Draggable>
      </div>
    </PageTransition>
  );
};

export default NotFound;
