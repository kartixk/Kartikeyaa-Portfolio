import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import PageTransition from '@/components/PageTransition';
import PageHeader from '@/components/PageHeader';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Reveal, TiltCard, Magnetic } from '@/components/fx';

type Category = 'All' | 'Web' | 'ML' | 'IoT';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string[];
  tech: string[];
  link?: string;
  github?: string;
  category: Category[];
  accent: string;
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Velvet Plate',
    subtitle: 'Full-Stack SaaS Management System',
    description: [
      'Multi-tenant restaurant management platform with role-based access for Admins, Branch Managers, and Customers.',
      'Dynamic menu and inventory management with branch-specific pricing and stock tracking.',
      'Secure branch onboarding workflow with document verification.',
      'Cloud-based media storage and scalable APIs.',
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Cloud Storage'],
    github: '#',
    category: ['Web'],
    accent: 'hsl(186 100% 52%)',
  },
  {
    id: '2',
    title: 'Zenith-Zap Platform',
    subtitle: 'Mobile-First React Web Platform',
    description: [
      'Mobile-first React web platform supporting 50+ daily active users.',
      'Cross-browser compatibility and consistent UI behavior.',
      'Improved UI responsiveness by reducing unnecessary re-renders.',
    ],
    tech: ['React', 'Tailwind CSS', 'Vercel'],
    link: 'https://zenithzap.vercel.app',
    category: ['Web'],
    accent: 'hsl(220 90% 62%)',
  },
  {
    id: '3',
    title: 'Sentiment Analysis System',
    subtitle: 'NLP & Deep Learning',
    description: [
      'Bidirectional LSTM-based sentiment analysis system.',
      'Achieved 82% accuracy on 200+ test samples through model tuning.',
      'NLP preprocessing: tokenization, padding, and class imbalance handling.',
    ],
    tech: ['Python', 'TensorFlow', 'LSTM', 'NLP'],
    github: '#',
    category: ['ML'],
    accent: 'hsl(315 90% 62%)',
  },
  {
    id: '4',
    title: 'Environmental Monitoring IoT',
    subtitle: 'Real-Time Sensor Data System',
    description: [
      'IoT-based system for real-time environmental data acquisition.',
      'Live sensor readings on ThingSpeak dashboards.',
      'Stable Wi-Fi-based data transmission with minimal packet loss.',
    ],
    tech: ['IoT', 'ThingSpeak', 'Sensors', 'Arduino'],
    category: ['IoT'],
    accent: 'hsl(220 90% 62%)',
  },
];

const categories: Category[] = ['All', 'Web', 'ML', 'IoT'];

const ProjectCard = ({ project, index }: { project: Project; index: number }) => (
  <Reveal delay={index * 0.06} className="h-full">
    <div className="group relative h-full rounded-3xl border-[0.75px] border-border p-2">
      <GlowingEffect spread={44} glow disabled={false} proximity={70} inactiveZone={0.01} borderWidth={3} />
      <TiltCard intensity={7} glareColor={`${project.accent.replace(')', ' / 0.18)')}`}
        className="h-full overflow-hidden rounded-2xl glass-panel">
        {/* accent header band */}
        <div className="relative flex items-start justify-between gap-4 border-b border-line/[0.06] p-7"
          style={{ background: `linear-gradient(135deg, ${project.accent.replace(')', ' / 0.10)')}, transparent 70%)` }}>
          <div>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {project.category.map((c) => (
                <span key={c} className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em]"
                  style={{ background: `${project.accent.replace(')', ' / 0.15)')}`, color: project.accent }}>
                  {c}
                </span>
              ))}
            </div>
            <h3 className="font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-brand-2">{project.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{project.subtitle}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            {project.github && (
              <Magnetic strength={0.4}>
                <a href={project.github} aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-lg border border-line/10 bg-line/[0.03] text-muted-foreground transition-colors hover:border-brand-2/40 hover:text-brand-2">
                  <Github size={15} />
                </a>
              </Magnetic>
            )}
            {project.link && (
              <Magnetic strength={0.4}>
                <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label="Live demo" className="grid h-9 w-9 place-items-center rounded-lg border border-line/10 bg-line/[0.03] text-muted-foreground transition-colors hover:border-brand-2/40 hover:text-brand-2">
                  <ExternalLink size={15} />
                </a>
              </Magnetic>
            )}
          </div>
        </div>

        <div className="p-7">
          <ul className="space-y-2.5">
            {project.description.map((d, j) => (
              <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <ArrowUpRight size={14} className="mt-0.5 shrink-0" style={{ color: project.accent }} />
                {d}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="rounded-lg border border-line/8 bg-line/[0.03] px-2.5 py-1 text-xs font-medium text-foreground/75">
                {t}
              </span>
            ))}
          </div>
        </div>
      </TiltCard>
    </div>
  </Reveal>
);

const Projects = () => {
  const [active, setActive] = useState<Category>('All');
  const filtered = active === 'All' ? projects : projects.filter((p) => p.category.includes(active));

  return (
    <PageTransition>
      <div className="gradient-bg">
        <PageHeader
          eyebrow="Selected Work"
          title={<><span className="text-foreground">Things I've</span> <span className="aurora-text">built.</span></>}
          subtitle="A collection of projects spanning full-stack platforms, machine learning, and IoT systems."
        />

        <div className="section-container !pt-4">
          {/* Filter */}
          <Reveal className="mb-10 flex flex-wrap gap-2">
            {categories.map((c) => {
              const isActive = active === c;
              return (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`relative px-5 py-2 font-mono text-xs font-semibold uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-background' : 'border border-primary/20 text-muted-foreground hover:text-primary'}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="project-filter"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 -z-10 clip-tech"
                      style={{ background: 'hsl(var(--primary))' }}
                    />
                  )}
                  {c}
                </button>
              );
            })}
          </Reveal>

          {/* Grid */}
          <motion.div layout className="grid gap-6 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProjectCard project={project} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Projects;
