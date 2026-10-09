'use client';

import { ReactNode } from 'react';
import { Reveal, TextReveal } from '@/components/fx';

interface PageHeaderProps {
  /** e.g. "01" — rendered as a section index */
  index?: string;
  eyebrow: string;
  /** one entry per masked headline line */
  lines: ReactNode[];
  subtitle?: string;
  /** small right-aligned meta (count, status…) */
  meta?: ReactNode;
}

/** Oversized editorial opener shared by the inner pages. */
const PageHeader = ({ index, eyebrow, lines, subtitle, meta }: PageHeaderProps) => (
  <header className="wrap pb-14 pt-36 md:pb-20 md:pt-48">
    <Reveal direction="none" immediate className="mb-8 flex items-center justify-between">
      <p className="eyebrow">{eyebrow}</p>
      {index && <span className="font-mono text-xs tracking-widest text-muted-foreground">({index})</span>}
    </Reveal>

    <TextReveal as="h1" immediate delay={0.1} className="display text-[clamp(3.3rem,12.2vw,12.5rem)]" lines={lines} />

    {(subtitle || meta) && (
      <Reveal immediate delay={0.45} className="mt-12 grid gap-8 border-t border-line/15 pt-8 md:grid-cols-[1fr_auto] md:items-end">
        {subtitle && <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">{subtitle}</p>}
        {meta && <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{meta}</div>}
      </Reveal>
    )}
  </header>
);

export default PageHeader;
