'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import { Counter, Reveal } from '@/components/fx';
import type { CaseShot, CaseStudy as CaseStudyData } from '@/lib/data';

/* ───────── frames ───────── */

const BrowserFrame = ({ children, url, className = '' }: { children: React.ReactNode; url?: string; className?: string }) => (
  <div className={`overflow-hidden rounded-2xl border border-line/15 bg-card shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] ${className}`}>
    <div className="flex items-center gap-3 border-b border-line/10 px-4 py-2.5">
      <span className="flex gap-1.5" aria-hidden>
        <i className="h-2.5 w-2.5 rounded-full bg-line/25" />
        <i className="h-2.5 w-2.5 rounded-full bg-line/25" />
        <i className="h-2.5 w-2.5 rounded-full bg-line/25" />
      </span>
      {url && <span className="mx-auto max-w-[70%] truncate rounded-full bg-line/[0.06] px-4 py-1 font-mono text-[10px] tracking-wide text-muted-foreground">{url}</span>}
    </div>
    {children}
  </div>
);

const Shot = ({ shot, className = '' }: { shot: CaseShot; className?: string }) => (
   
  <img src={shot.src} alt={shot.alt} width={2160} height={1350} loading="lazy" decoding="async" className={`block h-auto w-full ${className}`} />
);

const PhoneFrame = ({ shot }: { shot: CaseShot }) => (
  <div className="rounded-[2.2rem] border border-line/20 bg-card p-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]">
    <div className="relative overflow-hidden rounded-[1.7rem]">
      { }
      <img src={shot.src} alt={shot.alt} width={585} height={1266} loading="lazy" decoding="async" className="block h-auto w-full" />
    </div>
  </div>
);

/** A tall page capture inside a frame; background-position glides top → bottom on hover. */
const ScrollShot = ({ shot }: { shot: CaseShot }) => (
  <div className="group relative aspect-[16/10] overflow-hidden" role="img" aria-label={shot.alt} data-cursor="Scroll">
    <div
      className="absolute inset-0 bg-[length:100%_auto] bg-top bg-no-repeat transition-[background-position] duration-[16000ms] ease-linear group-hover:bg-bottom group-focus-within:bg-bottom"
      style={{ backgroundImage: `url(${shot.src})` }}
    />
    <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground backdrop-blur transition-opacity group-hover:opacity-0">
      Hover to scroll
    </span>
  </div>
);

const SectionLabel = ({ n, children }: { n: string; children: React.ReactNode }) => (
  <Reveal>
    <p className="eyebrow">
      <span className="text-primary">{n}</span> {children}
    </p>
  </Reveal>
);

/* ───────── sections ───────── */

