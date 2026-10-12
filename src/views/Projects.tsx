'use client';

import PageTransition from '@/components/PageTransition';
import PageHeader from '@/components/PageHeader';
import ProjectStack from '@/components/ProjectStack';
import { projects } from '@/lib/data';

const Projects = () => (
  <PageTransition>
    <PageHeader
      index="02"
      eyebrow="Selected work"
      lines={[<span key="a">Things I&apos;ve</span>, <span key="b" className="serif text-gradient">built.</span>]}
      subtitle="Full-stack platforms, machine learning and IoT systems — each one built end to end."
      meta={`${String(projects.length).padStart(2, '0')} projects`}
    />

    <section className="wrap pb-24 md:pb-40">
      <ProjectStack items={projects} />
    </section>
  </PageTransition>
);

export default Projects;
