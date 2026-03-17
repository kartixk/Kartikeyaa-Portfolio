import { motion, Variants } from 'framer-motion';
import {
  User, MapPin, Mail, Phone, Github, Linkedin,
  Globe, Cpu, Server, GraduationCap, Briefcase, Code2, Rocket,
  ArrowRight,
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const timeline = [
  { year: '2025', title: 'Software Engineer Intern', description: 'Interned at NTPC Limited & Zenith-Zap — shipped features used by real users.', icon: Briefcase },
  { year: '2025', title: 'AI-ML Virtual Internship', description: 'Explored ML foundations & NLP through EduSkills virtual internship.', icon: Code2 },
  { year: '2024', title: 'MERN Full Stack Training', description: 'Intensive training at XceedIQ Innovate360 — built production-ready apps end to end.', icon: Code2 },
  { year: '2022', title: 'Started B.Tech · GITAM University', description: 'Computer Science Engineering specializing in IoT.', icon: GraduationCap },
  { year: '2020', title: 'Senior Secondary', description: 'Sri Chaitanya Junior College — PCM. Developed a strong interest in computing.', icon: GraduationCap },
];

const specializations = [
  { label: 'MERN Stack Development', icon: Globe },
  { label: 'API & Backend Engineering', icon: Server },
  { label: 'IoT & Real‑time Systems', icon: Cpu },
  { label: 'Clean, Usable Interfaces', icon: Code2 },
];

const interests = [
  { title: 'Web Development', description: 'Building modern, responsive web applications with React and Node.js', icon: Globe },
  { title: 'IoT Systems', description: 'Developing real-time sensor monitoring and data acquisition systems', icon: Cpu },
  { title: 'Scalable Systems', description: 'Designing multi-tenant architectures and optimized backend services', icon: Rocket },
  { title: 'Learning AI / ML', description: 'Exploring ML concepts through internships and personal projects', icon: Code2 },
];

const softSkills = ['Problem Solving', 'Team Collaboration', 'Time Management', 'Adaptability'];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

const About = () => {
  return (
    <PageTransition>
      <div className="min-h-screen gradient-bg">

        {/* ── HERO STRIP ── */}
        <div className="relative pt-32 pb-20 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-25 blur-[120px]"
              style={{ background: 'radial-gradient(ellipse, hsl(var(--primary)) 0%, transparent 70%)' }}
            />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-primary/60" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">About Me</span>
            </motion.div>

            <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-end">
              <div>
                <motion.h1
                  variants={fadeUp} custom={1} initial="hidden" animate="show"
                  className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] mb-6"
                >
                  <span className="gradient-text">Crafting</span>{' '}
                  <span className="text-foreground">reliable</span>
                  <br />
                  <span className="text-foreground">software</span>{' '}
                  <span className="gradient-text italic">from scratch.</span>
                </motion.h1>
                <motion.p
                  variants={fadeUp} custom={2} initial="hidden" animate="show"
                  className="text-muted-foreground text-lg max-w-2xl leading-relaxed"
                >
                  Computer Science undergraduate at GITAM University. I turn ideas into
                  production-ready applications — MERN stack first, clean architecture always.
                </motion.p>
              </div>

              <motion.div
                variants={fadeUp} custom={3} initial="hidden" animate="show"
                className="flex flex-row lg:flex-col gap-3"
              >
                {[
                  { value: '2+', label: 'Internships' },
                  { value: '4+', label: 'Projects' },
                  { value: '82%', label: 'ML Accuracy' },
                ].map((s) => (
                  <div key={s.label} className="relative rounded-2xl border-[0.75px] border-border p-1">
                    <GlowingEffect spread={30} glow proximity={50} inactiveZone={0.01} borderWidth={2} />
                    <div className="glass-card px-5 py-3 text-center min-w-[96px] hover:border-primary/30 transition-colors duration-300 rounded-xl">
                      <p className="text-2xl font-heading font-bold gradient-text leading-none mb-0.5">{s.value}</p>
                      <p className="text-[11px] text-muted-foreground tracking-wider uppercase">{s.label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── INTRO CARDS ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
          <div className="grid md:grid-cols-5 gap-5">

            {/* Bio */}
            <motion.div
              variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="md:col-span-3 relative rounded-2xl border-[0.75px] border-border p-2"
            >
              <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
              <div className="relative glass-card glow-border p-8 group relative overflow-hidden rounded-xl">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                    <User className="text-primary" size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-foreground leading-tight">B Venkata Sai Kartikeya</h3>
                    <p className="text-xs text-primary font-medium tracking-wide mt-0.5">Full Stack MERN Developer · IoT Enthusiast</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3 text-[15px]">
                  I enjoy taking ideas from a simple sketch to a reliable, production-ready application.
                  My recent work lives in the MERN stack and real-time IoT monitoring systems.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-7 text-[15px]">
                  I care about clear architecture, maintainable code, and smooth user experiences
                  more than chasing every new buzzword.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-border/50 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-all duration-300">
                    <Github size={15} /> GitHub
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-sm font-medium text-primary hover:bg-primary/20 transition-all duration-300">
                    <Linkedin size={15} /> LinkedIn
                  </a>
                  <a href="mailto:kartikeyaa15@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-border/50 text-sm font-medium text-foreground hover:border-accent/50 hover:text-accent transition-all duration-300">
                    <Mail size={15} /> Email
                  </a>
                </div>
              </div>
              </div>
            </motion.div>

            {/* Info + soft skills */}
            <motion.div
              variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="md:col-span-2 flex flex-col gap-5"
            >
              <div className="relative rounded-2xl border-[0.75px] border-border p-2">
                <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
                <div className="relative glass-card glow-border p-6 flex-1 rounded-xl">
                <h3 className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-5">Quick Info</h3>
                <div className="space-y-3.5">
                  {[
                    { Icon: MapPin, text: 'Visakhapatnam, India' },
                    { Icon: Mail, text: 'kartikeyaa15@gmail.com' },
                    { Icon: Phone, text: '+91-8250977949' },
                    { Icon: GraduationCap, text: 'GITAM University · B.Tech CSE' },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex items-start gap-3">
                      <div className="mt-0.5 w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="text-primary" size={13} />
                      </div>
                      <span className="text-sm text-muted-foreground leading-snug">{text}</span>
                    </div>
                  ))}
                </div>
                </div>
              </div>
              <div className="relative rounded-2xl border-[0.75px] border-border p-2">
                <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
                <div className="relative glass-card p-6 rounded-xl">
                <h3 className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-4">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {softSkills.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors cursor-default">
                      {s}
                    </span>
                  ))}
                </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── SPECIALIZATIONS ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex items-center gap-4 mb-10">
            <span className="h-px flex-1 bg-border/60" />
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">What I Specialize In</h2>
            <span className="h-px flex-1 bg-border/60" />
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {specializations.map(({ label, icon: Icon }, i) => (
              <motion.div
                key={label}
                variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="relative rounded-2xl border-[0.75px] border-border p-2"
              >
                <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="relative glass-card p-6 text-center group cursor-default overflow-hidden hover:border-primary/40 transition-all duration-300 rounded-xl"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <div className="relative z-10">
                    <div className="mx-auto mb-4 w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300">
                      <Icon className="text-primary" size={20} />
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-snug">{label}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex items-center gap-4 mb-14">
            <span className="h-px flex-1 bg-border/60" />
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">My Journey</h2>
            <span className="h-px flex-1 bg-border/60" />
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border/60 to-transparent" />

            {timeline.map((item, i) => {
              const Icon = item.icon;
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
                  className={`relative flex items-start mb-10 md:mb-14 pl-14 md:pl-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Mobile dot */}
                  <div className="md:hidden absolute left-3.5 top-3.5 w-3 h-3 rounded-full border-2 border-primary bg-background z-10" />
                  {/* Desktop dot */}
                  <div className="hidden md:flex absolute left-1/2 top-4 -translate-x-1/2 z-10 items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)]">
                    <Icon className="text-primary" size={14} />
                  </div>
                  {/* Card */}
                  <div className={`md:w-[calc(50%-2.5rem)] ${isLeft ? 'md:mr-auto md:pr-6' : 'md:ml-auto md:pl-6'}`}>
                    <div className="relative rounded-2xl border-[0.75px] border-border p-1.5">
                      <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="relative glass-card p-5 hover:border-primary/30 hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)] transition-all duration-300 rounded-xl"
                      >
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-primary/10 text-primary border border-primary/20 mb-2">
                          {item.year}
                        </span>
                        <h4 className="font-heading font-semibold text-foreground text-sm mb-1.5 leading-snug">{item.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── INTERESTS ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex items-center gap-4 mb-10">
            <span className="h-px flex-1 bg-border/60" />
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">Areas of Interest</h2>
            <span className="h-px flex-1 bg-border/60" />
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {interests.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }}
                  className="relative rounded-2xl border-[0.75px] border-border p-2"
                >
                  <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="relative glass-card glow-border p-7 group cursor-default overflow-hidden rounded-xl"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
                    <div className="relative z-10 flex items-start gap-4">
                      <div className="shrink-0 w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:scale-110">
                        <Icon className="text-primary" size={20} />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{item.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA strip */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="mt-14 relative rounded-2xl border-[0.75px] border-border p-2"
          >
            <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
            <div className="relative glass-card glow-border p-8 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-xl">
            <div>
              <p className="text-lg font-heading font-semibold text-foreground mb-1">Want to build something together?</p>
              <p className="text-sm text-muted-foreground">I'm open to full-time roles and interesting collaborations.</p>
            </div>
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-[0_0_28px_hsl(var(--primary)/0.4)] transition-all duration-300 hover:scale-105 shrink-0"
            >
              Get In Touch <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            </div>
          </motion.div>
        </section>

      </div>
    </PageTransition>
  );
};

export default About;