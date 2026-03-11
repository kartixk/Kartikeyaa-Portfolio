import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import SectionHeader from '@/components/SectionHeader';

const experiences = [
  {
    company: 'NTPC Limited',
    role: 'Software Engineer Intern',
    period: 'May 2025',
    location: 'Visakhapatnam, India',
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
    points: [
      'Built responsive React interfaces, improving page load performance by 25%.',
      'Optimized API integration and state handling, reducing request latency by 15%.',
    ],
  },
];

const certifications = [
  { title: 'AI-ML Virtual Internship', org: 'EduSkills', period: 'Apr 2025 – Jun 2025' },
  { title: 'MERN Full Stack Training', org: 'XceedIQ Innovate360', period: 'Jan 2024 – Jul 2024' },
];

const Experience = () => {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 gradient-bg">
        <div className="section-container">
          <SectionHeader title="Experience" subtitle="Where I've worked" />

          <div className="space-y-6 mb-16">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card glow-border p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <Briefcase className="text-primary" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                      <h3 className="text-lg font-heading font-semibold text-foreground">{exp.company}</h3>
                      <span className="text-sm text-primary">{exp.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{exp.role} · {exp.location}</p>
                    <ul className="space-y-2">
                      {exp.points.map((p, j) => (
                        <li key={j} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary mt-0.5">▹</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <SectionHeader title="Certifications" />
          <div className="grid sm:grid-cols-2 gap-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-card p-5 hover:border-primary/30 transition-colors"
              >
                <h4 className="font-heading font-medium text-foreground">{cert.title}</h4>
                <p className="text-sm text-muted-foreground">{cert.org}</p>
                <p className="text-xs text-primary mt-1">{cert.period}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Experience;
