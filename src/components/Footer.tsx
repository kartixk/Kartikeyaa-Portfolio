'use client';

import { usePathname } from 'next/navigation';
import { ArrowUp, ArrowUpRight, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES, SITE } from '@/lib/site';
import { RESUME_URL } from '@/lib/data';
import TransitionLink from '@/components/TransitionLink';
import LocalTime from '@/components/LocalTime';
import { Magnetic, Marquee, TextReveal, Reveal } from '@/components/fx';
import { useLenis } from 'lenis/react';

const Footer = () => {
  const pathname = usePathname();
  const lenis = useLenis();
  const onContact = pathname === '/contact';

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      toast.success('Email copied to clipboard');
    } catch {
      window.location.href = `mailto:${SITE.email}`;
    }
  };

  return (
    <footer className="relative z-10 mt-12 border-t border-line/15">
      {!onContact && (
        <section className="wrap section">
          <Reveal>
            <p className="eyebrow mb-8">What&apos;s next?</p>
          </Reveal>
          <TextReveal
            as="h2"
            className="display text-[clamp(3.4rem,12.5vw,12rem)]"
            lines={[
              <span key="a">Let&apos;s make</span>,
              <span key="b">
                something <span className="serif text-primary">great.</span>
              </span>,
            ]}
          />
          <Reveal delay={0.2} className="mt-14 flex flex-wrap items-center gap-4">
            <Magnetic strength={0.25}>
              <TransitionLink href="/contact" className="btn btn-solid !px-8 !py-5 !text-base" data-cursor="Go">
                Start a conversation <ArrowUpRight size={18} />
              </TransitionLink>
            </Magnetic>
            <Magnetic strength={0.25}>
              <button onClick={copyEmail} className="btn btn-ghost !px-8 !py-5 !text-base">
                {SITE.email} <Copy size={16} />
              </button>
            </Magnetic>
          </Reveal>
        </section>
      )}

      <div className="border-y border-line/15 py-5">
        <Marquee duration={50} pauseOnHover={false}>
          {['Full-Stack', 'Machine Learning', 'IoT', 'Scalable APIs', 'Clean Interfaces'].map((w) => (
            <span key={w} className="mx-6 flex items-center gap-12 font-display text-xl font-semibold tracking-tight text-muted-foreground md:text-2xl">
              {w} <span className="text-primary">✺</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="display max-w-xs text-3xl">
            Full-stack developer crafting fast, <span className="serif text-primary">purposeful</span> products.
          </p>
        </div>
        <div>
          <h4 className="eyebrow mb-5">Navigate</h4>
          <ul className="space-y-2.5">
            {ROUTES.filter((r) => r.path !== '/').map((r) => (
              <li key={r.path}>
                <TransitionLink href={r.path} className="link-u text-base font-medium">
                  {r.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="eyebrow mb-5">Elsewhere</h4>
          <ul className="space-y-2.5">
            {[
              { label: 'GitHub', href: SITE.github },
              { label: 'LinkedIn', href: SITE.linkedin },
              { label: 'Email', href: `mailto:${SITE.email}` },
            ].map((s) => (
              <li key={s.label}>
                <a href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="link-u inline-flex items-center gap-1 text-base font-medium">
                  {s.label} <ArrowUpRight size={14} />
                </a>
              </li>
            ))}
            <li>
              <a href={RESUME_URL} download="Kartikeya_Resume.pdf" className="link-u text-base font-medium">
                Resume ↓
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow mb-5">Based in</h4>
          <p className="text-base font-medium">Visakhapatnam, India</p>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            <LocalTime />
          </p>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Open to opportunities
          </p>
        </div>
      </div>

      {/* wordmark */}
      <div className="overflow-hidden px-3 select-none" aria-hidden>
        <p className="display whitespace-nowrap text-center text-[17.6vw] leading-[0.82] text-outline transition-colors duration-700 hover:text-foreground">
          KARTIKEYA
        </p>
      </div>

      <div className="wrap flex flex-col items-center justify-between gap-4 py-6 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} B V S Kartikeya. Designed &amp; built by me with Next.js &amp; Framer Motion.</p>
        <button
          onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: 'smooth' }))}
          className="group inline-flex items-center gap-2 font-medium transition-colors hover:text-foreground"
        >
          Back to top
          <span className="grid h-8 w-8 place-items-center rounded-full border border-line/25 transition-colors group-hover:bg-foreground group-hover:text-background">
            <ArrowUp size={14} />
          </span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
