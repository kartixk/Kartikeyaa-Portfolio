import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { useState, useRef, MouseEvent } from 'react';
import PageTransition from '@/components/PageTransition';
import SectionHeader from '@/components/SectionHeader';
import { GlowingEffect } from '@/components/ui/glowing-effect';

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
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Velvet Plate',
    subtitle: 'Full-Stack SaaS Management System',
    description: [
      'Built a multi-tenant restaurant management platform with role-based access for Admins, Branch Managers, and Customers.',
      'Implemented dynamic menu and inventory management with branch-specific pricing and stock tracking.',
      'Developed a secure branch onboarding workflow with document verification.',
      'Integrated cloud-based media storage and built scalable APIs.',
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Cloud Storage'],
    github: '#',
    category: ['Web'],
  },
  {
    id: '2',
    title: 'Zenith-Zap Platform',
    subtitle: 'Mobile-First React Web Platform',
    description: [
      'Created a mobile-first React web platform supporting 50+ daily active users.',
      'Ensured cross-browser compatibility and consistent UI behavior.',
      'Improved UI responsiveness by reducing unnecessary component re-renders.',
    ],
    tech: ['React', 'Tailwind CSS', 'Vercel'],
    link: 'https://zenithzap.vercel.app',
    category: ['Web'],
  },
  {
    id: '3',
    title: 'Sentiment Analysis System',
    subtitle: 'NLP & Deep Learning',
    description: [
      'Engineered a Bidirectional LSTM-based sentiment analysis system.',
      'Achieved 82% accuracy on 200+ test samples through model tuning.',
      'Applied NLP preprocessing including tokenization, padding, and class imbalance handling.',
    ],
    tech: ['Python', 'TensorFlow', 'LSTM', 'NLP'],
    github: '#',
    category: ['ML'],
  },
  {
    id: '4',
    title: 'Environmental Monitoring IoT',
    subtitle: 'Real-Time Sensor Data System',
    description: [
      'Built an IoT-based system for real-time environmental data acquisition.',
      'Displayed live sensor readings on ThingSpeak dashboards.',
      'Ensured stable Wi-Fi-based data transmission with minimal packet loss.',
    ],
    tech: ['IoT', 'ThingSpeak', 'Sensors', 'Arduino'],
    category: ['IoT'],
  },
];

const categories: Category[] = ['All', 'Web', 'ML', 'IoT'];

// Tilt card component
const TiltCard = ({ project, index }: { project: Project; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouse = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="relative h-full rounded-2xl border-[0.75px] border-border p-2 md:p-3 cursor-default"
    >
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
      <div className="relative h-full glass-card glow-border p-6 group hover:border-primary/40 transition-colors duration-300 overflow-hidden rounded-xl">
        <div style={{ transform: 'translateZ(20px)' }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-primary/70 mt-0.5">{project.subtitle}</p>
            </div>
            <div className="flex gap-2.5">
              {project.github && (
                <a
                  href={project.github}
                  className="p-2 rounded-lg glass-card border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
                >
                  <Github size={16} />
                </a>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg glass-card border border-border/40 text-muted-foreground hover:text-accent hover:border-accent/40 transition-all"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <ul className="space-y-2 mb-5">
            {project.description.map((d, j) => (
              <li key={j} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-primary mt-0.5 shrink-0">▹</span>
                {d}
              </li>
            ))}
          </ul>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-muted/80 text-foreground border border-border/40 hover:border-primary/40 hover:bg-primary/10 transition-colors"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [active, setActive] = useState<Category>('All');

  const filtered = active === 'All' ? projects : projects.filter((p) => p.category.includes(active));

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 gradient-bg">
        <div className="section-container">
          <SectionHeader title="Projects" subtitle="Things I've built" />

          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-10 flex-wrap"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${active === cat
                    ? 'bg-primary text-primary-foreground shadow-[0_0_20px_hsl(199_89%_48%/0.3)]'
                    : 'glass-card text-muted-foreground hover:text-foreground hover:border-primary/30'
                  }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Project grid */}
          <motion.div layout className="grid md:grid-cols-2 gap-6" style={{ perspective: 1000 }}>
            {filtered.map((project, i) => (
              <TiltCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Projects;
