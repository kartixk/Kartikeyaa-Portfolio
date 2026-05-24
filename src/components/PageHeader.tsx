import { ReactNode } from 'react';
import { Reveal, Parallax } from '@/components/fx';

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
}

/** Consistent oversized hero strip for inner pages. */
const PageHeader = ({ eyebrow, title, subtitle, align = 'left' }: PageHeaderProps) => (
  <header className={`relative overflow-hidden pt-36 pb-12 md:pt-44 md:pb-16 ${align === 'center' ? 'text-center' : ''}`}>
    {/* parallax accent orbs */}
    <Parallax amount={70} className="pointer-events-none absolute -right-16 -top-4 h-72 w-72 rounded-full blur-[100px]"
      style={{ background: 'radial-gradient(circle, hsl(var(--brand-1) / 0.20), transparent 70%)' }} />
    <Parallax amount={-50} className="pointer-events-none absolute left-1/4 top-24 h-56 w-56 rounded-full blur-[110px]"
      style={{ background: 'radial-gradient(circle, hsl(var(--brand-2) / 0.14), transparent 70%)' }} />
    <div className={`section-container !py-0 relative ${align === 'center' ? 'flex flex-col items-center' : ''}`}>
      <Reveal direction="none" immediate>
        <p className="eyebrow mb-5">
          <span className="h-px w-8 bg-brand-2/60" /> {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.08} immediate>
        <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
          {title}
        </h1>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16} immediate>
          <p className={`mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground ${align === 'center' ? 'mx-auto' : ''}`}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  </header>
);

export default PageHeader;
