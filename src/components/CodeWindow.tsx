'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useReady } from '@/components/ready';
import { cn } from '@/lib/utils';

type Kind = 'k' | 'p' | 'a' | 's' | 'c' | 'b';
type Tok = [string, Kind];

/** token colours — one accent, the rest neutral */
const COLOR: Record<Kind, string> = {
  k: 'text-pink', // keyword
  b: 'text-pink', // boolean
  a: 'text-foreground', // property
  s: 'text-foreground/75', // string
  p: 'text-muted-foreground', // punctuation
  c: 'text-muted-foreground/60 italic', // comment
};

const CODE: Tok[][] = [
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
  [['', 'p']],
  [['developer', 'a'], ['.build(', 'p'], ['"something great"', 's'], [');', 'p']],
];

const TERMINAL = [
  { t: '$ npm run build', c: 'text-foreground' },
  { t: '✓ Compiled successfully', c: 'text-pink' },
  { t: '● Ready — open to work', c: 'text-muted-foreground' },
];

const TOTAL = CODE.reduce((n, line) => n + line.reduce((m, [t]) => m + t.length, 0) + 1, 0);
const SPEED = 38; // characters per second

/** Slice the code to the first `n` characters, marking where the caret sits. */
const reveal = (n: number) => {
  let left = n;
  let caretPlaced = false;
  return CODE.map((line) => {
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

/**
 * Editor-style card that types out a `developer` object, then "runs" a build.
 * The content is real (name, role, stack) so it doubles as a tiny bio.
 */
export const CodeWindow = ({ className }: { className?: string }) => {
  const reduce = useReducedMotion();
  const ready = useReady();
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
        else TERMINAL.forEach((_, i) => timers.push(window.setTimeout(() => setTerm(i + 1), 450 + i * 650)));
      };
      raf.current = requestAnimationFrame(tick);
    }, 900);
    return () => {
      window.clearTimeout(begin);
      cancelAnimationFrame(raf.current);
      timers.forEach(window.clearTimeout);
    };
  }, [ready, reduce]);

  const done = n >= TOTAL;
  const shown = reveal(n);

  const caret = <span aria-hidden className="ml-px inline-block h-[1.05em] w-[0.5em] translate-y-[0.18em] animate-blink bg-lime" />;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-line/15 bg-card/80 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.65)] backdrop-blur-md',
        className
      )}
      role="img"
      aria-label="A code editor typing out a developer profile: B Venkata Sai Kartikeya, Full-Stack Developer, React, Node.js, MongoDB, Python, ML and IoT, open to work."
    >
      {/* window chrome */}
      <div className="flex items-center gap-3 border-b border-line/10 bg-secondary/60 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-line/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-line/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-lime" />
        </div>
        <div className="flex items-center gap-1 font-mono text-[11px]">
          <span className="rounded-md bg-background/60 px-2.5 py-1 text-foreground">developer.ts</span>
          <span className="hidden px-2.5 py-1 text-muted-foreground/60 sm:inline">README.md</span>
        </div>
      </div>

      {/* code */}
      <div aria-hidden className="flex min-h-[15.5rem] gap-4 px-4 py-4 font-mono text-[12px] leading-[1.75] sm:min-h-[17.5rem] sm:text-[13px] md:text-sm">
        <div className="select-none text-right text-muted-foreground/40">
          {CODE.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="min-w-0 flex-1 whitespace-pre">
          {shown.map((toks, li) => (
            <div key={li}>
              {toks.length ? (
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
      </div>

      {/* terminal */}
      <div aria-hidden className="border-t border-line/10 bg-background/40 px-4 py-3 font-mono text-[11.5px] leading-relaxed sm:text-xs">
        {TERMINAL.slice(0, term).map((l) => (
          <div key={l.t} className={l.c}>
            {l.t}
          </div>
        ))}
        {term < TERMINAL.length && (
          <div className="text-muted-foreground/50">
            {done ? '$' : ' '}
            {done && caret}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeWindow;
