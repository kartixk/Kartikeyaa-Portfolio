import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Github, Linkedin, Mail, Download, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState, useRef } from 'react';
import PageTransition from '@/components/PageTransition';
import { useProjectsStore } from '@/stores/projectsStore';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Reveal, Magnetic, Marquee, TiltCard, HudCorners } from '@/components/fx';

// 3D hero is heavy (three + drei) — load it after the text hero paints.
const Hero3D = lazy(() => import('@/components/fx/Hero3D').then((m) => ({ default: m.Hero3D })));

/* ─── data ─── */
const techStack = [
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original-wordmark.svg' },
  { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
  { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
];

const roles = ['Full Stack Developer', 'ML Engineer', 'IoT Systems Builder', 'Problem Solver'];

const RotatingRole = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % roles.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-flex h-[1.4em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="whitespace-nowrap text-primary"
        >
          {roles[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const useCountUp = (target: number, duration = 1600, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (startTime === null) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
};

const stats = [
  { value: 3, suffix: '+', label: 'Internships' },
  { value: 10, suffix: '+', label: 'Projects shipped' },
  { value: 82, suffix: '%', label: 'ML model accuracy' },
  { value: 35, suffix: '%', label: 'Faster UX delivered' },
];

const StatItem = ({ value, suffix, label, start, delay }: { value: number; suffix: string; label: string; start: boolean; delay: number }) => {
  const count = useCountUp(value, 1600, start);
  return (
    <Reveal delay={delay} className="text-center sm:text-left">
      <div className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
        <span className="gradient-text">{count}{suffix}</span>
      </div>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
    </Reveal>
  );
};

const skillsPreview = [
  { category: 'Frontend', icon: '⬡', color: 'hsl(220 90% 62%)', skills: ['React', 'TypeScript', 'Tailwind', 'Framer Motion'] },
  { category: 'Backend', icon: '⚙', color: 'hsl(186 100% 52%)', skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'] },
  { category: 'AI / ML', icon: '◈', color: 'hsl(315 90% 62%)', skills: ['Python', 'TensorFlow', 'NLP', 'Scikit-learn'] },
  { category: 'Tooling', icon: '▲', color: 'hsl(220 90% 62%)', skills: ['Git', 'Docker', 'Supabase', 'Figma'] },
];

const experiences = [
  { company: 'Spotmies LLP', role: 'Software Developer Intern', highlight: 'Building & maintaining scalable web apps', period: 'Dec 2025 — Present' },
  { company: 'NTPC Limited', role: 'Software Engineer Intern', highlight: 'Reduced user interaction time by 35%', period: 'May 2025' },
  { company: 'Zenith-Zap', role: 'Software Engineer Intern', highlight: 'Improved page load performance by 25%', period: 'May — Jun 2025' },
];

const techColors: Record<string, string> = {
  React: 'hsl(220 90% 62%)', 'Node.js': 'hsl(142 60% 50%)', MongoDB: 'hsl(120 60% 42%)',
  Python: 'hsl(210 80% 60%)', TensorFlow: 'hsl(28 90% 55%)', LSTM: 'hsl(186 100% 52%)',
  NLP: 'hsl(315 90% 62%)', 'Tailwind CSS': 'hsl(220 90% 62%)', Vercel: 'hsl(0 0% 85%)',
  Express: 'hsl(48 90% 60%)', 'Cloud Storage': 'hsl(220 80% 62%)', IoT: 'hsl(315 90% 62%)',
  ThingSpeak: 'hsl(220 90% 62%)', Sensors: 'hsl(142 60% 50%)', Arduino: 'hsl(180 70% 45%)',
};

const Home = () => {
  const reduce = useReducedMotion();
  const { projects } = useProjectsStore();
  const featured = projects.slice(0, 3);
  const [statsStart, setStatsStart] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Scroll-scrubbed hero: text lifts + fades, 3D sinks + scales as you scroll past.
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroTextY = useTransform(heroProgress, [0, 1], [0, reduce ? 0 : -130]);
  const heroOpacity = useTransform(heroProgress, [0, 0.75], [1, reduce ? 1 : 0]);
  const heroThreeY = useTransform(heroProgress, [0, 1], [0, reduce ? 0 : 150]);
  const heroThreeScale = useTransform(heroProgress, [0, 1], [1, reduce ? 1 : 1.18]);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsStart(true); io.disconnect(); } },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <PageTransition>
      <div>
        {/* ─────────── HERO ─────────── */}
        <section ref={heroRef} className="scanlines relative flex min-h-screen items-center overflow-hidden">
          {/* 3D holographic world — full bleed */}
          <motion.div
            style={{ y: heroThreeY, scale: heroThreeScale }}
            className="pointer-events-none absolute inset-0"
          >
            <Suspense fallback={null}>
              <Hero3D className="h-full w-full" />
            </Suspense>
          </motion.div>

          {/* legibility fades (theme-aware) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent md:via-background/55" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

          {/* HUD corner frame */}
          <HudCorners className="z-10 m-4 md:m-7" size="h-7 w-7" color="border-primary/45" />

          {/* top status bar */}
          <div className="absolute inset-x-0 top-0 z-10 hidden items-center justify-between px-9 pt-24 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground lg:flex">
            <span className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5"><span className="absolute h-full w-full animate-ping rounded-full bg-primary" /><span className="h-1.5 w-1.5 rounded-full bg-primary" /></span>
              SYSTEM ONLINE
            </span>
            <span>LAT 17.68°N · LON 83.21°E — VISAKHAPATNAM</span>
            <span className="text-primary">PORTFOLIO_OS // v3.0</span>
          </div>

          <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="section-container relative z-10 w-full">
            <div className="max-w-3xl">
              {/* boot line */}
              <Reveal direction="none" immediate>
                <p className="mb-6 font-mono text-xs text-primary sm:text-sm">
                  <span className="text-muted-foreground">&gt;</span> initializing_developer_profile
                  <span className="animate-flicker">_</span>
                </p>
              </Reveal>

              {/* name */}
              <h1 className="leading-[0.9]">
                <span className="block font-mono text-xs font-semibold uppercase tracking-[0.5em] text-muted-foreground sm:text-sm">
                  B Venkata Sai
                </span>
                <Reveal as="span" immediate delay={0.15} className="mt-3 block">
                  <span className="font-hero text-5xl font-black uppercase tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-[7rem]">
                    <span className="neon-text">KART</span>IKEYA
                  </span>
                </Reveal>
              </h1>

              {/* role bar */}
              <Reveal delay={0.35} className="mt-6 inline-flex items-center gap-3 border border-primary/30 bg-primary/[0.06] px-4 py-2 clip-tech">
                <span className="h-2 w-2 bg-primary" />
                <span className="font-mono text-sm font-semibold uppercase tracking-[0.18em]">
                  <RotatingRole />
                </span>
              </Reveal>

              {/* description */}
              <Reveal delay={0.5} className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                CS undergraduate engineering <span className="font-semibold text-foreground">full-stack systems</span>,{' '}
                <span className="font-semibold text-foreground">machine learning</span>, and{' '}
                <span className="font-semibold text-foreground">IoT</span> — building interfaces from the future, today.
              </Reveal>

              {/* CTAs */}
              <Reveal delay={0.65} className="mt-9 flex flex-wrap items-center gap-4">
                <Magnetic strength={0.4}>
                  <Link to="/projects" className="btn-gradient group inline-flex items-center gap-2 px-7 py-4 font-mono text-xs font-bold uppercase tracking-widest">
                    View Projects
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </Magnetic>
                <Magnetic strength={0.3}>
                  <a
                    href="https://res.cloudinary.com/dvf0ugwrr/image/upload/fl_attachment/v1773757669/kartikeyaa-Resume_khl64p.pdf"
                    download="Kartikeya_Resume.pdf"
                    className="btn-hud group inline-flex items-center gap-2 px-7 py-4 font-mono text-xs font-bold uppercase tracking-widest"
                  >
                    <Download size={14} className="transition-transform group-hover:-translate-y-0.5" /> Resume
                  </a>
                </Magnetic>
              </Reveal>

              {/* HUD stat strip */}
              <Reveal delay={0.8} className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-primary/15 border border-primary/15 bg-line/[0.02]">
                {[
                  { v: '3+', l: 'Internships' },
                  { v: '10+', l: 'Projects' },
                  { v: '82%', l: 'ML Accuracy' },
                ].map((s) => (
                  <div key={s.l} className="px-4 py-3">
                    <div className="font-hero text-xl font-bold text-primary">{s.v}</div>
                    <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </Reveal>

              {/* socials */}
              <Reveal delay={0.95} className="mt-9 flex items-center gap-3">
                {[
                  { href: 'https://mail.google.com/mail/?view=cm&fs=1&to=kartikeyaa15@gmail.com', icon: Mail, label: 'Email' },
                  { href: 'https://linkedin.com/in/b-venkata-sai-kartikeya-28a99b357', icon: Linkedin, label: 'LinkedIn' },
                  { href: 'https://github.com/kartixk', icon: Github, label: 'GitHub' },
                ].map(({ href, icon: Icon, label }) => (
                  <Magnetic key={label} strength={0.5}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid h-11 w-11 place-items-center border border-primary/20 bg-line/[0.03] text-muted-foreground transition-all hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
                    >
                      <Icon size={17} />
                    </a>
                  </Magnetic>
                ))}
              </Reveal>
            </div>
          </motion.div>

          {/* scroll hint */}
          {!reduce && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Scroll</span>
              <div className="flex h-9 w-5 items-start justify-center border border-primary/30 p-1.5">
                <div className="h-1.5 w-1 animate-scroll-dot bg-primary" />
              </div>
            </motion.div>
          )}
        </section>

        {/* ─────────── TECH MARQUEE ─────────── */}
        <section className="relative border-y border-line/[0.06] bg-line/[0.015] py-7 backdrop-blur-sm">
          <Marquee duration={36}>
            {techStack.map((t) => (
              <div key={t.name} className="mx-7 flex items-center gap-3 opacity-70 transition-opacity hover:opacity-100 md:mx-10">
                <img
                  src={t.icon}
                  alt={t.name}
                  loading="lazy"
                  className={`h-8 w-8 object-contain ${t.name === 'Express' ? 'invert' : ''}`}
                />
                <span className="whitespace-nowrap font-display text-lg font-bold text-foreground/80">{t.name}</span>
              </div>
            ))}
          </Marquee>
        </section>

        {/* ─────────── STATS ─────────── */}
        <section ref={statsRef} className="section-container !py-16">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s, i) => (
              <StatItem key={s.label} {...s} start={statsStart} delay={i * 0.08} />
            ))}
          </div>
        </section>

        {/* ─────────── SCROLL-SCRUBBED BAND ─────────── */}
        <ScrubBand />

        {/* ─────────── FEATURED PROJECTS ─────────── */}
        <section className="section-container !pt-6">
          <SectionIntro eyebrow="Selected Work" titleA="Featured" titleB="Projects"
            blurb="A curated selection of projects — from full-stack platforms to AI systems." />

          <div className="mt-14 space-y-6">
            {featured.map((project, i) => {
              const highlights = [
                { value: 'Multi-tenant', label: 'SaaS Platform' },
                { value: '50+', label: 'Daily users' },
                { value: '82%', label: 'Model accuracy' },
              ];
              return (
                <Reveal key={project.id} delay={i * 0.08}>
                  <div className="group relative rounded-3xl border-[0.75px] border-border p-2">
                    <GlowingEffect spread={44} glow disabled={false} proximity={70} inactiveZone={0.01} borderWidth={3} />
                    <TiltCard intensity={5}
                      className="glass-panel overflow-hidden rounded-2xl transition-colors duration-500 group-hover:border-brand-2/25">
                      <div className="relative grid gap-6 p-7 md:grid-cols-[auto_1fr_auto] md:items-center md:p-9">
                        <div className="font-display text-5xl font-extrabold leading-none text-line/[0.07] md:text-7xl">
                          0{i + 1}
                        </div>
                        <div className="min-w-0">
                          <span className="inline-block rounded-full bg-brand-1/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-1">
                            {project.subtitle}
                          </span>
                          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-brand-2 md:text-3xl">
                            {project.title}
                          </h3>
                          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground line-clamp-2">
                            {project.description[0]}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.tech.slice(0, 4).map((t) => (
                              <span key={t} className="inline-flex items-center gap-1.5 rounded-lg border border-line/8 bg-line/[0.03] px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: techColors[t] ?? 'hsl(220 90% 62%)' }} />
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-5 md:flex-col md:items-end">
                          <div className="text-right">
                            <div className="font-display text-2xl font-extrabold gradient-text">{highlights[i]?.value}</div>
                            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{highlights[i]?.label}</div>
                          </div>
                          <div className="flex gap-2">
                            {project.github && (
                              <a href={project.github} aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-lg border border-line/8 bg-line/[0.03] text-muted-foreground transition-colors hover:border-brand-2/40 hover:text-brand-2">
                                <Github size={15} />
                              </a>
                            )}
                            {project.link && (
                              <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label="Live demo" className="grid h-9 w-9 place-items-center rounded-lg border border-line/8 bg-line/[0.03] text-muted-foreground transition-colors hover:border-brand-2/40 hover:text-brand-2">
                                <ExternalLink size={15} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.1} className="mt-10 flex justify-center">
            <Magnetic strength={0.3}>
              <Link to="/projects" className="group inline-flex items-center gap-2 rounded-full border border-line/12 bg-line/[0.04] px-6 py-3 text-sm font-semibold transition-colors hover:border-brand-2/40 hover:text-brand-2">
                Explore all projects
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
          </Reveal>
        </section>

        {/* ─────────── SKILLS BENTO ─────────── */}
        <section className="section-container">
          <SectionIntro eyebrow="My Toolkit" titleA="Skills &" titleB="Technologies"
            blurb="The tools and technologies I reach for across the full stack." />

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {skillsPreview.map((cat, i) => (
              <Reveal key={cat.category} delay={i * 0.08}>
                <div className="group relative h-full rounded-3xl border-[0.75px] border-border p-2">
                  <GlowingEffect spread={44} glow disabled={false} proximity={70} inactiveZone={0.01} borderWidth={3} />
                  <div className="relative h-full overflow-hidden rounded-2xl glass-panel p-7">
                    <div className="absolute right-5 top-5 font-display text-3xl opacity-30" style={{ color: cat.color }}>{cat.icon}</div>
                    <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: cat.color }}>{cat.category}</span>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {cat.skills.map((s) => (
                        <span key={s} className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-foreground/80"
                          style={{ background: `${cat.color}14`, border: `1px solid ${cat.color}30` }}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cat.color }} />{s}
                        </span>
                      ))}
                    </div>
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-700 group-hover:w-full"
                      style={{ background: `linear-gradient(90deg, ${cat.color}, transparent)` }} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-10 flex justify-center">
            <Magnetic strength={0.3}>
              <Link to="/skills" className="group inline-flex items-center gap-2 rounded-full border border-line/12 bg-line/[0.04] px-6 py-3 text-sm font-semibold transition-colors hover:border-brand-2/40 hover:text-brand-2">
                See full skillset <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
          </Reveal>
        </section>

        {/* ─────────── EXPERIENCE ─────────── */}
        <section className="section-container">
          <SectionIntro eyebrow="Professional Journey" titleA="Experience" titleB="Highlights"
            blurb="Internships where I shipped real features and drove measurable impact." />

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {experiences.map((exp, i) => (
              <Reveal key={exp.company} delay={i * 0.08}>
                <div className="group relative h-full rounded-3xl border-[0.75px] border-border p-2">
                  <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
                  <div className="relative flex h-full flex-col rounded-2xl glass-panel p-7">
                    <span className="font-mono text-xs text-brand-2">{exp.period}</span>
                    <h3 className="mt-3 font-display text-xl font-bold tracking-tight transition-colors group-hover:text-brand-2">{exp.company}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{exp.role}</p>
                    <div className="mt-auto pt-5">
                      <div className="inline-flex items-center gap-2 rounded-lg border border-brand-3/15 bg-brand-3/[0.07] px-3 py-1.5">
                        <ArrowUpRight size={13} className="text-brand-3" />
                        <span className="text-xs font-medium text-foreground/80">{exp.highlight}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-10 flex justify-center">
            <Magnetic strength={0.3}>
              <Link to="/experience" className="group inline-flex items-center gap-2 rounded-full border border-line/12 bg-line/[0.04] px-6 py-3 text-sm font-semibold transition-colors hover:border-brand-2/40 hover:text-brand-2">
                View full experience <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
          </Reveal>
        </section>
      </div>
    </PageTransition>
  );
};

/* scroll-scrubbed marquee band — two rows drift opposite ways with scroll */
const ScrubBand = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // smooth the scroll input so fast scrolling eases instead of whipping across
  const smooth = useSpring(scrollYProgress, { stiffness: 50, damping: 24, mass: 0.7 });
  const x1 = useTransform(smooth, [0, 1], reduce ? ['0%', '0%'] : ['4%', '-13%']);
  const x2 = useTransform(smooth, [0, 1], reduce ? ['0%', '0%'] : ['-11%', '6%']);
  const phrase = ['Full-Stack', 'Machine Learning', 'IoT', 'Creative Dev', 'Scalable APIs'];
  const Row = ({ accent }: { accent?: boolean }) => (
    <div className="flex shrink-0 items-center gap-6 pr-6">
      {phrase.map((w, i) => (
        <span key={i} className="flex items-center gap-6">
          <span className={accent ? 'aurora-text' : 'text-outline'}>{w}</span>
          <span className="text-brand-2/50">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <section ref={ref} className="relative overflow-hidden py-14 md:py-20">
      <motion.div style={{ x: x1 }} className="flex w-max whitespace-nowrap font-display text-5xl font-extrabold leading-none tracking-tight md:text-7xl">
        <Row /><Row /><Row />
      </motion.div>
      <motion.div style={{ x: x2 }} className="mt-3 flex w-max whitespace-nowrap font-display text-5xl font-extrabold leading-none tracking-tight md:text-7xl">
        <Row accent /><Row accent /><Row accent />
      </motion.div>
    </section>
  );
};

/* shared section intro */
const SectionIntro = ({ eyebrow, titleA, titleB, blurb }: { eyebrow: string; titleA: string; titleB: string; blurb: string }) => (
  <div className="max-w-2xl">
    <Reveal>
      <p className="eyebrow mb-4"><span className="h-px w-8 bg-brand-2/60" /> {eyebrow}</p>
    </Reveal>
    <Reveal delay={0.05}>
      <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
        <span className="gradient-text">{titleA}</span> <span className="text-foreground">{titleB}</span>
      </h2>
    </Reveal>
    <Reveal delay={0.1}>
      <p className="mt-4 text-base text-muted-foreground">{blurb}</p>
    </Reveal>
  </div>
);

export default Home;
