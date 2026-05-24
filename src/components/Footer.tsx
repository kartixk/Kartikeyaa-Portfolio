import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowUpRight, ArrowUp } from 'lucide-react';
import { Magnetic } from '@/components/fx';

const links = [
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Skills', path: '/skills' },
  { label: 'Experience', path: '/experience' },
  { label: 'Education', path: '/education' },
  { label: 'Contact', path: '/contact' },
];

const socials = [
  { icon: Github, href: 'https://github.com/kartixk', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/b-venkata-sai-kartikeya-28a99b357', label: 'LinkedIn' },
  { icon: Mail, href: 'https://mail.google.com/mail/?view=cm&fs=1&to=kartikeyaa15@gmail.com', label: 'Email' },
];

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-line/[0.06] mt-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 py-16">
        {/* Big CTA word */}
        <div className="mb-14">
          <p className="eyebrow mb-4">
            <span className="h-px w-8 bg-brand-2/60" /> Let's connect
          </p>
          <Link
            to="/contact"
            className="group inline-flex flex-wrap items-baseline gap-x-4 font-display text-5xl font-extrabold leading-none tracking-tight sm:text-7xl"
          >
            <span className="aurora-text">Got a project?</span>
            <ArrowUpRight className="h-10 w-10 text-brand-2 transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2 sm:h-14 sm:w-14" />
          </Link>
        </div>

        <div className="grid gap-10 border-t border-line/[0.06] pt-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg font-display text-sm font-extrabold text-background"
                style={{ background: 'hsl(var(--brand-1))' }}>K</span>
              <span className="font-display text-lg font-bold">B V S Kartikeya</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Full-stack developer crafting fast, smart, and purposeful digital products.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Navigate</h4>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="text-sm text-foreground/70 transition-colors hover:text-brand-2">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Elsewhere</h4>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <Magnetic key={label} strength={0.5}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-11 w-11 place-items-center rounded-xl border border-line/10 bg-line/[0.03] text-muted-foreground transition-all hover:border-brand-2/40 hover:text-brand-2"
                  >
                    <Icon size={18} />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line/[0.06] pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} B V S Kartikeya. Built with React, Three.js & Framer Motion.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-brand-2"
          >
            Back to top
            <ArrowUp size={13} className="transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
