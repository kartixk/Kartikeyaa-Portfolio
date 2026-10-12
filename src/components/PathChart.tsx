'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { area, curveBasis, line, randomLcg, randomNormal } from 'd3';
import { Reveal } from '@/components/fx';
import { timeline } from '@/lib/data';

/**
 * "How I got here" as a climb. A painted hillside (D3 areas and curves, seeded so it never changes between renders)
 * with the trail rising left to right. Scroll and a little portrait walks up the trail; every milestone is a flag
 * that is raised when he passes it, and the card underneath tells that part of the story. Click a flag to jump to it.
 */

const W = 1000;
const H = 440;

type Kind = 'school' | 'training' | 'intern' | 'role';
const KINDS: Record<Kind, { label: string; color: string }> = {
  school: { label: 'Education', color: 'hsl(205 78% 52%)' },
  training: { label: 'Training', color: 'hsl(152 50% 38%)' },
  intern: { label: 'Internship', color: 'hsl(18 90% 58%)' },
  role: { label: 'Role', color: 'hsl(268 56% 58%)' },
};

/** `at` indexes into data.ts `timeline` (newest first) for the description. Listed oldest → newest. */
const STOPS: { at: number; when: string; title: string; kind: Kind }[] = [
  { at: 5, when: '2020', title: 'Senior Secondary', kind: 'school' },
  { at: 4, when: '2022', title: 'B.Tech · IoT', kind: 'school' },
  { at: 3, when: '2024', title: 'MERN training', kind: 'training' },
  { at: 2, when: 'Apr 2025', title: 'AI-ML internship', kind: 'training' },
  { at: 1, when: 'May 2025', title: 'NTPC & Zenith-Zap', kind: 'intern' },
  { at: 0, when: 'Dec 2025', title: 'Software Developer', kind: 'role' },
];

const N = STOPS.length;
/** One expression per stop, oldest → newest (public/avatar/memoji-1…6.webp). All six render and only the active one is visible, so swaps never flash. */
const FACES = STOPS.map((_, i) => `/avatar/memoji-${i + 1}.webp`);
/** Stops sit well inside the drawing so the first and last labels (about 200 wide, centred) never touch the edge. */
const X0 = 130;
const X1 = 870;
/** The painting continues this far past each side, so a wide container just shows more hillside instead of cropping. */
const PAD = 800;

/** The trail: a gentle S-curve climbing to the right. y as a function of x. */
const trailY = (x: number) => {
  const t = (x - X0) / (X1 - X0);
  const c = Math.min(1, Math.max(0, t));
  const ease = c * c * (3 - 2 * c) * 0.35 + c * 0.65;
  return 352 - ease * 205 + Math.sin(c * Math.PI * 3) * 7;
};

/** Seeded ridge: reproducible, so server and client markup agree. */
const ridge = (seed: number, base: number, amp: number, rise: number, step = 28) => {
  const rand = randomNormal.source(randomLcg(seed))(0, 1);
  const pts: [number, number][] = [];
  let drift = 0;
  for (let x = -PAD; x <= W + PAD; x += step) {
    drift = drift * 0.6 + rand() * amp;
    pts.push([x, base - (x / W) * rise + drift]);
  }
  return pts;
};

const fillArea = (pts: [number, number][]) =>
  area<[number, number]>().x((d) => d[0]).y0(H).y1((d) => d[1]).curve(curveBasis)(pts) ?? '';

