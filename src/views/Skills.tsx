import { motion } from 'framer-motion';
import { Code, Globe, Database, Brain } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import PageHeader from '@/components/PageHeader';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Reveal, TiltCard } from '@/components/fx';

const skillCategories = [
  { icon: Code, title: 'Programming', accent: 'hsl(186 100% 52%)', span: 'md:col-span-2', skills: ['Python', 'Java', 'C', 'JavaScript', 'TypeScript', 'SQL'] },
  { icon: Globe, title: 'Web Technologies', accent: 'hsl(220 90% 62%)', span: 'md:col-span-1', skills: ['HTML', 'CSS', 'React.js', 'Node.js', 'Express.js', 'REST APIs'] },
  { icon: Database, title: 'Databases & Tools', accent: 'hsl(315 90% 62%)', span: 'md:col-span-1', skills: ['MongoDB', 'Git', 'GitHub', 'Firebase', 'Supabase', 'ThingSpeak', 'Figma'] },
  { icon: Brain, title: 'Currently Exploring', accent: 'hsl(220 90% 62%)', span: 'md:col-span-2', skills: ['Machine Learning', 'IoT', 'NLP Concepts', 'TensorFlow', 'Deep Learning'] },
];

const focus = [
  { label: 'Frontend Engineering', value: 90 },
  { label: 'Backend & APIs', value: 85 },
  { label: 'Databases', value: 80 },
  { label: 'Machine Learning', value: 60 },
];

const Skills = () => {
  return (
    <PageTransition>
      <div className="gradient-bg">
        <PageHeader
          eyebrow="My Toolkit"
          title={<><span className="text-foreground">The tools I</span> <span className="aurora-text">build with.</span></>}
          subtitle="Technologies I use across the full stack — and the areas I'm actively leveling up in."
        />

        <section className="section-container !pt-4">
          {/* Bento */}
          <div className="grid gap-5 md:grid-cols-3">
            {skillCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Reveal key={cat.title} delay={i * 0.08} className={cat.span}>
                  <div className="group relative h-full rounded-3xl border-[0.75px] border-border p-2">
                    <GlowingEffect spread={44} glow disabled={false} proximity={70} inactiveZone={0.01} borderWidth={3} />
                    <TiltCard intensity={5} className="h-full overflow-hidden rounded-2xl glass-panel p-7">
                      <div className="mb-6 flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-xl border transition-transform duration-300 group-hover:scale-110"
                          style={{ background: `${cat.accent.replace(')', ' / 0.12)')}`, borderColor: `${cat.accent.replace(')', ' / 0.3)')}` }}>
                          <Icon size={20} style={{ color: cat.accent }} />
                        </div>
                        <h3 className="font-display text-lg font-bold">{cat.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cat.skills.map((s) => (
                          <span key={s} className="rounded-lg px-3 py-1.5 text-sm font-medium text-foreground/80 transition-transform duration-200 hover:scale-105"
                            style={{ background: `${cat.accent.replace(')', ' / 0.10)')}`, border: `1px solid ${cat.accent.replace(')', ' / 0.25)')}` }}>
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="mt-6 h-[2px] w-0 transition-all duration-700 group-hover:w-full"
                        style={{ background: `linear-gradient(90deg, ${cat.accent}, transparent)` }} />
                    </TiltCard>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Proficiency */}
          <Reveal className="mt-16 mb-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Where I'm Strongest</h2>
            <span className="h-px flex-1 bg-border" />
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {focus.map((f, i) => (
              <Reveal key={f.label} delay={i * 0.08}>
                <div className="rounded-2xl border border-line/[0.06] glass-panel p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{f.label}</span>
                    <span className="font-mono text-sm text-brand-2">{f.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-line/[0.05]">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${f.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                      style={{ background: 'hsl(var(--brand-1))' }}
                    />
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

export default Skills;
