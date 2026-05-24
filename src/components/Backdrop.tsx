import { memo } from 'react';

/**
 * Global ambient background: a couple of soft solid-colour glows + a masked
 * grid. Pure CSS, no busy gradients — runs everywhere without a WebGL context.
 */
const Backdrop = memo(() => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
    {/* base wash */}
    <div className="absolute inset-0 gradient-bg" />

    {/* soft ambient glows (opacity adapts to theme via --backdrop-blob) */}
    <div
      className="absolute -left-40 -top-40 h-[42rem] w-[42rem] rounded-full blur-[120px] animate-float"
      style={{ background: 'radial-gradient(circle, hsl(var(--brand-1)) 0%, transparent 65%)', opacity: 'var(--backdrop-blob)' }}
    />
    <div
      className="absolute bottom-[-14rem] right-[-10rem] h-[40rem] w-[40rem] rounded-full blur-[130px] animate-float"
      style={{ background: 'radial-gradient(circle, hsl(var(--brand-2)) 0%, transparent 65%)', opacity: 'calc(var(--backdrop-blob) * 0.7)', animationDelay: '2s' }}
    />

    {/* masked grid */}
    <div className="absolute inset-0 grid-bg opacity-50" />
  </div>
));

Backdrop.displayName = 'Backdrop';

export default Backdrop;
