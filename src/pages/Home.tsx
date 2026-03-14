import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, Download, ExternalLink, Briefcase, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import PageTransition from '@/components/PageTransition';
import SectionHeader from '@/components/SectionHeader';
import { useProjectsStore } from '@/stores/projectsStore';
import { PortfolioPage } from '@/components/ui/starfall-portfolio-landing';

// Tech stack strip data
const techStack = [
  { name: 'React', color: 'hsl(199, 89%, 48%)' },
  { name: 'Node.js', color: 'hsl(120, 50%, 45%)' },
  { name: 'MongoDB', color: 'hsl(120, 60%, 35%)' },
  { name: 'Python', color: 'hsl(210, 60%, 50%)' },
  { name: 'JavaScript', color: 'hsl(50, 90%, 50%)' },
  { name: 'Docker', color: 'hsl(210, 80%, 55%)' },
];

const Home = () => {
  const { projects } = useProjectsStore();
  const featuredProjects = projects.slice(0, 3);
  const navigate = useNavigate();

  const skillsPreview = [
    { category: 'Frontend', skills: ['React', 'TypeScript', 'Tailwind CSS'] },
    { category: 'Backend', skills: ['Node.js', 'Express', 'MongoDB'] },
    { category: 'AI/ML', skills: ['Python', 'TensorFlow', 'NLP'] },
    { category: 'DevOps', skills: ['Docker', 'Git', 'CI/CD'] },
  ];

  const experiences = [
    { company: 'NTPC Limited', role: 'Software Engineer Intern', highlight: 'Reduced user interaction time by 35%' },
    { company: 'Zenith-Zap', role: 'Software Engineer Intern', highlight: 'Improved page load performance by 25%' },
  ];

  return (
    <PageTransition>
      <div className="gradient-bg">
        {/* ─── STARFALL HERO ─── */}
        <PortfolioPage
          logo={{
            initials: 'BK',
            name: 'Kartikeya',
          }}
          navLinks={[
            { label: 'About', href: '/about' },
            { label: 'Projects', href: '/projects' },
            { label: 'Skills', href: '/skills' },
          ]}
          resume={{
            label: 'Download Resume',
            onClick: () => {
              window.open('https://res.cloudinary.com/dvf0ugwrr/image/upload/fl_attachment/v1773323338/kartikeyaa-Resume_sko8bi.pdf', '_blank');
            },
          }}
          hero={{
            titleLine1: 'Full Stack Developer &',
            titleLine2Gradient: 'AI/ML Enthusiast',
            subtitle: 'Computer Science undergraduate specializing in software development, machine learning, and IoT systems. Experienced in building full stack applications and data-driven models.',
          }}
          ctaButtons={{
            primary: {
              label: 'View Projects',
              onClick: () => navigate('/projects'),
            },
            secondary: {
              label: 'Contact Me',
              onClick: () => navigate('/contact'),
            },
          }}
          projects={[
            {
              title: 'Velvet Plate',
              description: 'Full stack SaaS restaurant management with multi-tenant architecture.',
              tags: ['React', 'Node.js', 'MongoDB'],
            },
            {
              title: 'Zenith-Zap Platform',
              description: 'Mobile-first React platform supporting 50+ daily users.',
              tags: ['React', 'Express', 'REST API'],
            },
            {
              title: 'Sentiment Analysis',
              description: 'BiLSTM ML model for sentiment classification with 82% accuracy.',
              tags: ['Python', 'TensorFlow', 'NLP'],
            },
          ]}
          stats={[
            { value: '10+', label: 'Projects Built' },
            { value: '2+', label: 'Internships' },
            { value: '82%', label: 'ML Accuracy' },
          ]}
          showAnimatedBackground={true}
        />

        {/* ─── TECH STACK STRIP ─── */}
        <section className="relative py-8 border-y border-border/30 overflow-hidden">
          <div className="absolute inset-0 bg-card/20 backdrop-blur-sm" />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
              {techStack.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  className="flex items-center gap-2 group cursor-default"
                >
                  <div
                    className="w-3 h-3 rounded-full transition-shadow duration-300 group-hover:shadow-[0_0_12px_currentColor]"
                    style={{ backgroundColor: tech.color, color: tech.color }}
                  />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURED PROJECTS ─── */}
        <section className="py-20 md:py-28">
          <div className="section-container !py-0">
            <SectionHeader title="Featured Projects" subtitle="Recent work I'm proud of" />
            <div className="grid md:grid-cols-3 gap-6">
              {featuredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  whileHover={{ y: -5 }}
                  className="glass-card glow-border p-6 group hover:border-primary/40 transition-all duration-300"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-primary/70 mt-1">{project.subtitle}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description[0]}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.slice(0, 4).map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {project.github && (
                      <a href={project.github} className="text-muted-foreground hover:text-primary transition-colors">
                        <Github size={16} />
                      </a>
                    )}
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                View All Projects <ChevronRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ─── SKILLS PREVIEW ─── */}
        <section className="py-20 md:py-28 relative">
          <div className="absolute inset-0 bg-card/10" />
          <div className="section-container !py-0 relative z-10">
            <SectionHeader title="Skills" subtitle="Technologies in my toolkit" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {skillsPreview.map((cat, i) => (
                <motion.div
                  key={cat.category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="glass-card p-5 hover:border-primary/30 transition-all duration-300"
                >
                  <h3 className="text-sm font-heading font-semibold text-primary mb-3 uppercase tracking-wider">
                    {cat.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-muted/80 text-foreground border border-border/40">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <Link
                to="/skills"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                See All Skills <ChevronRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ─── EXPERIENCE HIGHLIGHTS ─── */}
        <section className="py-20 md:py-28">
          <div className="section-container !py-0">
            <SectionHeader title="Experience" subtitle="Professional highlights" />
            <div className="space-y-5 max-w-3xl mx-auto">
              {experiences.map((exp, i) => (
                <motion.div
                  key={exp.company}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="glass-card glow-border p-6 flex items-start gap-4 group hover:border-primary/30 transition-all duration-300"
                >
                  <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                    <Briefcase className="text-primary" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                      {exp.company}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{exp.role}</p>
                    <p className="text-sm text-accent font-medium">↗ {exp.highlight}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <Link
                to="/experience"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                View Full Experience <ChevronRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ─── CALL TO ACTION ─── */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, hsl(199 89% 48% / 0.08), transparent 70%)',
              }}
            />
          </div>
          <div className="section-container !py-0 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
                <span className="gradient-text">Let's Build Something</span>
                <br />
                <span className="text-foreground">Amazing Together</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
                I'm always open to new opportunities, collaborations, and interesting projects.
                Let's connect and create something extraordinary.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:shadow-[0_0_40px_hsl(199_89%_48%/0.5)] transition-all duration-300 hover:scale-105"
                >
                  Get In Touch <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="mailto:kartikeyaa15@gmail.com"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass-card border border-border/60 text-foreground font-semibold text-lg hover:border-primary/50 transition-all duration-300"
                >
                  <Mail size={20} /> kartikeyaa15@gmail.com
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;