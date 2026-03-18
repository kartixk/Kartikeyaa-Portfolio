import { motion } from 'framer-motion';
import { Code, Globe, Database, Brain } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import SectionHeader from '@/components/SectionHeader';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const skillCategories = [
  {
    icon: Code,
    title: 'Programming',
    skills: ['Python', 'Java', 'C', 'JavaScript', 'SQL'],
  },
  {
    icon: Globe,
    title: 'Web Technologies',
    skills: ['HTML', 'CSS', 'React.js', 'Node.js', 'Express.js', 'REST APIs'],
  },
  {
    icon: Database,
    title: 'Databases & Tools',
    skills: ['MongoDB', 'Git', 'GitHub', 'Firebase', 'Supabase', 'ThingSpeak', 'Figma'],
  },
  {
    icon: Brain,
    title: 'Currently Exploring',
    skills: ['Machine Learning Basics', 'IoT', 'NLP Concepts', 'TensorFlow (Beginner)'],
  },
];

const Skills = () => {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 gradient-bg">
        <div className="section-container">
          <SectionHeader title="Skills" subtitle="Technologies I work with" />

          <div className="grid sm:grid-cols-2 gap-6">
            {skillCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative h-full rounded-2xl border-[0.75px] border-border p-2 md:p-3"
                >
                  <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
                  <div className="relative h-full glass-card glow-border p-6 overflow-hidden rounded-xl">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="text-primary" size={22} />
                      </div>
                      <h3 className="text-lg font-heading font-semibold text-foreground">{cat.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((skill) => (
                        <motion.span
                          key={skill}
                          whileHover={{ scale: 1.05 }}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-muted/80 text-foreground border border-border/50 hover:border-primary/40 hover:bg-primary/10 transition-colors cursor-default"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Skills;
