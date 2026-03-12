import { motion } from 'framer-motion';
import { User, MapPin, Mail, Phone, Github, Linkedin, Globe, Brain, Cpu, Server, GraduationCap, Briefcase, Code2, Rocket } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import SectionHeader from '@/components/SectionHeader';

const timeline = [
  {
    year: '2022',
    title: 'Started B.Tech at GITAM University',
    description: 'Began Computer Science journey specializing in IoT',
    icon: GraduationCap,
  },
  {
    year: '2024',
    title: 'MERN Full Stack Training',
    description: 'Completed intensive training at XceedIQ Innovate360',
    icon: Code2,
  },
  {
    year: '2025',
    title: 'Software Engineer Intern',
    description: 'Interned at NTPC Limited & Zenith-Zap',
    icon: Briefcase,
  },
  {
    year: '2025',
    title: 'AI-ML Virtual Internship',
    description: 'Deep learning & NLP projects with EduSkills',
    icon: Brain,
  },
];

const highlights = [
  { label: 'MERN Stack Development', icon: Globe, color: 'primary' },
  { label: 'Machine Learning Projects', icon: Brain, color: 'secondary' },
  { label: 'IoT Systems Development', icon: Cpu, color: 'accent' },
  { label: 'Scalable Full Stack Apps', icon: Server, color: 'primary' },
];

const interests = [
  {
    title: 'Web Development',
    description: 'Building modern, responsive web applications with React and Node.js',
    icon: Globe,
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    title: 'AI / Machine Learning',
    description: 'Creating intelligent models for sentiment analysis and classification',
    icon: Brain,
    gradient: 'from-secondary/20 to-secondary/5',
  },
  {
    title: 'IoT Systems',
    description: 'Developing real-time sensor monitoring and data acquisition systems',
    icon: Cpu,
    gradient: 'from-accent/20 to-accent/5',
  },
  {
    title: 'Scalable Systems',
    description: 'Designing multi-tenant architectures and optimized backend services',
    icon: Rocket,
    gradient: 'from-primary/20 to-accent/5',
  },
];

const About = () => {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 gradient-bg">
        {/* ─── INTRODUCTION ─── */}
        <div className="section-container">
          <SectionHeader title="About Me" subtitle="Get to know me better" />

          <div className="grid md:grid-cols-5 gap-8 mb-20">
            {/* Main intro */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-3 glass-card glow-border p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <User className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-foreground">B Venkata Sai Kartikeya</h3>
                  <p className="text-sm text-primary font-medium">Full Stack Developer & AI/ML Enthusiast</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Computer Science undergraduate at GITAM University specializing in software development,
                machine learning, and IoT systems. I thrive on building performant, scalable applications
                and exploring the intersection of web technologies and artificial intelligence.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                With hands-on experience in the MERN stack, Python-based ML models, and real-time IoT
                monitoring systems, I bring a versatile skill set to every project I undertake.
              </p>

              {/* Social buttons */}
              <div className="flex gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card border border-border/50 text-foreground font-medium hover:border-primary/50 hover:text-primary transition-all duration-300 hover:shadow-[0_0_15px_hsl(199_89%_48%/0.15)]"
                >
                  <Github size={18} /> GitHub
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary font-medium hover:bg-primary/20 transition-all duration-300 hover:shadow-[0_0_15px_hsl(199_89%_48%/0.2)]"
                >
                  <Linkedin size={18} /> LinkedIn
                </a>
              </div>
            </motion.div>

            {/* Quick info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-2 glass-card glow-border p-8 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-5">Quick Info</h3>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, text: 'Visakhapatnam, India' },
                    { icon: Mail, text: 'kartikeyaa15@gmail.com' },
                    { icon: Phone, text: '+91-8250977949' },
                    { icon: GraduationCap, text: 'GITAM University · B.Tech CSE' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <Icon className="text-primary shrink-0" size={17} />
                      <span className="text-sm text-muted-foreground">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-border/50">
                <h4 className="font-heading font-medium text-foreground mb-3 text-sm">Soft Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {['Problem Solving', 'Team Collaboration', 'Time Management', 'Adaptability'].map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ─── HIGHLIGHTS ─── */}
          <div className="mb-20">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl font-heading font-semibold text-foreground mb-6 text-center"
            >
              What I Specialize In
            </motion.h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {highlights.map((h, i) => {
                const Icon = h.icon;
                return (
                  <motion.div
                    key={h.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    whileHover={{ y: -4, scale: 1.03 }}
                    className="glass-card p-5 text-center hover:border-primary/40 transition-all duration-300 group"
                  >
                    <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="text-primary" size={20} />
                    </div>
                    <p className="text-sm font-medium text-foreground">{h.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ─── TIMELINE ─── */}
          <div className="mb-20">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl font-heading font-semibold text-foreground mb-8 text-center"
            >
              My Journey
            </motion.h3>
            <div className="relative max-w-3xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border/60 md:-translate-x-px" />

              {timeline.map((item, i) => {
                const Icon = item.icon;
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className={`relative flex items-start mb-10 md:mb-12 ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    } pl-16 md:pl-0`}
                  >
                    {/* Dot on line */}
                    <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>

                    {/* Card */}
                    <div className={`md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-0' : 'md:pl-0'}`}>
                      <div className="glass-card p-5 hover:border-primary/30 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="text-primary" size={16} />
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">{item.year}</span>
                        </div>
                        <h4 className="font-heading font-semibold text-foreground text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ─── INTERESTS ─── */}
          <div className="mb-8">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl font-heading font-semibold text-foreground mb-8 text-center"
            >
              Areas of Interest
            </motion.h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {interests.map((interest, i) => {
                const Icon = interest.icon;
                return (
                  <motion.div
                    key={interest.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="glass-card glow-border p-6 group cursor-default overflow-hidden relative"
                  >
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${interest.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Icon className="text-primary" size={22} />
                        </div>
                        <h4 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                          {interest.title}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{interest.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;
