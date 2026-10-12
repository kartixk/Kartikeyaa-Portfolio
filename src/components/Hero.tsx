'use client';

import { useEffect, useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { TextReveal } from '@/components/fx';

const FRAME_COUNT = 96;
/** Extra zoom into the footage (1 = none). The watermark crop is already baked into the exported frames. */
const ZOOM = 1;
const ZOOM_ORIGIN = { x: 0.2, y: 0.2 };
const frameSrc = (i: number) => `/hero-frames/f${String(i + 1).padStart(3, '0')}.webp`;

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

/* ───────────── the statement: assembles word by word as the valley opens up ───────────── */

type Token = { word: string; mark?: boolean };
const STATEMENT: Token[][] = [
  [{ word: 'From' }, { word: 'the' }, { word: 'first' }, { word: 'query' }, { word: 'to' }, { word: 'the' }, { word: 'final' }, { word: 'deploy,' }],
  [
    { word: 'I' }, { word: 'build' }, { word: 'what' }, { word: 'lives' }, { word: 'on' }, { word: 'your' },
    { word: 'screen', mark: true }, { word: 'and' }, { word: 'in' }, { word: 'your' }, { word: 'pocket.', mark: true },
  ],
];

const WORDS_START = 0.34; // scroll progress where the first word begins to land
const WORD_STEP = 0.016; // stagger between words
const WORD_SPAN = 0.1; // how long a single word takes to resolve

/** One word: rises, un-blurs and fades in against the scroll. Marked words are italic serif with a hand-drawn underline that draws itself. */
const Word = ({ token, index, progress }: { token: Token; index: number; progress: MotionValue<number> }) => {
  const start = WORDS_START + index * WORD_STEP;
  const end = start + WORD_SPAN;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [22, 0]);
  const blur = useTransform(progress, [start, end], [10, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const draw = useTransform(progress, [end, end + 0.12], [0, 1]);

  return (
    <motion.span style={{ opacity, y, filter }} className={`relative inline-block ${token.mark ? 'serif' : ''}`}>
      {token.word}
      {token.mark && (
        <svg aria-hidden viewBox="0 0 100 8" preserveAspectRatio="none" className="absolute -bottom-[0.12em] left-0 h-[0.28em] w-full overflow-visible">
          <motion.path
            d="M1 5 C 18 1, 34 7, 52 3.5 S 86 2, 99 5"
            fill="none"
            stroke="hsl(187 92% 62%)"
            strokeWidth="2.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: draw }}
          />
        </svg>
      )}
    </motion.span>
  );
};

const Statement = ({ progress }: { progress: MotionValue<number> }) => {
  let index = 0;
  return (
    <p className="font-[family-name:var(--font-serif)] text-[clamp(1.55rem,min(3.6vw,7svh),3.6rem)] leading-[1.18] tracking-[-0.01em] text-balance">
      {STATEMENT.map((line, li) => (
        <span key={li} className="block">
          {line.map((token, ti) => (
            <span key={ti}>
              <Word token={token} index={index++} progress={progress} />
              {ti < line.length - 1 ? ' ' : ''}
            </span>
          ))}
        </span>
      ))}
    </p>
  );
};

/**
 * Hero. A pinned, scroll-scrubbed painted sky: the camera pushes through the clouds and settles over the valley
 * as you scroll. Act one is the name (fades as you start scrolling), act two is the statement, which assembles
 * word by word once the valley opens up.
 */
const Hero = () => {
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  const copyOpacity = useTransform(progress, [0, 0.28], [1, 0]);
  const copyY = useTransform(progress, [0, 0.28], [0, -72]);
  const statementScrim = useTransform(progress, [0.3, 0.5], [0, 1]);
  const staticProgress = useMotionValue(1); // reduced motion: statement fully formed

  return (
    <section ref={sectionRef} className={`relative ${reduced ? 'h-svh min-h-[34rem]' : 'h-[340svh]'}`}>
      <div className="sticky top-0 h-svh min-h-[34rem] overflow-hidden bg-[#0f4c8a]">
        <FrameScrub progress={progress} staticEnd={reduced} />

        {/* legibility: soft blue scrim behind the copy, extra dim in dark theme, fade into the page at the bottom */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_34%_at_50%_41%,rgba(6,28,62,0.36),transparent_78%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden bg-black/35 dark:block" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* ── copy ── optically centred a little above the middle, where the sky gap sits calmest.
            The shadow is a filter on the wrapper: a text-shadow would be clipped by the line-reveal masks (visible as a box). */}
        <motion.div
          style={reduced ? undefined : { opacity: copyOpacity, y: copyY }}
          className="absolute inset-0 z-10 flex items-center justify-center pb-[18svh] pt-20 text-white [filter:drop-shadow(0_2px_20px_rgba(6,28,62,0.5))]"
        >
          <div className="wrap">
            <div className="mx-auto max-w-[72rem] text-balance text-center">
              <TextReveal
                as="h1"
                immediate
                delay={0.15}
                className="display text-[clamp(2.25rem,min(6.4vw,13svh),7rem)]"
                lines={[
                  <span key="a">
                    Hi, I&apos;m <span className="serif">Kartikeya</span>
                  </span>,
                  <span key="b">a Full-Stack Developer.</span>,
                ]}
              />
            </div>
          </div>
        </motion.div>

        {/* ── act two: the statement ── */}
        {reduced ? (
          <div className="absolute inset-x-0 bottom-[16svh] z-10 px-6 text-center text-white [filter:drop-shadow(0_2px_20px_rgba(6,28,62,0.5))]">
            <Statement progress={staticProgress} />
          </div>
        ) : (
          <>
            <motion.div
              aria-hidden
              style={{ opacity: statementScrim }}
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_36%_at_50%_40%,rgba(6,28,62,0.42),transparent_78%)]"
            />
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 pb-[16svh] pt-20 text-center text-white [filter:drop-shadow(0_2px_22px_rgba(6,28,62,0.55))]">
              <div className="mx-auto max-w-[62rem]">
                <Statement progress={progress} />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;