const SCENE = (() => {
  const back = fillArea(ridge(7, 250, 16, 70));
  const mid = fillArea(ridge(21, 292, 14, 55));
  const xs: number[] = [];
  for (let x = X0 - 40; x <= X1 + 70; x += 6) xs.push(x);
  const trailPts = xs.map((x) => [x, trailY(x)] as [number, number]);
  const trail = line<[number, number]>().x((d) => d[0]).y((d) => d[1])(trailPts) ?? '';
  const front = area<[number, number]>().x((d) => d[0]).y0(H).y1((d) => d[1] + 16).curve(curveBasis)(
    [[-PAD, trailY(X0) + 6], ...trailPts.map(([x, y]) => [x, y] as [number, number]), [W + PAD, trailY(X1) - 12]],
  ) ?? '';
  const stops = STOPS.map((_, i) => {
    const x = X0 + ((X1 - X0) * i) / (N - 1);
    return { x, y: trailY(x) };
  });
  return { back, mid, trail, front, stops };
})();

const pointAt = (p: number) => {
  const x = X0 + (X1 - X0) * Math.min(1, Math.max(0, p));
  return { x, y: trailY(x) };
};

const Flag = ({ i, reached, active }: { i: number; reached: boolean; active: boolean }) => {
  const s = STOPS[i];
  const p = SCENE.stops[i];
  const color = KINDS[s.kind].color;
  return (
    <g transform={`translate(${p.x},${p.y})`}>
      <line y2={-58} stroke="rgba(20,30,20,0.7)" strokeWidth={2} strokeLinecap="round" />
      <motion.path
        d="M1,-58 L30,-50 L1,-42 Z"
        fill={reached ? color : 'rgba(255,255,255,0.7)'}
        stroke={reached ? 'none' : 'rgba(20,30,20,0.35)'}
        animate={{ y: reached ? 0 : 8, scaleX: reached ? 1 : 0.7 }}
        style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      />
      <circle r={5} fill="rgba(20,30,20,0.85)" />
      {active && <circle r={13} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={2} className="animate-ping motion-reduce:animate-none" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />}
      <g className="max-sm:hidden" opacity={reached ? 1 : 0.6}>
        <text y={-86} textAnchor="middle" className="fill-[#0f1a12] font-display text-[19px] font-semibold">
          {s.title}
        </text>
        <text y={-68} textAnchor="middle" className="fill-[#0f1a12] font-mono text-[12px] uppercase tracking-wider opacity-70">
          {s.when}
        </text>
      </g>
    </g>
  );
};

