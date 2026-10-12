'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Reveal, TextReveal } from '@/components/fx';

const FRAME_COUNT = 96;
/** Extra zoom into the footage (1 = none). The watermark crop is already baked into the exported frames. */
const ZOOM = 1;
const ZOOM_ORIGIN = { x: 0.2, y: 0.2 };
const frameSrc =(i: number) => `/hero-frames/f${String(i + 1).padStart(3, '0')}.webp`;

/** Italic serif word with a hand-drawn underline stroke (matches the "Kartikeya" italic); optional hover wiggle. */
const Marked = ({ children, wiggle }: { children: string; wiggle?: boolean }) => (
  <motion.em
    className="serif relative inline-block"
    whileHover={wiggle ? { rotate: [0, -4, 3, -2, 0], transition: { duration: 0.5 } } : undefined}
  >
    {children}
    <svg aria-hidden viewBox="0 0 100 8" preserveAspectRatio="none" className="absolute -bottom-[0.14em] left-0 h-[0.26em] w-full overflow-visible">
      <path d="M1 5 C 18 1, 34 7, 52 3.5 S 86 2, 99 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  </motion.em>
);

/**
 * Scroll-scrubbed background: an image sequence painted to a canvas (object-fit: cover).
 * Frame 0 loads first, the rest stream in; the canvas always shows the nearest frame that has loaded.
 */
const FrameScrub = ({ progress, staticEnd }: { progress: ReturnType<typeof useSpring>; staticEnd: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | undefined)[]>([]);
  const current = useRef(staticEnd ? FRAME_COUNT - 1 : 0);

  const draw = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let img: HTMLImageElement | undefined;
    for (let i = index; i >= 0 && !img; i--) img = frames.current[i];
    if (!img) return;
    const { width: cw, height: ch } = canvas;
    ctx.imageSmoothingQuality = 'high';
    // crop the source toward its top-left so the generator's corner watermark falls outside the visible area
    const sw = img.naturalWidth / ZOOM;
    const sh = img.naturalHeight / ZOOM;
    const sx = (img.naturalWidth - sw) * ZOOM_ORIGIN.x;
    const sy = (img.naturalHeight - sh) * ZOOM_ORIGIN.y;
    const scale = Math.max(cw / sw, ch / sh);
    const w = sw * scale;
    const h = sh * scale;
    ctx.drawImage(img, sx, sy, sw, sh, (cw - w) / 2, (ch - h) / 2, w, h);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw(current.current);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          if (cancelled) return resolve();
          frames.current[i] = img;
          if (i <= current.current) draw(current.current);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameSrc(i);
      });

    (async () => {
      // first painted frame = the one the visitor lands on, then fill the rest in sparse-to-dense order
      await load(current.current);
      const order: number[] = [];
      for (let step = 8; step >= 1; step = Math.floor(step / 2)) {
        for (let i = 0; i < FRAME_COUNT; i += step) if (!order.includes(i)) order.push(i);
        if (step === 1) break;
      }
      for (let i = 0; i < order.length && !cancelled; i += 4) {
        await Promise.all(order.slice(i, i + 4).map(load));
      }
    })();

    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, []);

  useMotionValueEvent(progress, 'change', (p) => {
    if (staticEnd) return;
    const index = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(p * (FRAME_COUNT - 1))));
    if (index === current.current) return;
    current.current = index;
    draw(index);
  });

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
};

/**
 * Hero. A pinned, scroll-scrubbed painted sky: the camera pushes through the clouds and settles over the valley
 * as you scroll, while the copy sits centred and fades out so the scene takes over.
 */
const Hero = () => {
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  const copyOpacity = useTransform(progress, [0, 0.28], [1, 0]);
  const copyY = useTransform(progress, [0, 0.28], [0, -48]);

  return (
    <section ref={sectionRef} className={`relative ${reduced ? 'h-svh min-h-[34rem]' : 'h-[340svh]'}`}>
      <div className="sticky top-0 h-svh min-h-[34rem] overflow-hidden bg-[#0f4c8a]">
        <FrameScrub progress={progress} staticEnd={reduced} />

        {/* legibility: soft blue scrim behind the copy, extra dim in dark theme, fade into the page at the bottom */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_46%,rgba(6,28,62,0.42),transparent_75%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden bg-black/35 dark:block" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        {/* ── copy ── */}
        <motion.div
          style={reduced ? undefined : { opacity: copyOpacity, y: copyY }}
          className="absolute inset-0 z-10 flex items-center justify-center text-white [text-shadow:0_2px_24px_rgba(6,28,62,0.45)]"
        >
          <div className="wrap">
            <div className="mx-auto max-w-[36rem] text-center lg:max-w-[52rem] 2xl:max-w-[60rem]">
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
              <p className="mx-auto mt-5 max-w-xl font-[family-name:var(--font-serif)] text-[1.5rem] leading-[1.25] text-white/95 sm:mt-6 xl:text-[1.75rem]">
                <Reveal as="span" immediate delay={0.5} duration={0.7} distance={16} className="block text-balance">
                  From the first query to the final deploy,
                </Reveal>
                <Reveal as="span" immediate delay={0.68} duration={0.7} distance={16} className="block text-balance">
                  I build what lives on your <Marked>screen</Marked> and in your <Marked wiggle>pocket</Marked>.
                </Reveal>
              </p>
            </div>
          </div>
        </motion.div>

        {!reduced && (
          <motion.p
            aria-hidden
            style={{ opacity: copyOpacity }}
            className="absolute inset-x-0 bottom-8 z-10 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-white/80"
          >
            Scroll
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default Hero;
