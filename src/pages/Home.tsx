import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, Download, ExternalLink, Briefcase, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import PageTransition from '@/components/PageTransition';
import SectionHeader from '@/components/SectionHeader';
import { useProjectsStore } from '@/stores/projectsStore';
import { AuroraBackground } from '@/components/ui/starfall-portfolio-landing';
import { GlowingEffect } from '@/components/ui/glowing-effect';




// Tech stack strip data
const techStack = [
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original-wordmark.svg' },
  { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original-wordmark.svg' },
  { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
  { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
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

// Typewriter role component
const twRoles = ['full-stack platforms', 'ML-powered systems', 'IoT solutions', 'scalable APIs'];
const TypewriterRole = () => {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const word = twRoles[roleIdx];
    const timeout = setTimeout(() => {
      if (!deleting && displayed.length < word.length) {
        setDisplayed(word.slice(0, displayed.length + 1));
      } else if (!deleting && displayed.length === word.length) {
        setTimeout(() => setDeleting(true), 1400);
      } else if (deleting && displayed.length > 0) {
        setDisplayed(word.slice(0, displayed.length - 1));
      } else if (deleting && displayed.length === 0) {
        setDeleting(false);
        setRoleIdx((i) => (i + 1) % twRoles.length);
      }
      setTick((t) => t + 1);
    }, deleting ? 45 : 80);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, roleIdx]);
  return (
    <span className="inline-flex items-center font-bold text-sm" style={{ color: '#38bdf8' }}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-[2px] h-4 ml-0.5 rounded-sm bg-cyan-400"
      />
    </span>
  );
};

// Animated cycling role component
const roles = ['Full Stack Developer', 'ML Engineer', 'IoT Systems Builder'];
const RotatingRole = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % roles.length), 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-flex overflow-hidden h-6">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-semibold text-base bg-clip-text text-transparent whitespace-nowrap"
          style={{ backgroundImage: 'linear-gradient(135deg, hsl(199 89% 48%), hsl(195 90% 55%))' }}
        >
          {roles[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

// Count-up hook
const useCountUp = (target: number, duration = 1400, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

// Advanced MacBook code card with 3D tilt + line numbers
const CodeCard = () => {
  const [hovered, setHovered] = useState(false);
  const [buildStep, setBuildStep] = useState(0);

  // Build steps animation
  const buildLines = [
    { text: '✓ Compiled successfully', color: '#4ade80' },
    { text: '✓ Bundle: 142kb gzipped', color: '#4ade80' },
    { text: '▶ Deploy complete', color: '#38bdf8' },
  ];
  useEffect(() => {
    const t = setTimeout(() => {
      setBuildStep((s) => (s < buildLines.length ? s + 1 : s));
    }, buildStep < buildLines.length ? 900 + buildStep * 400 : 99999);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildStep]);

  // ─── Typewriter engine ───
  // Each entry: raw string shown while typing + highlighted JSX shown when complete
  type CodeLineData = { raw: string; indent?: number };
  const CODE_LINES: CodeLineData[] = [
    { raw: 'const profile = {' },
    { raw: '  name: "B V S Kartikeya",' },
    { raw: '  role: "Full Stack Dev",' },
    { raw: '  stack: ["React", "Node.js",' },
    { raw: '          "Python", "TensorFlow"],' },
    { raw: '  openToWork: true,' },
    { raw: '  location: "India 🇮🇳",' },
    { raw: '  status: "Building great things"' },
    { raw: '}' },
  ];

  // Syntax-highlight a completed line
  const highlight = (raw: string) => {
    if (raw.startsWith('const '))
      return <><span className="text-violet-400">const</span><span className="text-foreground"> profile </span><span className="text-muted-foreground/40">= {'{'}</span></>;
    if (raw.includes('name:'))
      return <span className="pl-4 block"><span className="text-sky-300">name</span><span className="text-muted-foreground/40">: </span><span className="text-emerald-300">&quot;B V S Kartikeya&quot;</span><span className="text-muted-foreground/40">,</span></span>;
    if (raw.includes('role:'))
      return <span className="pl-4 block"><span className="text-sky-300">role</span><span className="text-muted-foreground/40">: </span><span className="text-emerald-300">&quot;Full Stack Dev&quot;</span><span className="text-muted-foreground/40">,</span></span>;
    if (raw.includes('stack:'))
      return <span className="pl-4 block"><span className="text-sky-300">stack</span><span className="text-muted-foreground/40">: [</span><span className="text-amber-300">&quot;React&quot;</span><span className="text-muted-foreground/40">, </span><span className="text-amber-300">&quot;Node.js&quot;</span><span className="text-muted-foreground/40">,</span></span>;
    if (raw.includes('"Python"'))
      return <span className="pl-10 block"><span className="text-amber-300">&quot;Python&quot;</span><span className="text-muted-foreground/40">, </span><span className="text-amber-300">&quot;TensorFlow&quot;</span><span className="text-muted-foreground/40">],</span></span>;
    if (raw.includes('openToWork'))
      return <span className="pl-4 block"><span className="text-sky-300">openToWork</span><span className="text-muted-foreground/40">: </span><span className="text-orange-400">true</span><span className="text-muted-foreground/40">,</span></span>;
    if (raw.includes('location'))
      return <span className="pl-4 block"><span className="text-sky-300">location</span><span className="text-muted-foreground/40">: </span><span className="text-emerald-300">&quot;India 🇮🇳&quot;</span><span className="text-muted-foreground/40">,</span></span>;
    if (raw.includes('status'))
      return <span className="pl-4 block flex items-center gap-0.5"><span className="text-sky-300">status</span><span className="text-muted-foreground/40">: </span><span className="text-emerald-300">&quot;Building great things&quot;</span><motion.span animate={{ opacity: [1,0,1] }} transition={{ duration: 1, repeat: Infinity }} className="inline-block w-[2px] h-[13px] ml-0.5 rounded-sm bg-sky-400" /></span>;
    if (raw === '}')
      return <span className="text-muted-foreground/40">{'}'}</span>;
    return <span className="text-foreground">{raw}</span>;
  };

  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const CHAR_DELAY = 28; // ms per character
  const LINE_PAUSE = 180; // ms pause between lines

  useEffect(() => {
    if (currentLine >= CODE_LINES.length) return;
    const target = CODE_LINES[currentLine].raw;
    if (currentChar < target.length) {
      const t = setTimeout(() => setCurrentChar((c) => c + 1), CHAR_DELAY);
      return () => clearTimeout(t);
    } else {
      // Line complete — commit and move to next
      const t = setTimeout(() => {
        setTypedLines((prev) => [...prev, target]);
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, LINE_PAUSE);
      return () => clearTimeout(t);
    }
  }, [currentLine, currentChar]);

  const floatingBadges = [
    { label: 'React ⚛', top: '-top-4', right: '-right-5', animY: [0, -8, 0], dur: 3.5, delay: 0, color: 'hsl(199 89% 52%)', border: 'hsl(199 89% 48% / 0.4)' },
    { label: 'Node.js 🟢', top: 'top-1/4', right: '-right-8', animY: [0, 6, 0], dur: 4.0, delay: 0.4, color: 'hsl(120 50% 50%)', border: 'hsl(120 50% 45% / 0.4)' },
    { label: 'TensorFlow 🧠', top: 'bottom-1/4', right: '-right-8', animY: [0, -5, 0], dur: 4.5, delay: 0.8, color: 'hsl(270 70% 65%)', border: 'hsl(270 70% 60% / 0.4)' },
    { label: 'Python 🐍', top: '-bottom-4', right: '-left-5', animY: [0, 7, 0], dur: 3.8, delay: 1.2, color: 'hsl(210 60% 60%)', border: 'hsl(210 60% 50% / 0.4)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="hidden lg:block relative rounded-2xl border-[0.75px] border-border p-2"
    >
      <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
      {/* Ambient glow */}
      <motion.div
        animate={{ opacity: hovered ? 0.35 : 0.15 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 rounded-2xl blur-[70px] -z-10"
        style={{ background: 'radial-gradient(circle, hsl(195 90% 55%) 0%, hsl(199 89% 48%) 100%)' }}
      />

      {/* Card body */}
      <div className="relative rounded-xl overflow-hidden"
          style={{
            background: 'rgba(6, 6, 18, 0.92)',
            backdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: hovered
              ? '0 0 0 1px rgba(99,102,241,0.3), 0 32px 64px rgba(0,0,0,0.6)'
              : '0 20px 40px rgba(0,0,0,0.4)',
          }}>

          {/* Top rainbow-gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent 0%, hsl(199 89% 48% / 0.8) 30%, hsl(270 70% 65% / 0.8) 70%, transparent 100%)' }} />

          {/* macOS title bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full transition-all duration-200 hover:brightness-125" style={{ backgroundColor: 'hsl(0 75% 56%)' }} />
              <div className="w-3 h-3 rounded-full transition-all duration-200 hover:brightness-125" style={{ backgroundColor: 'hsl(38 92% 55%)' }} />
              <div className="w-3 h-3 rounded-full transition-all duration-200 hover:brightness-125" style={{ backgroundColor: 'hsl(135 55% 45%)' }} />
            </div>
            <span className="text-[10px] text-muted-foreground/35 font-mono tracking-wide">kartikeya.profile.ts</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#4ade80' }} />
              <span className="text-[9px] text-muted-foreground/30 font-mono">LIVE</span>
            </div>
          </div>

          {/* Code body with line numbers — typewriter */}
          <div className="flex font-mono text-xs leading-7">
            {/* Line numbers */}
            <div className="flex flex-col items-end px-3 py-4 border-r border-white/[0.05] select-none shrink-0"
              style={{ background: 'rgba(0,0,0,0.2)', minWidth: '36px' }}>
              {CODE_LINES.map((_, i) => (
                <span key={i} className="text-muted-foreground/20 text-[10px] leading-7">{i + 1}</span>
              ))}
            </div>
            {/* Code content — typewriter */}
            <div className="flex flex-col py-4 px-4 flex-1 overflow-hidden">
              {typedLines.map((raw, i) => (
                <div key={i} className="leading-7">{highlight(raw)}</div>
              ))}
              {currentLine < CODE_LINES.length && (
                <div className="leading-7 flex items-center">
                  <span className="text-muted-foreground/70 whitespace-pre">
                    {CODE_LINES[currentLine].raw.slice(0, currentChar)}
                  </span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.55, repeat: Infinity }}
                    className="inline-block w-[2px] h-[13px] rounded-sm bg-sky-400 ml-[1px] shrink-0"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Build terminal output */}
          <div className="border-t border-white/[0.05] px-4 py-3"
            style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-emerald-400 text-xs">▶</span>
              <span className="text-muted-foreground/40 text-[11px] font-mono">npm run</span>
              <span className="text-cyan-300 text-[11px] font-mono">build-future</span>
            </div>
            <div className="flex flex-col gap-0.5">
              {buildLines.slice(0, buildStep).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-[10px] font-mono"
                  style={{ color: line.color }}
                >
                  {line.text}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Status bar */}
          <div className="px-4 py-1.5 border-t border-white/[0.04] flex items-center justify-between"
            style={{ background: 'rgba(255,255,255,0.01)' }}>
            <span className="text-[9px] text-muted-foreground/25 font-mono">TypeScript</span>
            <span className="text-[9px] text-muted-foreground/25 font-mono">UTF-8 · 42 lines</span>
          </div>
        </div>

      {/* Floating badges */}
      {floatingBadges.map((b) => (
        <motion.div
          key={b.label}
          animate={{ y: b.animY as number[] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
          className={`absolute ${b.top} px-3 py-1.5 rounded-full text-[10px] font-bold border backdrop-blur-md z-10`}
          style={{ background: 'rgba(6,6,18,0.92)', borderColor: b.border, color: b.color, right: b.right?.includes('right') ? undefined : undefined, [b.right?.includes('left') ? 'left' : 'right']: b.right?.includes('left') ? '-1.25rem' : '-2rem' }}
        >
          {b.label}
        </motion.div>
      ))}
    </motion.div>
  );
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
        <section className="min-h-screen flex items-center justify-center relative z-10 overflow-hidden">

          {/* Background */}
          <div className="absolute inset-0">
            <AuroraBackground />
            <div className="absolute inset-0 z-[1] bg-black/55" />
          </div>
          {/* Dot grid */}
          <div className="absolute inset-0 z-[2] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }} />

          {/* Left vertical social bar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-4"
          >
            {[
              { href: 'mailto:kartikeyaa15@gmail.com', icon: Mail, label: 'Email' },
              { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
              { href: 'https://github.com', icon: Github, label: 'GitHub' },
            ].map(({ href, icon: Icon, label }) => (
              <motion.a
                key={label}
                href={href}
                title={label}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2 }}
                className="p-2 rounded-lg text-muted-foreground/60 hover:text-primary transition-colors duration-200"
              >
                <Icon size={18} />
              </motion.a>
            ))}
            <div className="w-px h-12 bg-gradient-to-b from-primary/40 to-transparent mt-1" />
          </motion.div>

          {/* Main grid */}
          <div className="section-container relative z-10 pt-24 pb-12">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* ─── LEFT: Content ─── */}
              <div className="text-left">

                {/* Availability badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
                  style={{ background: 'hsl(187 100% 55% / 0.08)', border: '1px solid hsl(187 100% 55% / 0.2)' }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: 'hsl(187 100% 55%)' }} />
                    <span className="relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: 'hsl(187 100% 55%)' }} />
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.18em] uppercase"
                    style={{ color: 'hsl(187 100% 55%)' }}>
                    Available for Work
                  </span>
                </motion.div>

                {/* Name */}
                <div className="mb-4 overflow-hidden group w-fit">
                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-xs font-bold tracking-[0.3em] uppercase text-muted-foreground/50 mb-2"
                  >
                    Hello, I'm
                  </motion.p>
                  <motion.h1
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-tight tracking-tight pb-4"
                  >
                    <span 
                      className="block transition-all duration-300 group-hover:drop-shadow-[0_0_24px_rgba(56,189,248,0.7)] group-hover:text-shadow-[0_0_60px_rgba(56,189,248,0.35),0_0_120px_rgba(56,189,248,0.15)] pb-2" 
                      style={{ color: '#38bdf8' }}
                    >
                      B Venkata Sai
                    </span>
                    <span className="text-foreground block">Kartikeya</span>
                  </motion.h1>
                </div>

                {/* Animated role */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="flex items-center gap-2 mb-5"
                >
                  <span className="text-muted-foreground/40 text-base">—</span>
                  <RotatingRole />
                </motion.div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="text-muted-foreground/75 text-sm leading-relaxed mb-8 max-w-md"
                >
                  CS undergraduate specializing in full-stack development,
                  machine learning, and IoT systems. I build things that are fast, smart, and purposeful.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="flex items-center gap-3 flex-wrap"
                >
                  <Link
                    to="/projects"
                    className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_28px_hsl(199_89%_48%/0.5)] hover:scale-[1.03]"
                    style={{ background: 'linear-gradient(135deg, hsl(199 89% 48%), hsl(195 90% 55%))' }}
                  >
                    <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    View Projects <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="https://res.cloudinary.com/dvf0ugwrr/image/upload/fl_attachment/v1773757669/kartikeyaa-Resume_khl64p.pdf"
                    download="Kartikeya_Resume.pdf"
                    className="group flex-1 flex items-center justify-center gap-2 glass-button px-6 py-3.5 rounded-xl font-heading font-semibold text-sm transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg, hsl(199 89% 48% / 0.1), hsl(195 90% 55% / 0.1))', color: 'hsl(199 89% 60%)' }}
                  >
                    <Download size={15} className="group-hover:-translate-y-0.5 transition-transform" /> Resume
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border transition-all duration-300 hover:border-primary/40 hover:text-primary"
                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: 'hsl(210 10% 65%)' }}
                  >
                    <Mail size={15} /> Hire Me
                  </Link>
                </motion.div>
              </div>

              {/* ─── RIGHT: MacBook-style code card with 3D tilt ─── */}
              <CodeCard />
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-5 h-9 rounded-full border border-muted-foreground/20 flex items-start justify-center p-1.5"
            >
              <motion.div className="w-1 h-1 rounded-full bg-primary" />
            </motion.div>
          </motion.div>
        </section>

        {/* ─── TECH STACK STRIP ─── */}
        <section className="relative py-8 border-y border-border/30 overflow-hidden bg-card/20 backdrop-blur-sm flex">
          {/* Fading edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Scrolling belt */}
          <div className="flex w-fit animate-marquee hover:[animation-play-state:paused]">
            {/* Render a few sets to ensure it fills the screen and loops smoothly */}
            {[1, 2, 3].map((set) => (
              <div key={set} className="flex flex-nowrap items-center justify-around gap-12 md:gap-20 px-6 md:px-10 shrink-0">
                {techStack.map((tech, i) => (
                  <div
                    key={`${set}-${tech.name}-${i}`}
                    className="flex items-center gap-3 hover:scale-110 transition-all duration-300 cursor-pointer"
                  >
                    <img src={tech.icon} alt={tech.name} className={`w-8 h-8 object-contain drop-shadow-md transition-all ${(tech.name === "GitHub" || tech.name === "Express") ? "invert brightness-0 hover:invert-0 hover:brightness-100" : ""}`} />
                    <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ─── FEATURED PROJECTS ─── */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          {/* Ambient background glow (Removed due to overlap issues) */}

          <div className="section-container !py-0 relative z-10">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-primary/60" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary/80">Selected Work</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
                <span className="gradient-text">Featured</span>{' '}
                <span className="text-foreground">Projects</span>
              </h2>
              <p className="text-muted-foreground mt-3 text-base max-w-md">
                A curated selection of projects that showcase my range — from full-stack platforms to AI systems.
              </p>
            </motion.div>

            {/* Project cards — staggered left-large / right-small layout */}
            <div className="space-y-6">
              {featuredProjects.map((project, i) => {
                const techColors: Record<string, string> = {
                  React: 'hsl(199,89%,48%)', 'Node.js': 'hsl(120,50%,45%)', MongoDB: 'hsl(120,60%,35%)',
                  Python: 'hsl(210,60%,50%)', TensorFlow: 'hsl(30,90%,50%)', LSTM: 'hsl(270,70%,60%)',
                  NLP: 'hsl(300,60%,55%)', 'Tailwind CSS': 'hsl(187,100%,42%)', Vercel: 'hsl(0,0%,80%)',
                  Express: 'hsl(50,10%,55%)', 'Cloud Storage': 'hsl(220,80%,60%)',
                };
                const highlights = [
                  { label: 'Multi-tenant', value: 'SaaS Platform' },
                  { label: '50+ DAU', value: 'Active Users' },
                  { label: '82%', value: 'Model Accuracy' },
                ];
                const isEven = i % 2 === 0;
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: i * 0.12 }}
                    className="group relative rounded-2xl border-[0.75px] border-border p-2"
                  >
                    <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
                    <div className="relative glass-card border border-white/5 rounded-xl overflow-hidden
                      hover:border-primary/25 transition-all duration-500
                      hover:shadow-[0_0_40px_-8px_hsl(250_84%_66%/0.3)]">

                      {/* Hover gradient overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
                        style={{ background: 'linear-gradient(135deg, hsl(195 90% 55% / 0.04) 0%, hsl(195 80% 46% / 0.04) 100%)' }} />

                      <div className="relative z-10 p-7 md:p-8 flex flex-col md:flex-row md:items-start gap-6">
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Category pill + title row */}
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <span className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full mb-2"
                                style={{ background: 'hsl(195 90% 55% / 0.12)', color: 'hsl(195 90% 80%)' }}>
                                {project.subtitle}
                              </span>
                              <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                                {project.title}
                              </h3>
                            </div>
                            {/* Links */}
                            <div className="flex gap-2 shrink-0 pt-1">
                              {project.github && (
                                <a href={project.github}
                                  className="p-2 rounded-lg glass-card border border-white/5 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
                                  title="GitHub">
                                  <Github size={15} />
                                </a>
                              )}
                              {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer"
                                  className="p-2 rounded-lg glass-card border border-white/5 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
                                  title="Live Demo">
                                  <ExternalLink size={15} />
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2">
                            {project.description[0]}
                          </p>

                          {/* Bottom row: tech tags + highlight stat */}
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            {/* Tech tags with colored dots */}
                            <div className="flex flex-wrap gap-2">
                              {project.tech.slice(0, 4).map((t) => (
                                <span key={t}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-white/6"
                                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                                  <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ backgroundColor: techColors[t] ?? 'hsl(195 90% 55%)' }} />
                                  <span className="text-muted-foreground">{t}</span>
                                </span>
                              ))}
                            </div>

                            {/* Highlight stat */}
                            {highlights[i] && (
                              <div className="flex items-baseline gap-1.5 shrink-0">
                                <span className="text-xl font-bold font-heading gradient-text">{highlights[i].value}</span>
                                <span className="text-xs text-muted-foreground/70">{highlights[i].label}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom progress line — fills on hover */}
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 rounded-b-2xl"
                        style={{ background: 'linear-gradient(90deg, hsl(195 90% 55%), hsl(195 80% 46%))' }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA strip */}
            <div className="mt-12 relative rounded-2xl border-[0.75px] border-border p-2">
              <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative flex items-center justify-between gap-4 p-5 rounded-xl border border-white/5"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div>
                <p className="text-sm font-semibold text-foreground">Want to see more?</p>
                <p className="text-xs text-muted-foreground">Explore the full project archive including IoT, research, and open-source work.</p>
              </div>
              <Link
                to="/projects"
                className="group shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                View All Projects <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            </div>
          </div>
        </section>


        {/* ─── SKILLS PREVIEW ─── */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          {/* Ambient background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-card/10" />
            <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full opacity-8 blur-3xl"
              style={{ background: 'radial-gradient(circle, hsl(187 100% 55% / 0.12) 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full opacity-8 blur-3xl"
              style={{ background: 'radial-gradient(circle, hsl(195 90% 55% / 0.1) 0%, transparent 70%)' }} />
          </div>

          <div className="section-container !py-0 relative z-10">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-primary/60" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary/80">My Toolkit</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
                <span className="gradient-text">Skills</span>{' '}
                <span className="text-foreground">&amp; Technologies</span>
              </h2>
              <p className="text-muted-foreground mt-3 text-base max-w-md">
                A snapshot of the tools and technologies I work with across the full stack.
              </p>
            </motion.div>

            {/* Category cards — 2-col on md, 4-col on lg */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(() => {
                const categoryMeta: Record<string, { icon: string; color: string; skillColors: Record<string, string> }> = {
                  Frontend: {
                    icon: '⬡',
                    color: 'hsl(199 89% 48%)',
                    skillColors: { React: 'hsl(199,89%,48%)', TypeScript: 'hsl(220,90%,60%)', 'Tailwind CSS': 'hsl(187,100%,42%)' },
                  },
                  Backend: {
                    icon: '⚙',
                    color: 'hsl(120 50% 45%)',
                    skillColors: { 'Node.js': 'hsl(120,50%,45%)', Express: 'hsl(50,10%,55%)', MongoDB: 'hsl(120,60%,35%)' },
                  },
                  'AI/ML': {
                    icon: '◈',
                    color: 'hsl(270 70% 60%)',
                    skillColors: { Python: 'hsl(210,60%,50%)', TensorFlow: 'hsl(30,90%,50%)', NLP: 'hsl(300,60%,55%)' },
                  },
                  DevOps: {
                    icon: '▲',
                    color: 'hsl(187 100% 55%)',
                    skillColors: { Docker: 'hsl(210,80%,55%)', Git: 'hsl(14,90%,55%)', 'CI/CD': 'hsl(187,100%,42%)' },
                  },
                };
                return skillsPreview.map((cat, i) => {
                  const meta = categoryMeta[cat.category] ?? { icon: '◉', color: 'hsl(195 90% 55%)', skillColors: {} };
                  return (
                    <motion.div
                      key={cat.category}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: i * 0.1 }}
                      className="relative rounded-2xl border-[0.75px] border-border p-2"
                    >
                      <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
                      <div className="group relative glass-card rounded-xl overflow-hidden border border-white/5
                        hover:border-primary/25 transition-all duration-500
                        hover:shadow-[0_0_30px_-8px_hsl(250_84%_66%/0.25)]">
                        {/* Hover gradient overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
                          style={{ background: `linear-gradient(135deg, ${meta.color}08 0%, transparent 100%)` }} />

                        <div className="relative z-10 p-5">
                          {/* Icon + category */}
                          <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                              style={{ background: `${meta.color}18`, color: meta.color }}>
                              {meta.icon}
                            </div>
                            <span className="text-[10px] font-bold tracking-[0.18em] uppercase"
                              style={{ color: meta.color }}>
                              {cat.category}
                            </span>
                          </div>

                          {/* Skill tags with colored dots */}
                          <div className="flex flex-wrap gap-2">
                            {cat.skills.map((skill) => (
                              <span key={skill}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-white/6"
                                style={{ background: 'rgba(255,255,255,0.04)' }}>
                                <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{ backgroundColor: meta.skillColors[skill] ?? meta.color }} />
                                <span className="text-muted-foreground">{skill}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Bottom accent bar */}
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 rounded-b-xl"
                          style={{ background: `linear-gradient(90deg, ${meta.color}, transparent)` }} />
                      </div>
                    </motion.div>
                  );
                });
              })()}
            </div>

            {/* CTA strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex items-center justify-between gap-4 p-5 rounded-2xl border border-white/5"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div>
                <p className="text-sm font-semibold text-foreground">Curious about the full stack?</p>
                <p className="text-xs text-muted-foreground">Dive into detailed proficiency levels and tooling across every domain.</p>
              </div>
              <Link
                to="/skills"
                className="group shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                See All Skills <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ─── EXPERIENCE HIGHLIGHTS ─── */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl"
              style={{ background: 'radial-gradient(circle, hsl(195 90% 55% / 0.1) 0%, transparent 70%)' }} />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-8 blur-3xl"
              style={{ background: 'radial-gradient(circle, hsl(187 100% 55% / 0.1) 0%, transparent 70%)' }} />
          </div>

          <div className="section-container !py-0 relative z-10">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-primary/60" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary/80">Professional Journey</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
                <span className="gradient-text">Experience</span>{' '}
                <span className="text-foreground">Highlights</span>
              </h2>
              <p className="text-muted-foreground mt-3 text-base max-w-md">
                Internships where I shipped real features and drove measurable impact.
              </p>
            </motion.div>

            {/* Experience cards */}
            <div className="space-y-5 max-w-3xl">
              {experiences.map((exp, i) => {
                const colors = [
                  { accent: 'hsl(195 90% 55%)', glow: 'hsl(195 90% 55% / 0.15)' },
                  { accent: 'hsl(187 100% 55%)', glow: 'hsl(187 100% 55% / 0.12)' },
                ];
                const c = colors[i % colors.length];
                return (
                  <motion.div
                    key={exp.company}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: i * 0.12 }}
                  className="relative rounded-2xl border-[0.75px] border-border p-2"
                  >
                    <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
                    <div className="group relative glass-card rounded-xl overflow-hidden border border-white/5
                      hover:border-primary/25 transition-all duration-500
                      hover:shadow-[0_0_35px_-8px_hsl(250_84%_66%/0.25)]">
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                      style={{ background: `linear-gradient(135deg, ${c.glow} 0%, transparent 100%)` }} />

                    <div className="relative z-10 p-6 md:p-7 flex items-start gap-5">
                      {/* Index + icon stack */}
                      <div className="shrink-0 flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: `${c.accent}18` }}>
                          <Briefcase size={18} style={{ color: c.accent }} />
                        </div>
                        <span className="text-[10px] font-black font-heading text-muted-foreground/40 select-none">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                            {exp.company}
                          </h3>
                          {/* Role badge */}
                          <span className="shrink-0 text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full hidden sm:inline-block"
                            style={{ background: `${c.accent}15`, color: c.accent }}>
                            Intern
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{exp.role}</p>

                        {/* Impact highlight chip */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                          style={{ background: 'hsl(187 100% 55% / 0.08)', border: '1px solid hsl(187 100% 55% / 0.15)' }}>
                          <span className="text-xs font-bold" style={{ color: 'hsl(187 100% 55%)' }}>↗</span>
                          <span className="text-xs font-medium text-muted-foreground">{exp.highlight}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 rounded-b-2xl"
                      style={{ background: `linear-gradient(90deg, ${c.accent}, transparent)` }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 max-w-3xl flex items-center justify-between gap-4 p-5 rounded-2xl border border-white/5"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div>
                <p className="text-sm font-semibold text-foreground">Want the full picture?</p>
                <p className="text-xs text-muted-foreground">See detailed timelines, responsibilities, and all projects delivered.</p>
              </div>
              <Link
                to="/experience"
                className="group shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                View Full Experience <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ─── CALL TO ACTION ─── */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[120px] opacity-[0.07]"
              style={{ background: 'radial-gradient(circle, hsl(195 90% 55%) 0%, hsl(199 89% 48%) 60%, transparent 100%)' }} />
          </div>

          <div className="section-container !py-0 relative z-10 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-2xl"
            >
              {/* Main glass card */}
              <div className="relative rounded-3xl overflow-hidden border border-white/8 text-center"
                style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(16px)' }}>

                {/* Top gradient line */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                  style={{ background: 'linear-gradient(90deg, transparent 0%, hsl(199 89% 48% / 0.8) 40%, hsl(195 90% 55% / 0.8) 60%, transparent 100%)' }} />

                <div className="px-8 py-12 md:px-14 md:py-14">
                  {/* Status badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
                    style={{ background: 'hsl(187 100% 55% / 0.08)', border: '1px solid hsl(187 100% 55% / 0.2)' }}>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ backgroundColor: 'hsl(187 100% 55%)' }} />
                      <span className="relative inline-flex rounded-full h-2 w-2"
                        style={{ backgroundColor: 'hsl(187 100% 55%)' }} />
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase"
                      style={{ color: 'hsl(187 100% 55%)' }}>
                      Available for Work
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 className="text-3xl md:text-5xl font-heading font-black leading-tight mb-4">
                    <span className="text-foreground">Let's Build</span>
                    <br />
                    <span className="bg-clip-text text-transparent"
                      style={{ backgroundImage: 'linear-gradient(135deg, hsl(199 89% 48%), hsl(195 90% 55%))' }}>
                      Something Great
                    </span>
                  </h2>

                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md mx-auto mb-10">
                    Open to full-time roles, freelance projects, and interesting collaborations.
                    Let's connect.
                  </p>

                  {/* Divider */}
                  <div className="h-px mb-8"
                    style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--border) / 0.5), transparent)' }} />

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                    <Link
                      to="/contact"
                      className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_0_25px_hsl(199_89%_48%/0.4)]"
                      style={{ background: 'linear-gradient(135deg, hsl(199 89% 48%), hsl(195 90% 55%))' }}
                    >
                      Get In Touch <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a
                      href="mailto:kartikeyaa15@gmail.com"
                      className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-muted-foreground border border-white/10 hover:border-primary/40 hover:text-primary transition-all duration-300"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      <Mail size={15} /> kartikeyaa15@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
