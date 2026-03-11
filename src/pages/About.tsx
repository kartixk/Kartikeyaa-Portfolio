import { motion } from 'framer-motion';
import { User, MapPin, Mail, Phone } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import SectionHeader from '@/components/SectionHeader';

const About = () => {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 gradient-bg">
        <div className="section-container">
          <SectionHeader title="About Me" subtitle="Get to know me better" />

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card glow-border p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground">Who I Am</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                I'm a Computer Science undergraduate at GITAM University specializing in IoT, with a strong foundation in Python, Java, and the MERN stack.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I'm passionate about building full-stack applications, data-driven models, and real-time monitoring solutions with a focus on performance optimization and scalable design.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card glow-border p-8 space-y-6"
            >
              <h3 className="text-xl font-heading font-semibold text-foreground">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="text-primary" size={18} />
                  <span className="text-muted-foreground">Visakhapatnam, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-primary" size={18} />
                  <span className="text-muted-foreground">kartikeyaa15@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-primary" size={18} />
                  <span className="text-muted-foreground">+91-8250977949</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <h4 className="font-heading font-medium text-foreground mb-2">Soft Skills</h4>
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
        </div>
      </div>
    </PageTransition>
  );
};

export default About;
