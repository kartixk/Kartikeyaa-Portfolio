import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2 } from 'lucide-react';
import GradientMenu from '@/components/ui/gradient-menu';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Skills', path: '/skills' },
  { label: 'Experience', path: '/experience' },
  { label: 'Education', path: '/education' },
  { label: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl glass-card px-6 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl">
        <Code2 className="text-primary" size={24} />
        <span className="gradient-text">Kartikeya</span>
      </Link>

      {/* Desktop — gradient pill menu */}
      <div className="hidden md:flex items-center">
        <GradientMenu />
      </div>

      {/* Mobile toggle */}
      <button onClick={() => setOpen(!open)} className="md:hidden text-foreground p-2">
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-border/50 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
