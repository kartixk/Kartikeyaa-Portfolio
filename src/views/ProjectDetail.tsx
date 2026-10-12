'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import TransitionLink from '@/components/TransitionLink';
import { Magnetic, ProjectCover, Reveal, TextReveal } from '@/components/fx';
import { projects, type Project } from '@/lib/data';

const realLink = (url?: string) => (url && url !== '#' ? url : undefined);

/** Greedy-pack a title into short lines so huge type wraps deliberately. */
const titleLines = (title: string, max = 11) =>
  title.split(' ').reduce<string[]>((lines, word) => {
    const last = lines[lines.length - 1];
    if (last !== undefined && `${last} ${word}`.length <= max) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
    return lines;
  }, []);

const ProjectDetail = ({ project }: { project: Project }) => {
  const reduce = useReducedMotion();
  const coverRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: coverRef, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [reduce ? 1 : 1.18, 1]);

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const live = realLink(project.link);
  const source = realLink(project.github);

  return (
    <PageTransition>
      <header className="wrap pb-12 pt-32 md:pb-16 md:pt-44">
        <Reveal immediate direction="none" className="mb-10 flex items-center justify-between">
          <TransitionLink href="/projects" className="link-u inline-flex items-center gap-2 text-sm font-medium">
            <ArrowLeft size={16} /> All projects
          </TransitionLink>
          <span className="font-mono text-xs tracking-widest text-muted-foreground">
            ({String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')})
          </span>
        </Reveal>

        <TextReveal
          as="h1"
          immediate
          delay={0.1}
          className="display text-[clamp(3rem,10.5vw,11rem)]"
          lines={titleLines(project.title).map((l, i, all) => (
            <span key={l} className={i === all.length - 1 && all.length > 1 ? 'serif text-gradient' : ''}>
              {l}
            </span>
          ))}
        />

        <Reveal immediate delay={0.5} className="mt-10 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
          {project.outcome}
        </Reveal>
      </header>

      {/* cover */}
      <section className="wrap">
        <div ref={coverRef} className="group relative aspect-[16/9] overflow-hidden rounded-3xl md:aspect-[21/9]">
          <motion.div style={{ scale }} className="h-full w-full">
            <ProjectCover kind={project.cover} hue={project.hue} hue2={project.hue2} image={project.image} alt={`${project.title} preview`} />
          </motion.div>
        </div>
      </section>

      {/* facts */}
      <section className="wrap section pb-20 md:pb-32">
        <div className="grid gap-10 border-t border-line/15 pt-10 md:grid-cols-4">
          <Reveal>
            <p className="eyebrow mb-4">Type</p>
            <p className="text-lg font-medium">{project.subtitle}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="eyebrow mb-4">Category</p>
            <p className="text-lg font-medium">{project.category.join(' · ')}</p>
          </Reveal>
          <Reveal delay={0.12} className="md:col-span-1">
            <p className="eyebrow mb-4">Stack</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="rounded-full border border-line/25 px-3 py-1 font-mono text-[11px] uppercase tracking-wider">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="eyebrow mb-4">Links</p>
            <div className="flex flex-col items-start gap-2 text-lg font-medium">
              {live && (
                <a href={live} target="_blank" rel="noopener noreferrer" className="link-u inline-flex items-center gap-1.5">
                  Live site <ArrowUpRight size={16} />
                </a>
              )}
              {source && (
                <a href={source} target="_blank" rel="noopener noreferrer" className="link-u inline-flex items-center gap-1.5">
                  Source code <ArrowUpRight size={16} />
                </a>
              )}
              {!live && !source && <span className="text-muted-foreground">Private — ask me for a walkthrough</span>}
            </div>
          </Reveal>
        </div>
      </section>

      {/* what I built */}
      <section className="wrap pb-24 md:pb-36">
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr]">
          <Reveal>
            <p className="eyebrow">What I built</p>
          </Reveal>
          <div>
            <Reveal>
              <p className="display mb-14 text-[clamp(1.7rem,3.4vw,3.2rem)] leading-[1.12] tracking-[-0.03em]">{project.summary}</p>
            </Reveal>
            <ol className="border-b border-line/15">
              {project.description.map((d, i) => (
                <Reveal key={i} as="li" delay={0.04} className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-line/15 py-7 md:grid-cols-[5rem_1fr]">
                  <span className="font-mono text-xs tracking-widest text-primary">0{i + 1}</span>
                  <p className="text-lg leading-relaxed md:text-xl">{d}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* next */}
      <section className="border-t border-line/15">
        <TransitionLink href={`/projects/${next.slug}`} data-cursor="Next" className="group wrap block py-20 md:py-32">
          <p className="eyebrow mb-8">Next project</p>
          <div className="flex items-end justify-between gap-6">
            <h2 className="display text-[clamp(2.6rem,9vw,9rem)] transition-all duration-500 group-hover:translate-x-4 group-hover:text-gradient">{next.title}</h2>
            <Magnetic strength={0.3}>
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-line/25 transition-all duration-500 group-hover:rotate-45 group-hover:border-primary group-hover:bg-primary group-hover:text-gradient-foreground md:h-24 md:w-24">
                <ArrowUpRight className="h-7 w-7 md:h-10 md:w-10" />
              </span>
            </Magnetic>
          </div>
        </TransitionLink>
      </section>
    </PageTransition>
  );
};

export default ProjectDetail;
