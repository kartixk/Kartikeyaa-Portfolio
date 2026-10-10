'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useReady } from '@/components/ready';
import { cn } from '@/lib/utils';

type Kind = 'k' | 'p' | 'a' | 's' | 'c' | 'b' | 'h';
type Tok = [string, Kind];

/** token colours — one accent, the rest neutral */
const COLOR: Record<Kind, string> = {
  k: 'text-pink', // keyword
  b: 'text-pink', // boolean
  h: 'font-semibold text-pink', // markdown heading
  a: 'text-foreground', // property
  s: 'text-foreground/75', // string
  p: 'text-muted-foreground', // punctuation
  c: 'text-muted-foreground/60 italic', // comment
};

const DEV: Tok[][] = [
  [['// who is behind this site', 'c']],
  [['const ', 'k'], ['developer', 'a'], [' = {', 'p']],
  [['  name', 'a'], [': ', 'p'], ['"B Venkata Sai Kartikeya"', 's'], [',', 'p']],
  [['  role', 'a'], [': ', 'p'], ['"Full-Stack Developer"', 's'], [',', 'p']],
  [['  stack', 'a'], [': [', 'p']],
  [['    "React"', 's'], [', ', 'p'], ['"Node.js"', 's'], [',', 'p']],
  [['    "MongoDB"', 's'], [', ', 'p'], ['"Python"', 's'], [',', 'p']],
  [['  ],', 'p']],
  [['  focus', 'a'], [': [', 'p'], ['"ML"', 's'], [', ', 'p'], ['"IoT"', 's'], ['],', 'p']],
  [['  openToWork', 'a'], [': ', 'p'], ['true', 'b'], [',', 'p']],
  [['};', 'p']],
  [],
  [['developer', 'a'], ['.build(', 'p'], ['"something great"', 's'], [');', 'p']],
];

const NOW: Tok[][] = [
  [['# Now', 'h']],
  [],
  [['- ', 'p'], ['Developer Intern', 'a'], [' @ Spotmies LLP', 's']],
  [['- ', 'p'], ['Exploring', 'a'], [' ML, NLP and IoT', 's']],
  [['- ', 'p'], ['Open to', 'a'], [' roles, internships, freelance', 's']],
  [],
  [['> Replies within 24 hours.', 'c']],
];

const TABS = [
  { id: 'dev', name: 'developer.ts', code: DEV },
  { id: 'now', name: 'now.md', code: NOW },
] as const;

const TERMINAL = [
  { t: '$ npm run build', c: 'text-foreground' },
  { t: '✓ Compiled successfully', c: 'text-pink' },
  { t: '● Ready — open to work', c: 'text-muted-foreground' },
];

const lineLen = (line: Tok[]) => line.reduce((m, [t]) => m + t.length, 0) + 1; // + newline
const TOTAL = DEV.reduce((n, l) => n + lineLen(l), 0);
const SPEED = 95; // characters per second

/** Slice the code to the first `n` characters, marking where the caret sits. */
const reveal = (code: Tok[][], n: number) => {
  let left = n;
  let caretPlaced = false;
  return code.map((line) => {
    const toks: { text: string; kind: Kind; caret: boolean }[] = [];
    for (const [text, kind] of line) {
      if (left <= 0) break;
      const slice = text.slice(0, left);
      left -= text.length;
      const caret = left <= 0 && !caretPlaced && n < TOTAL;
      if (caret) caretPlaced = true;
      toks.push({ text: slice, kind, caret });
    }
    left -= 1; // newline
    return toks;
  });
};

const SUMMARY =
  'A code editor that types out a developer profile: B Venkata Sai Kartikeya, Full-Stack Developer working with React, Node.js, MongoDB and Python, focused on ML and IoT, open to work.';

/** Editor-style card: types out a `developer` object, then "runs" a build. A second tab holds a short "now" note. */
export const CodeWindow = ({ className }: { className?: string }) => {
  const reduce = useReducedMotion();
  const ready = useReady();
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('dev');
  const [n, setN] = useState(reduce ? TOTAL : 0);
  const [term, setTerm] = useState(reduce ? TERMINAL.length : 0);
  const raf = useRef(0);

  useEffect(() => {
    if (reduce || !ready) return;
    let start = 0;
    const timers: number[] = [];
    const begin = window.setTimeout(() => {
      const tick = (now: number) => {
        if (!start) start = now;
        const shown = Math.min(TOTAL, Math.floor(((now - start) / 1000) * SPEED));
        setN(shown);
        if (shown < TOTAL) raf.current = requestAnimationFrame(tick);
        else TERMINAL.forEach((_, i) => timers.push(window.setTimeout(() => setTerm(i + 1), 350 + i * 450)));
      };
      raf.current = requestAnimationFrame(tick);
    }, 700);
    return () => {
      window.clearTimeout(begin);
      cancelAnimationFrame(raf.current);
      timers.forEach(window.clearTimeout);
    };
  }, [ready, reduce]);

  const typing = n < TOTAL;
  const active = TABS.find((t) => t.id === tab)!;
  const lines = tab === 'dev' ? reveal(DEV, n) : reveal(NOW, Infinity);
  const caret = <span aria-hidden className="ml-px inline-block h-[1.05em] w-[0.5em] translate-y-[0.18em] animate-blink bg-lime" />;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-line/15 bg-card/90 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.65)] backdrop-blur-md',
        className
      )}
    >
      <p className="sr-only">{SUMMARY}</p>

      {/* window chrome + tabs */}
      <div className="flex items-center gap-3 border-b border-line/10 bg-secondary/60 px-4 py-2">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-line/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-line/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-lime" />
        </div>
        <div role="tablist" aria-label="Editor files" className="flex items-center gap-1 font-mono text-[11px]">
          {TABS.map((t) => {
            const on = t.id === tab;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t.id)}
                className={cn(
                  'relative rounded-md px-2.5 py-1.5 transition-colors',
                  on ? 'bg-background/70 text-foreground' : 'text-muted-foreground/70 hover:text-foreground'
                )}
              >
                {t.name}
                {on && <motion.span layoutId="tab-underline" className="absolute inset-x-2 -bottom-px h-px bg-lime" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* code (fixed height so switching tabs never shifts the layout) */}
      <div aria-hidden className="code-area overflow-hidden px-4 py-4 font-mono">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex gap-4"
          >
            <div className="select-none text-right text-muted-foreground/40">
              {active.code.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <div className="min-w-0 flex-1 whitespace-pre">
              {lines.map((toks, li) => (
                <div key={li}>
                  {toks.length && toks.some((t) => t.text) ? (
                    toks.map((t, ti) => (
                      <span key={ti} className={COLOR[t.kind]}>
                        {t.text}
                        {t.caret && caret}
                      </span>
                    ))
                  ) : (
                    ' '
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* terminal */}
      <div aria-hidden className="h-[4.75rem] border-t border-line/10 bg-background/40 px-4 py-2.5 font-mono text-[11.5px] leading-[1.6] sm:text-xs">
        {TERMINAL.slice(0, term).map((l) => (
          <div key={l.t} className={l.c}>
            {l.t}
          </div>
        ))}
        {term < TERMINAL.length && (
          <div className="text-muted-foreground/50">
            {term === 0 && !typing ? '$' : ' '}
            {term === 0 && !typing && caret}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeWindow;
