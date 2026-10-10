'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import PageHeader from '@/components/PageHeader';
import FolderGrid from '@/components/FolderGrid';
import { Reveal } from '@/components/fx';
import { projects, type Category } from '@/lib/data';

type Filter = 'All' | Category;
const filters: Filter[] = ['All', 'Web', 'ML', 'IoT'];

const Projects = () => {
  const [active, setActive] = useState<Filter>('All');
  const list = active === 'All' ? projects : projects.filter((p) => p.category.includes(active));

  return (
    <PageTransition>
      <PageHeader
        index="02"
        eyebrow="Selected work"
        lines={[<span key="a">Things I&apos;ve</span>, <span key="b" className="serif text-gradient">built.</span>]}
        subtitle="Full-stack platforms, machine learning and IoT systems — each one built end to end. Open a folder to peek inside."
        meta={`${String(projects.length).padStart(2, '0')} projects`}
      />

      <section className="wrap pb-24 md:pb-40">
        <Reveal className="mb-10 md:mb-14">
          <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter projects">
            {filters.map((f) => {
              const on = active === f;
              return (
                <button
                  key={f}
                  aria-pressed={on}
                  onClick={() => setActive(f)}
                  className={`relative rounded-full border px-6 py-2.5 font-display text-sm font-semibold transition-colors duration-300 ${on ? 'border-transparent text-[#0c0f0a]' : 'border-line/25 text-muted-foreground hover:text-foreground'}`}
                >
                  {on && <motion.span layoutId="filter-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} className="absolute inset-0 rounded-full bg-grad" />}
                  <span className="relative z-10">{f}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <FolderGrid items={list} />

        {list.length === 0 && <p className="py-20 text-center text-muted-foreground">Nothing here yet.</p>}
      </section>
    </PageTransition>
  );
};

export default Projects;