const Problem = ({ cs }: { cs: CaseStudyData }) => (
  <section className="wrap pb-24 md:pb-36">
    <div className="grid gap-10 lg:grid-cols-[1fr_3fr]">
      <SectionLabel n="01">The problem</SectionLabel>
      <div>
        <Reveal>
          <h2 className="display text-balance max-w-4xl text-[clamp(1.9rem,4vw,3.8rem)] leading-[1.06] tracking-[-0.035em]">{cs.problem.heading}</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {cs.problem.body.map((b, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="text-lg leading-relaxed text-muted-foreground">{b}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line/15 bg-line/15 md:grid-cols-4">
      {cs.stats.map((s, i) => {
        const m = s.value.match(/^(\d+)(.*)$/);
        return (
          <Reveal key={s.label} delay={i * 0.06} className="bg-background p-6 md:p-8">
            <p className="display text-[clamp(2.6rem,5vw,4.6rem)] leading-none text-primary">
              {m ? <Counter value={Number(m[1])} suffix={m[2]} /> : s.value}
            </p>
            <p className="mt-4 text-sm leading-snug text-muted-foreground">{s.label}</p>
          </Reveal>
        );
      })}
    </div>
  </section>
);

const Roles = ({ cs }: { cs: CaseStudyData }) => {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const role = cs.roles[active];

  return (
    <section className="border-y border-line/15 bg-card/40">
      <div className="wrap py-20 md:py-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr]">
          <SectionLabel n="02">One platform, three experiences</SectionLabel>
          <Reveal>
            <h2 className="display text-balance max-w-3xl text-[clamp(1.9rem,4vw,3.8rem)] leading-[1.06] tracking-[-0.035em]">
              Same brand. <span className="serif text-gradient">Three very different jobs.</span>
            </h2>
          </Reveal>
        </div>

        <Reveal className="mt-12" delay={0.05}>
          <div role="tablist" aria-label="User roles" className="isolate inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line/15 bg-background p-1">
            {cs.roles.map((r, i) => (
              <button
                key={r.id}
                role="tab"
                id={`role-tab-${r.id}`}
                aria-selected={i === active}
                aria-controls="role-panel"
                onClick={() => setActive(i)}
                data-cursor="View"
                className={`relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${i === active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {i === active && <motion.span layoutId="role-pill" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                {r.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div id="role-panel" role="tabpanel" aria-labelledby={`role-tab-${role.id}`} className="mt-10 grid items-start gap-10 lg:grid-cols-[2fr_3fr] lg:gap-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={role.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="lg:order-1"
            >
              <p className="serif text-3xl leading-tight text-primary md:text-4xl">{role.tagline}</p>
              <ul className="mt-8 space-y-4">
                {role.points.map((p) => (
                  <li key={p} className="flex gap-3 text-base leading-relaxed md:text-lg">
                    <Check size={18} className="mt-1.5 shrink-0 text-primary" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          <div className="lg:order-2">
            <AnimatePresence mode="wait">
              <motion.figure
                key={role.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <BrowserFrame url={`velvetplate.app/${role.id === 'diner' ? 'menu' : role.id === 'manager' ? 'manager/orders' : 'admin'}`}>
                  <Shot shot={role.shot} />
                </BrowserFrame>
                <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{role.shot.caption}</figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const Lifecycle = ({ cs }: { cs: CaseStudyData }) => (
  <section className="wrap section">
    <div className="grid gap-10 lg:grid-cols-[1fr_3fr]">
      <SectionLabel n="03">The order lifecycle</SectionLabel>
      <div>
        <Reveal>
          <h2 className="display text-balance max-w-3xl text-[clamp(1.9rem,4vw,3.8rem)] leading-[1.06] tracking-[-0.035em]">
            Four states. <span className="serif text-gradient">One tap each.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            The kitchen board only ever offers the next sensible action, so a busy line cook never has to think about what a button does.
          </p>
        </Reveal>

        <ol className="mt-14 grid gap-4 md:grid-cols-4">
          {cs.lifecycle.map((l, i) => (
            <Reveal key={l.step} as="li" delay={i * 0.09} className="relative rounded-2xl border border-line/15 p-6">
              <span className="font-mono text-xs tracking-widest text-primary">0{i + 1}</span>
              <p className="display mt-6 text-2xl leading-none">{l.step}</p>
              <p className="mt-3 text-sm leading-snug text-muted-foreground">{l.note}</p>
              {i < cs.lifecycle.length - 1 && (
                <ArrowUpRight aria-hidden size={18} className="absolute -right-3.5 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-background p-0.5 text-primary md:block" />
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

const Decisions = ({ cs }: { cs: CaseStudyData }) => (
  <section className="wrap pb-24 md:pb-36">
    <div className="grid gap-10 lg:grid-cols-[1fr_3fr]">
      <SectionLabel n="04">Design decisions</SectionLabel>
      <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
        {cs.decisions.map((d, i) => (
          <Reveal key={d.title} delay={(i % 2) * 0.08} className="border-t border-line/15 pt-6">
            <h3 className="display text-2xl leading-tight tracking-[-0.03em] md:text-3xl">{d.title}</h3>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{d.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Gallery = ({ cs }: { cs: CaseStudyData }) => (
  <section className="border-t border-line/15 bg-card/40">
    <div className="wrap py-20 md:py-32">
      <div className="grid gap-10 lg:grid-cols-[1fr_3fr]">
        <SectionLabel n="05">The interface</SectionLabel>
        <Reveal>
          <h2 className="display text-balance max-w-3xl text-[clamp(1.9rem,4vw,3.8rem)] leading-[1.06] tracking-[-0.035em]">
            Every screen, <span className="serif text-gradient">on purpose.</span>
          </h2>
        </Reveal>
      </div>

      <Reveal className="mt-14">
        <BrowserFrame url="velvet-plate.vercel.app">
          <ScrollShot shot={cs.scrollShot} />
        </BrowserFrame>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{cs.scrollShot.caption}</p>
      </Reveal>

      <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2">
        {cs.gallery.map((g, i) => (
          <Reveal key={g.src} delay={(i % 2) * 0.08} className={i === 0 ? 'md:col-span-2' : ''}>
            <a href={g.src} target="_blank" rel="noopener noreferrer" data-cursor="Zoom" className="group block">
              <BrowserFrame className="transition-transform duration-700 group-hover:-translate-y-1.5">
                <Shot shot={g} />
              </BrowserFrame>
            </a>
            <p className="mt-4 flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="text-primary">{String(i + 1).padStart(2, '0')}</span>
              {g.caption}
            </p>
          </Reveal>
        ))}
      </div>

      <div className="mt-24">
        <Reveal>
          <p className="eyebrow mb-10">Pocket-sized</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-8">
          {cs.mobile.map((m, i) => (
            <Reveal key={m.src} delay={i * 0.08} className={i % 2 ? 'md:mt-12' : ''}>
              <PhoneFrame shot={m} />
              <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{m.caption}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const UnderTheHood = ({ cs }: { cs: CaseStudyData }) => (
  <section className="wrap section">
    <div className="grid gap-10 lg:grid-cols-[1fr_3fr]">
      <SectionLabel n="06">Under the hood</SectionLabel>
      <div>
        <ul className="grid gap-px overflow-hidden rounded-3xl border border-line/15 bg-line/15 sm:grid-cols-2 lg:grid-cols-3">
          {cs.stack.map((s, i) => (
            <Reveal key={s.name} as="li" delay={i * 0.05} className="bg-background p-6 md:p-8">
              <p className="display text-xl leading-tight tracking-[-0.02em]">{s.name}</p>
              <p className="mt-3 text-sm leading-snug text-muted-foreground">{s.use}</p>
            </Reveal>
          ))}
        </ul>

        <div className="mt-20 grid gap-10 md:grid-cols-[1fr_2fr]">
          <Reveal>
            <p className="eyebrow">What’s next</p>
          </Reveal>
          <ul className="border-b border-line/15">
            {cs.next.map((n, i) => (
              <Reveal key={n} as="li" delay={i * 0.05} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line/15 py-5">
                <span className="font-mono text-xs tracking-widest text-primary">0{i + 1}</span>
                <span className="text-lg leading-snug">{n}</span>
              </Reveal>
            ))}
          </ul>
        </div>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{cs.note}</p>
      </div>
    </div>
  </section>
);

export const CaseStudy = ({ cs }: { cs: CaseStudyData }) => (
  <>
    <Problem cs={cs} />
    <Roles cs={cs} />
    <Lifecycle cs={cs} />
    <Decisions cs={cs} />
    <Gallery cs={cs} />
    <UnderTheHood cs={cs} />
  </>
);

export { BrowserFrame };
export default CaseStudy;