const PathChart = () => {
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const figRef = useRef<SVGGElement>(null);
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  const pop = useAnimationControls();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  const place = (p: number) => {
    const { x, y } = pointAt(p);
    figRef.current?.setAttribute('transform', `translate(${x.toFixed(1)},${(y - 4).toFixed(1)})`);
    const next = Math.round(Math.min(1, Math.max(0, p)) * (N - 1));
    if (next !== idxRef.current) {
      idxRef.current = next;
      setIdx(next);
      if (!reduced) void pop.start({ scale: [0.72, 1.12, 1], transition: { duration: 0.45, ease: 'easeOut' } });
    }
  };

  // scrolling drives him (the first ~12% and last ~12% are held at the ends so the first and last flags feel earned)
  useMotionValueEvent(progress, 'change', (v) => {
    if (reduced) return;
    place(Math.min(1, Math.max(0, (v - 0.1) / 0.78)));
  });

  useEffect(() => {
    place(reduced ? 1 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- place only reads refs and stable controls; run on mode change only
  }, [reduced]);

  const jump = (i: number) => {
    if (reduced) {
      place(i / (N - 1));
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const target = el.offsetTop + total * (0.1 + 0.78 * (i / (N - 1)));
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  const story = timeline[STOPS[idx].at];
  const legend = useMemo(() => Object.entries(KINDS) as [Kind, { label: string; color: string }][], []);

  return (
    <section ref={sectionRef} className={`relative ${reduced ? 'pb-20 md:pb-32' : 'h-[260svh]'}`} aria-label="How I got here">
      <div className={reduced ? '' : 'sticky top-0 flex min-h-svh flex-col justify-center pb-6 pt-24 md:pt-28'}>
        <div className="wrap w-full">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4 md:mb-7">
            <div>
              <Reveal>
                <p className="eyebrow mb-3">The path</p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="display text-[clamp(2rem,4.6vw,4rem)] leading-none">
                  How I got <span className="serif text-primary">here</span>
                </h2>
              </Reveal>
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Milestone types">
              {legend.map(([k, v]) => (
                <li key={k} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: v.color }} />
                  {v.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-line/15 bg-[hsl(208_72%_70%)] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.5)]">
            <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto max-h-[calc(100svh-24rem)] min-h-[15rem] w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="A hillside trail climbing left to right, with a flag at each milestone of my path.">
              <defs>
                <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(208 72% 70%)" />
                  <stop offset="62%" stopColor="hsl(24 92% 86%)" />
                  <stop offset="100%" stopColor="hsl(30 90% 90%)" />
                </linearGradient>
                <linearGradient id="hill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142 40% 46%)" />
                  <stop offset="100%" stopColor="hsl(150 38% 30%)" />
                </linearGradient>
              </defs>

              <rect x={-PAD} width={W + PAD * 2} height={H} fill="url(#sky)" />

              {/* sun */}
              <circle cx={120} cy={74} r={62} fill="hsl(34 100% 88%)" opacity={0.55} />
              <circle cx={120} cy={74} r={32} fill="hsl(34 100% 86%)" />

              {/* clouds drift */}
              {!reduced && (
                <>
                  <motion.g animate={{ x: [0, 46, 0] }} transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }} fill="white" opacity={0.85}>
                    <ellipse cx={420} cy={60} rx={58} ry={15} />
                    <ellipse cx={455} cy={48} rx={36} ry={16} />
                  </motion.g>
                  <motion.g animate={{ x: [0, -38, 0] }} transition={{ duration: 42, repeat: Infinity, ease: 'easeInOut' }} fill="white" opacity={0.7}>
                    <ellipse cx={760} cy={40} rx={52} ry={13} />
                    <ellipse cx={790} cy={30} rx={30} ry={13} />
                  </motion.g>
                </>
              )}

              <path d={SCENE.back} fill="hsl(262 36% 76%)" />
              <path d={SCENE.mid} fill="hsl(200 34% 60%)" />
              <path d={SCENE.front} fill="url(#hill)" />
              <path d={SCENE.trail} fill="none" stroke="hsl(40 60% 88%)" strokeWidth={4} strokeDasharray="1 11" strokeLinecap="round" />

              {STOPS.map((_, i) => (
                <g key={i} className="cursor-pointer" role="button" tabIndex={0} aria-label={`${STOPS[i].when}: ${STOPS[i].title}`} onClick={() => jump(i)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && jump(i)}>
                  <Flag i={i} reached={i <= idx} active={i === idx} />
                  <rect x={SCENE.stops[i].x - 34} y={SCENE.stops[i].y - 110} width={68} height={124} fill="transparent" />
                </g>
              ))}

              {/* the walker */}
              <g ref={figRef} pointerEvents="none">
                <ellipse cx={0} cy={2} rx={15} ry={3.5} fill="rgba(0,0,0,0.25)" />
                {/* a small step-bounce while he walks, and a pop when the expression changes */}
                <motion.g animate={reduced ? undefined : { y: [0, -3, 0] }} transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}>
                  <motion.g animate={pop} style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}>
                    {FACES.map((src, f) => (
                      <image key={src} href={src} x={-20} y={-62} width={40} height={60} opacity={f === idx ? 1 : 0} />
                    ))}
                  </motion.g>
                </motion.g>
              </g>
            </svg>
          </div>

          <div className="mt-5 min-h-[7.5rem] md:mt-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-x-10 gap-y-2 md:grid-cols-[14rem_1fr] md:items-baseline"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {String(idx + 1).padStart(2, '0')} / {String(N).padStart(2, '0')} · {story.year}
                </p>
                <div>
                  <h3 className="display text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.1]">{story.title}</h3>
                  <p className="mt-2 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">{story.description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PathChart;
