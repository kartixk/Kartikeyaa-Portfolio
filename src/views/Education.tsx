import { GraduationCap, MapPin, Calendar, Award, BookOpen, ArrowUpRight } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import PageHeader from '@/components/PageHeader';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Reveal, TiltCard } from '@/components/fx';

const education = [
  {
    school: 'GITAM University',
    degree: 'B.Tech in Computer Science (IoT)',
    period: 'Aug 2022 – Present',
    location: 'Visakhapatnam, India',
    grade: 'CGPA: 7.03 / 10.00',
    status: 'Ongoing',
    accent: 'hsl(186 100% 52%)',
    highlights: [
      'Specialization in Internet of Things (IoT)',
      'Coursework: Data Structures, DBMS, Computer Networks, ML Fundamentals',
      'Active participant in tech clubs and hackathons',
    ],
  },
  {
    school: 'Sri Chaitanya Junior College',
    degree: 'Senior Secondary (PCM)',
    period: '2020 – 2022',
    location: 'Visakhapatnam, India',
    grade: 'Percentage: 85%',
    status: 'Completed',
    accent: 'hsl(220 90% 62%)',
    highlights: [
      'Physics, Chemistry, Mathematics (PCM)',
      'Built a strong foundation in analytical thinking',
      'First exposure to programming and computing concepts',
    ],
  },
];

const certifications = [
  { title: 'MERN Full Stack Training', issuer: 'XceedIQ Innovate360', year: '2024', icon: BookOpen },
  { title: 'AI-ML Virtual Internship', issuer: 'EduSkills Foundation', year: '2025', icon: Award },
];

const Education = () => {
  return (
    <PageTransition>
      <div className="gradient-bg">
        <PageHeader
          eyebrow="Education"
          title={<><span className="text-foreground">Academic</span> <span className="aurora-text italic">journey.</span></>}
          subtitle="Building a strong foundation in Computer Science — from core fundamentals to specialized IoT systems."
        />

        <section className="section-container !pt-4">
          <div className="space-y-6">
            {education.map((edu, i) => (
              <Reveal key={edu.school} delay={i * 0.08}>
                <div className="group relative rounded-3xl border-[0.75px] border-border p-2">
                  <GlowingEffect spread={50} glow disabled={false} proximity={80} inactiveZone={0.01} borderWidth={3} />
                  <TiltCard intensity={3} className="overflow-hidden rounded-2xl glass-panel">
                    <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${edu.accent}, transparent)` }} />
                    <div className="p-7 md:p-9">
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                        {/* icon + status */}
                        <div className="flex shrink-0 items-center gap-4 lg:flex-col lg:items-center">
                          <div className="grid h-14 w-14 place-items-center rounded-2xl border"
                            style={{ background: `${edu.accent.replace(')', ' / 0.12)')}`, borderColor: `${edu.accent.replace(')', ' / 0.3)')}` }}>
                            <GraduationCap size={26} style={{ color: edu.accent }} />
                          </div>
                          <span className="inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                            style={{ background: `${edu.accent.replace(')', ' / 0.10)')}`, borderColor: `${edu.accent.replace(')', ' / 0.3)')}`, color: edu.accent }}>
                            {edu.status}
                          </span>
                        </div>

                        {/* content */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="font-display text-xl font-bold leading-tight tracking-tight md:text-2xl">{edu.school}</h3>
                              <p className="mt-1 text-sm font-medium text-muted-foreground">{edu.degree}</p>
                            </div>
                            <div className="shrink-0 rounded-xl border border-line/10 bg-line/[0.03] px-4 py-2.5 text-center">
                              <p className="font-display text-lg font-bold leading-none gradient-text">{edu.grade.split(': ')[1]}</p>
                              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{edu.grade.split(': ')[0]}</p>
                            </div>
                          </div>

                          <div className="mb-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5"><Calendar size={12} className="text-brand-2/70" />{edu.period}</span>
                            <span className="inline-flex items-center gap-1.5"><MapPin size={12} className="text-brand-2/70" />{edu.location}</span>
                          </div>

                          <div className="space-y-2">
                            {edu.highlights.map((point) => (
                              <div key={point} className="flex items-start gap-2.5">
                                <ArrowUpRight size={13} className="mt-0.5 shrink-0" style={{ color: edu.accent }} />
                                <span className="text-sm leading-snug text-muted-foreground">{point}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
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
            {certifications.map(({ title, issuer, year, icon: Icon }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="group relative h-full rounded-3xl border-[0.75px] border-border p-2">
                  <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
                  <div className="relative flex h-full items-start gap-4 rounded-2xl glass-panel p-6">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-brand-1/20 bg-brand-1/10 transition-transform group-hover:scale-110">
                      <Icon className="text-brand-1" size={18} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold leading-snug transition-colors group-hover:text-brand-2">{title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{issuer}</p>
                      <span className="mt-2 inline-flex rounded-full border border-brand-2/20 bg-brand-2/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-brand-2">
                        {year}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Education;
