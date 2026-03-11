import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';

const Home = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center gradient-bg relative overflow-hidden">
        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary/5 blur-3xl"
          />
        </div>

        <div className="section-container text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary font-medium mb-4 tracking-widest uppercase text-sm">Full Stack Developer</p>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
              <span className="gradient-text">B Venkata Sai</span>
              <br />
              <span className="text-foreground">Kartikeya</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Computer Science undergraduate specializing in software development, machine learning, and IoT systems. Building scalable full-stack applications with the MERN stack.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity glow-border"
              >
                View Projects <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass-card text-foreground font-medium hover:bg-muted/50 transition-colors"
              >
                Get In Touch
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 mt-10">
              <a href="mailto:kartikeyaa15@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail size={22} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={22} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={22} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
