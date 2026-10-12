'use client';

import { ArrowUpRight } from 'lucide-react';
import TransitionLink from '@/components/TransitionLink';
import { ProjectCover, ScrollStack, ScrollStackItem } from '@/components/fx';
import type { Project } from '@/lib/data';

/**
 * Every project as a card that pins and stacks under the next one while you scroll the page.
 * Cards alternate image side so the stack has rhythm; the whole card opens the case study.
 */
const ProjectStack = ({ items }: { items: Project[] }) => (
  <ScrollStack
    useWindowScroll
    smoothScroll={false}
    stackPosition="20%"
    itemDistance={120}
    itemStackDistance={26}
    itemScale={0.035}
    baseScale={0.86}
    dimAmount={0.14}
    holdDistance={120}
  >
    {items.map((p, i) => (
      <ScrollStackItem key={p.slug} itemClassName="!h-auto bg-card text-foreground md:!h-[27rem]">
        <TransitionLink
          href={`/projects/${p.slug}`}
          data-cursor="Open"
          className="group grid h-full gap-6 p-4 sm:p-6 md:grid-cols-2 md:gap-10 md:p-8"
        >
          <div className={`relative aspect-[16/10] overflow-hidden rounded-2xl md:aspect-auto md:h-full ${i % 2 ? 'md:order-2' : ''}`}>
            <ProjectCover kind={p.cover} hue={p.hue} hue2={p.hue2} image={p.image} alt={`${p.title} preview`} />
          </div>

          <div className="flex flex-col justify-between gap-6 py-1">
            <div>
              <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <span aria-hidden className="h-px w-8 bg-line/30" />
                <span>{p.category.join(' · ')}</span>
              </p>
              <h3 className="display mt-4 text-[clamp(1.9rem,3.4vw,3.1rem)] leading-[1.02]">{p.title}</h3>
              <p className="mt-3 text-base leading-snug text-muted-foreground md:text-lg">{p.outcome}</p>
            </div>

            <div>
              <ul className="flex flex-wrap gap-2">
                {p.tech.slice(0, 5).map((t) => (
                  <li key={t} className="rounded-full border border-line/20 px-3 py-1 text-xs font-medium md:text-sm">
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                View case study
                <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </p>
            </div>
          </div>
        </TransitionLink>
      </ScrollStackItem>
    ))}
  </ScrollStack>
);

export default ProjectStack;
