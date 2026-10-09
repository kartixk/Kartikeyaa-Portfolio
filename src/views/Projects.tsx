'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import PageHeader from '@/components/PageHeader';
import TransitionLink from '@/components/TransitionLink';
import { ProjectCover, Reveal, Tilt } from '@/components/fx';
import { projects, type Category, type Project } from '@/lib/data';

type Filter = 'All' | Category;
const filters: Filter[] = ['All', 'Web', 'ML', 'IoT'];

const Card = ({ project, n, offset }: { project: Project; n: number; offset: boolean }) => (
  <TransitionLink href={`/projects/${project.slug}`} data-cursor="View" className={`group block ${offset ? 'md:mt-28' : ''}`}>
    {/* the in-view trigger lives on this unclipped wrapper; a clipped-away element can't be observed reliably */}
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-8% 0px' }} className="relative aspect-[4/3]">
      <motion.div
        variants={{
          hidden: { clipPath: 'inset(100% 0% 0% 0% round 24px)' },
          show: { clipPath: 'inset(0% 0% 0% 0% round 24px)', transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } },
        }}
        className="absolute inset-0 overflow-hidden rounded-3xl"
      >
        <div className="h-full w-full transition-transform [transition-duration:1100ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]">
          <ProjectCover kind={project.cover} hue={project.hue} hue2={project.hue2} image={project.image} alt={`${project.title} preview`} />
        </div>
        <span className="absolute left-5 top-5 rounded-full bg-[#0f0e0d]/90 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[#f1ecdc]">
          0{n} / {project.category.join(' · ')}
        </span>
      </motion.div>
    </motion.div>

    <div className="mt-7 flex items-start justify-between gap-6">
      <div>
        <h3 className="display text-[clamp(2rem,4vw,3.6rem)] transition-colors duration-300 group-hover:text-gradient">{project.title}</h3>
        <p className="mt-4 max-w-md text-lg leading-snug text-muted-foreground">{project.outcome}</p>
      </div>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line/25 transition-all duration-500 group-hover:rotate-45 group-hover:border-primary group-hover:bg-primary group-hover:text-gradient-foreground">
        <ArrowUpRight size={20} />
      </span>
    </div>
    <div className="mt-6 flex flex-wrap gap-2">
      {project.tech.map((t) => (
        <span key={t} className="rounded-full border border-line/20 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {t}
        </span>
      ))}
    </div>
  </TransitionLink>
);

const Projects = () => {
  const [active, setActive] = useState<Filter>('All');
  const list = active === 'All' ? projects : projects.filter((p) => p.category.includes(active));

  return (
    <PageTransition>
      <PageHeader
        index="02"
        eyebrow="Selected work"
        lines={[<span key="a">Things I&apos;ve</span>, <span key="b" className="serif text-gradient">built.</span>]}
        subtitle="Full-stack platforms, machine learning and IoT systems — each one built end to end."
        meta={`${String(projects.length).padStart(2, '0')} projects`}
      />

      <section className="wrap pb-24 md:pb-40">
        <Reveal className="mb-14">
          <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter projects">
            {filters.map((f) => {
              const on = active === f;
              return (
                <button
                  key={f}
                  aria-pressed={on}
                  onClick={() => setActive(f)}
                  className={`relative rounded-full border px-6 py-2.5 font-display text-sm font-semibold transition-colors duration-300 ${on ? 'border-transparent text-[#120d24]' : 'border-line/25 text-muted-foreground hover:text-foreground'}`}
                >
                  {on && (
                    <motion.span layoutId="filter-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} className="absolute inset-0 rounded-full bg-grad" />
                  )}
                  <span className="relative z-10">{f}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <motion.div layout className="grid gap-x-10 gap-y-12 md:grid-cols-2 md:gap-y-16">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Tilt max={4} glare={false}><Card project={p} n={projects.indexOf(p) + 1} offset={i % 2 === 1} /></Tilt>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {list.length === 0 && <p className="py-20 text-center text-muted-foreground">Nothing here yet.</p>}
      </section>
    </PageTransition>
  );
};

export default Projects;
