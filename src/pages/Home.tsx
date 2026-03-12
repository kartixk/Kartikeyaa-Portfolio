import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, Download, ExternalLink, Briefcase, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useEffect, useState, useMemo } from 'react';
import PageTransition from '@/components/PageTransition';
import SectionHeader from '@/components/SectionHeader';
import { useProjectsStore } from '@/stores/projectsStore';

// Particle canvas component with subtle cursor "gravity"
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number | undefined;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    window.addEventListener('pointermove', handlePointerMove);

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          const mouse = mouseRef.current;
          if (mouse) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.hypot(dx, dy) || 1;
            const force = Math.min(80 / dist, 0.25);
            p.vx += (dx / dist) * force * 0.02;
            p.vy += (dy / dist) * force * 0.02;
          }

          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14, 165, 233, ${p.opacity})`;
        ctx.fill();
      });
    };

    const animate = () => {
      drawFrame();
      animationId = requestAnimationFrame(animate);
    };

    if (prefersReducedMotion) {
      drawFrame();
    } else {
      animate();
    }

    return () => {
      if (animationId !== undefined) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};

// Floating tech icons
const floatingIcons = [
  { label: 'React', icon: '⚛️', x: '10%', y: '20%', delay: 0 },
  { label: 'Node', icon: '🟢', x: '85%', y: '15%', delay: 0.5 },
  { label: 'Python', icon: '🐍', x: '75%', y: '70%', delay: 1 },
  { label: 'MongoDB', icon: '🍃', x: '15%', y: '75%', delay: 1.5 },
  { label: 'Docker', icon: '🐳', x: '90%', y: '45%', delay: 2 },
  { label: 'JS', icon: '✨', x: '5%', y: '50%', delay: 2.5 },
];

// Tech stack strip data
const techStack = [
  { name: 'React', color: 'hsl(199, 89%, 48%)' },
  { name: 'Node.js', color: 'hsl(120, 50%, 45%)' },
  { name: 'MongoDB', color: 'hsl(120, 60%, 35%)' },
  { name: 'Python', color: 'hsl(210, 60%, 50%)' },
  { name: 'JavaScript', color: 'hsl(50, 90%, 50%)' },
  { name: 'Docker', color: 'hsl(210, 80%, 55%)' },
];

// Text reveal animation
const textReveal = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

const charReveal = (text: string, baseDelay: number = 0) => {
  return text.split('').map((char, i) => (
    <motion.span
      key={i}
      custom={i + baseDelay}
      variants={textReveal}
      initial="hidden"
      animate="visible"
      className="inline-block"
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  ));
};

const Home = () => {
  const { projects } = useProjectsStore();
  const featuredProjects = projects.slice(0, 3);
  const containerRef = useRef<HTMLDivElement>(null);

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
      <div ref={containerRef} className="gradient-bg">
        {/* ─── HERO SECTION ─── */}
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <ParticleBackground />

          {/* Animated gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/4 left-1/5 w-80 h-80 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, hsl(199 89% 48% / 0.12), transparent 70%)' }}
            />
            <motion.div
              animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-1/4 right-1/5 w-96 h-96 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, hsl(270 60% 55% / 0.1), transparent 70%)' }}
            />
            <motion.div
              animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, hsl(160 84% 39% / 0.06), transparent 70%)' }}
            />
          </div>

          {/* Floating tech emojis removed for a cleaner background */}

          <div className="section-container text-center relative z-10 pt-24">
            {/* Role badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-primary/30 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-primary tracking-wide">
                Full Stack Developer · MERN · AI/ML · IoT
              </span>
            </motion.div>

            {/* Name with character reveal */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-4 leading-tight">
              <span className="gradient-text block">{charReveal('B Venkata Sai')}</span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-foreground block"
              >
                Kartikeya
              </motion.span>
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Computer Science undergraduate specializing in software development,
              machine learning, and IoT systems. Experienced in building full stack
              applications and data-driven models.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-[0_0_30px_hsl(199_89%_48%/0.4)] transition-all duration-300 hover:scale-105"
              >
                View Projects <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass-card border border-border/60 text-foreground font-semibold hover:border-primary/50 hover:shadow-[0_0_20px_hsl(199_89%_48%/0.2)] transition-all duration-300"
              >
                <Mail size={18} /> Contact Me
              </Link>
              <a
                href="https://res.cloudinary.com/dvf0ugwrr/image/upload/fl_attachment/v1773323338/kartikeyaa-Resume_sko8bi.pdf"
                download="Kartikeya-Resume.pdf"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass-card border border-accent/30 text-accent font-semibold hover:border-accent/60 hover:shadow-[0_0_20px_hsl(160_84%_39%/0.2)] transition-all duration-300"
              >
                <Download size={18} /> Download Resume
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              className="flex items-center justify-center gap-5 mt-10"
            >
              {[
                { to: '/contact', icon: Mail, label: 'Email' },
                { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
                { href: 'https://github.com', icon: Github, label: 'GitHub' },
              ].map(({ href, to, icon: Icon, label }) => {
                if (to) {
                  return (
                    <Link
                      key={label}
                      to={to}
                      className="inline-block p-2.5 rounded-lg glass-card border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors hover:scale-110 hover:-translate-y-1"
                    >
                      <Icon size={20} />
                    </Link>
                  );
                }
                return (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -2 }}
                    className="p-2.5 rounded-lg glass-card border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5"
            >
              <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </motion.div>
          </motion.div>
        </section>

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
