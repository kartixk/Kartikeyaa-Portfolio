import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import SectionHeader from '@/components/SectionHeader';

const education = [
  {
    school: 'GITAM University',
    degree: 'B.Tech in Computer Science (IoT)',
    period: 'Aug 2022 – Present',
    location: 'Visakhapatnam, India',
    grade: 'CGPA: 7.03 / 10.00',
  },
  {
    school: 'Sri Chaitanya Junior College',
    degree: 'Senior Secondary (PCM)',
    period: '2020 – 2022',
    location: 'Visakhapatnam, India',
    grade: 'Percentage: 85%',
  },
];

const Education = () => {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 gradient-bg">
        <div className="section-container">
          <SectionHeader title="Education" subtitle="My academic journey" />

          <div className="space-y-6">
            {education.map((edu, i) => (
              <motion.div
                key={edu.school}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card glow-border p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <GraduationCap className="text-primary" size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                      <h3 className="text-lg font-heading font-semibold text-foreground">{edu.school}</h3>
                      <span className="text-sm text-primary">{edu.period}</span>
                    </div>
                    <p className="text-muted-foreground">{edu.degree}</p>
                    <p className="text-sm text-muted-foreground">{edu.location}</p>
                    <p className="text-sm text-accent font-medium mt-2">{edu.grade}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Education;
