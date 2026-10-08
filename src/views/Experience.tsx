import { Briefcase, MapPin, ArrowUpRight, Award, BookOpen } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import PageHeader from '@/components/PageHeader';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Reveal, TiltCard } from '@/components/fx';

const experiences = [
  {
    company: 'Spotmies LLP',
    role: 'Software Developer Intern',
    period: 'Dec 2025 – Present',
    location: 'Remote',
    accent: 'hsl(186 100% 52%)',
    points: [
      'Contributing to core development tasks across the product.',
      'Collaborating with the team to build and maintain scalable web applications.',
    ],
  },
  {
    company: 'NTPC Limited',
    role: 'Software Engineer Intern',
    period: 'May 2025',
    location: 'Visakhapatnam, India',
    accent: 'hsl(220 90% 62%)',
    points: [
      'Improved frontend usability of internal web tools, reducing user interaction time by 35%.',
      'Resolved UI defects through cross-team collaboration, decreasing reported issues by 20%.',
    ],
  },
  {
    company: 'Zenith-Zap',
    role: 'Software Engineer Intern',
    period: 'May 2025 – Jun 2025',
    location: 'Remote',
    accent: 'hsl(315 90% 62%)',
    points: [
      'Built responsive React interfaces, improving page load performance by 25%.',
      'Optimized API integration and state handling, reducing request latency by 15%.',
    ],
  },
];

const certifications = [
  { title: 'AI-ML Virtual Internship', org: 'EduSkills', period: 'Apr 2025 – Jun 2025', icon: Award },
  { title: 'MERN Full Stack Training', org: 'XceedIQ Innovate360', period: 'Jan 2024 – Jul 2024', icon: BookOpen },
];

const Experience = () => {
  return (
    <PageTransition>
      <div className="gradient-bg">
        <PageHeader
          eyebrow="Professional Journey"
          title={<><span className="text-foreground">Where I've</span> <span className="aurora-text">worked.</span></>}
          subtitle="Internships where I shipped real features, collaborated across teams, and drove measurable impact."
        />

        <section className="section-container !pt-4">
          {/* Timeline */}
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-2/60 via-brand-1/40 to-transparent" />
            {experiences.map((exp, i) => (
              <Reveal key={exp.company} delay={i * 0.08} direction="left" className="relative mb-7 pl-14">
                {/* node */}
                <span className="absolute left-0 top-1.5 grid h-10 w-10 place-items-center rounded-full border bg-background"
                  style={{ borderColor: `${exp.accent.replace(')', ' / 0.5)')}`, boxShadow: `0 0 16px ${exp.accent.replace(')', ' / 0.4)')}` }}>
                  <Briefcase size={16} style={{ color: exp.accent }} />
                </span>
                <div className="group relative rounded-3xl border-[0.75px] border-border p-2">
                  <GlowingEffect spread={44} glow disabled={false} proximity={70} inactiveZone={0.01} borderWidth={3} />
                  <TiltCard intensity={3} className="overflow-hidden rounded-2xl glass-panel p-7">
                    <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-display text-xl font-bold tracking-tight transition-colors group-hover:text-brand-2">{exp.company}</h3>
                      <span className="font-mono text-xs" style={{ color: exp.accent }}>{exp.period}</span>
                    </div>
                    <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground/80">{exp.role}</span>
                      <span className="inline-flex items-center gap-1"><MapPin size={12} className="text-brand-2/70" />{exp.location}</span>
                    </div>
                    <ul className="space-y-2">
                      {exp.points.map((p, j) => (
                        <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                          <ArrowUpRight size={14} className="mt-0.5 shrink-0" style={{ color: exp.accent }} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </TiltCard>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Certifications */}
          <Reveal className="mt-16 mb-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Certifications & Training</h2>
            <span className="h-px flex-1 bg-border" />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {certifications.map((cert, i) => {
              const Icon = cert.icon;
              return (
                <Reveal key={cert.title} delay={i * 0.08}>
                  <div className="group relative h-full rounded-3xl border-[0.75px] border-border p-2">
                    <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
                    <div className="relative flex h-full items-start gap-4 rounded-2xl glass-panel p-6">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-brand-1/20 bg-brand-1/10 transition-transform group-hover:scale-110">
                        <Icon className="text-brand-1" size={18} />
                      </div>
                      <div>
                        <h4 className="font-display font-bold leading-snug transition-colors group-hover:text-brand-2">{cert.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">{cert.org}</p>
                        <span className="mt-2 inline-flex rounded-full border border-brand-2/20 bg-brand-2/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-brand-2">
                          {cert.period}
                        </span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Experience;
