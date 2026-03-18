import { motion, Variants } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, Award, BookOpen, ArrowRight } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const education = [
  {
    school: 'GITAM University',
    degree: 'B.Tech in Computer Science (IoT)',
    period: 'Aug 2022 – Present',
    location: 'Visakhapatnam, India',
    grade: 'CGPA: 7.03 / 10.00',
    status: 'Ongoing',
    highlights: [
      'Specialization in Internet of Things (IoT)',
      'Relevant coursework: Data Structures, DBMS, Computer Networks, ML Fundamentals',
      'Active participant in tech clubs and hackathons',
    ],
    color: 'primary',
  },
  {
    school: 'Sri Chaitanya Junior College',
    degree: 'Senior Secondary (PCM)',
    period: '2020 – 2022',
    location: 'Visakhapatnam, India',
    grade: 'Percentage: 85%',
    status: 'Completed',
    highlights: [
      'Physics, Chemistry, Mathematics (PCM)',
      'Developed a strong foundation in analytical thinking',
      'First exposure to programming and computing concepts',
    ],
    color: 'accent',
  },
];

const certifications = [
  { title: 'MERN Full Stack Training', issuer: 'XceedIQ Innovate360', year: '2024', icon: BookOpen },
  { title: 'AI-ML Virtual Internship', issuer: 'EduSkills Foundation', year: '2025', icon: Award },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

const Education = () => {
  return (
    <PageTransition>
      <div className="min-h-screen gradient-bg">

        {/* ── HERO STRIP ── */}
        <div className="relative pt-32 pb-16 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[360px] rounded-full opacity-20 blur-[120px]"
              style={{ background: 'radial-gradient(ellipse, hsl(var(--primary)) 0%, transparent 70%)' }}
            />
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-primary/60" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Education</span>
            </motion.div>
            <motion.h1
              variants={fadeUp} custom={1} initial="hidden" animate="show"
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-5"
            >
              <span className="text-foreground">Academic</span>
              <br />
              <span className="gradient-text italic pb-2 pr-2">journey.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp} custom={2} initial="hidden" animate="show"
              className="text-muted-foreground text-lg max-w-xl leading-relaxed"
            >
              Building a strong foundation in Computer Science — from core fundamentals
              to specialized IoT systems and modern web development.
            </motion.p>
          </div>
        </div>

        {/* ── EDUCATION CARDS ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex items-center gap-4 mb-12">
            <span className="h-px flex-1 bg-border/60" />
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">Qualifications</h2>
            <span className="h-px flex-1 bg-border/60" />
          </motion.div>

          <div className="space-y-6">
            {education.map((edu, i) => (
              <motion.div
                key={edu.school}
                variants={fadeUp} custom={i}
                initial="hidden" whileInView="show" viewport={{ once: true }}
                className="relative rounded-2xl border-[0.75px] border-border p-2 md:p-3"
              >
                <GlowingEffect spread={50} glow disabled={false} proximity={80} inactiveZone={0.01} borderWidth={2} />

                <motion.div
                  whileHover={{ y: -3 }}
                  className="relative glass-card glow-border rounded-xl overflow-hidden"
                >
                  {/* Top accent bar */}
                  <div className={`h-0.5 w-full bg-gradient-to-r ${edu.color === 'primary'
                    ? 'from-primary via-secondary to-transparent'
                    : 'from-accent via-primary to-transparent'
                    }`} />

                  <div className="p-7 md:p-9">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">

                      {/* Icon + status */}
                      <div className="flex lg:flex-col items-center lg:items-center gap-4 lg:gap-3 shrink-0">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${edu.color === 'primary'
                          ? 'bg-primary/10 border-primary/25'
                          : 'bg-accent/10 border-accent/25'
                          }`}>
                          <GraduationCap
                            className={edu.color === 'primary' ? 'text-primary' : 'text-accent'}
                            size={26}
                          />
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${edu.status === 'Ongoing'
                          ? 'bg-accent/10 border-accent/25 text-accent'
                          : 'bg-primary/10 border-primary/25 text-primary'
                          }`}>
                          {edu.status}
                        </span>
                      </div>

                      {/* Main content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <div>
                            <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground leading-tight mb-1">
                              {edu.school}
                            </h3>
                            <p className="text-sm text-muted-foreground font-medium">{edu.degree}</p>
                          </div>

                          {/* Grade badge */}
                          <div className="shrink-0">
                            <div className={`glass-card px-4 py-2.5 rounded-xl border text-center ${edu.color === 'primary' ? 'border-primary/25' : 'border-accent/25'
                              }`}>
                              <p className={`text-lg font-heading font-bold leading-none ${edu.color === 'primary' ? 'gradient-text' : 'text-accent'
                                }`}>
                                {edu.grade.split(': ')[1]}
                              </p>
                              <p className="text-[10px] text-muted-foreground tracking-wider uppercase mt-0.5">
                                {edu.grade.split(': ')[0]}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-4 mb-5">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar size={12} className="text-primary/70" />
                            {edu.period}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin size={12} className="text-primary/70" />
                            {edu.location}
                          </div>
                        </div>

                        {/* Highlights */}
                        <div className="space-y-2">
                          {edu.highlights.map((point) => (
                            <div key={point} className="flex items-start gap-2.5">
                              <ArrowRight size={12} className="text-primary/60 mt-0.5 shrink-0" />
                              <span className="text-sm text-muted-foreground leading-snug">{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CERTIFICATIONS ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex items-center gap-4 mb-10">
            <span className="h-px flex-1 bg-border/60" />
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">Certifications & Training</h2>
            <span className="h-px flex-1 bg-border/60" />
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {certifications.map(({ title, issuer, year, icon: Icon }, i) => (
              <motion.div
                key={title}
                variants={fadeUp} custom={i}
                initial="hidden" whileInView="show" viewport={{ once: true }}
                className="relative rounded-2xl border-[0.75px] border-border p-2"
              >
                <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative glass-card p-6 group hover:border-primary/30 hover:shadow-[0_0_20px_hsl(var(--primary)/0.08)] transition-all duration-300 overflow-hidden rounded-xl"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-lg" />
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon className="text-primary" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-semibold text-foreground text-sm mb-1 leading-snug group-hover:text-primary transition-colors duration-300">
                        {title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">{issuer}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-primary/10 text-primary border border-primary/20">
                        {year}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default Education;