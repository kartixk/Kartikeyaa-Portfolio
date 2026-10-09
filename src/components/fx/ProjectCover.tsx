import { cn } from '@/lib/utils';
import type { CoverKind } from '@/lib/data';

interface ProjectCoverProps {
  kind: CoverKind;
  /** hsl triple, e.g. "16 100% 58%" */
  hue: string;
  className?: string;
}

const INK = '#0f0e0d';
// round generated coordinates so server and client markup are byte-identical
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Generative cover art — flat colour + line drawing, one motif per project.
 * Animates when an ancestor with the `group` class is hovered.
 */
export const ProjectCover = ({ kind, hue, className }: ProjectCoverProps) => (
  <div className={cn('relative h-full w-full overflow-hidden', className)} style={{ background: `hsl(${hue})` }}>
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      {kind === 'plate' && (
        <g fill="none" stroke={INK} strokeWidth="2.5" className="origin-center transition-transform [transition-duration:1400ms] ease-out [transform-box:fill-box] group-hover:rotate-[24deg] group-hover:scale-105" style={{ transformOrigin: '200px 150px' }}>
          {[34, 64, 98, 136, 178, 224].map((r) => (
            <circle key={r} cx="200" cy="150" r={r} />
          ))}
          <circle cx="200" cy="150" r="12" fill={INK} />
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return <line key={i} x1={r2(200 + Math.cos(a) * 140)} y1={r2(150 + Math.sin(a) * 140)} x2={r2(200 + Math.cos(a) * 178)} y2={r2(150 + Math.sin(a) * 178)} />;
          })}
        </g>
      )}

      {kind === 'bolt' && (
        <g stroke={INK} strokeWidth="2.5" fill="none">
          {Array.from({ length: 22 }).map((_, i) => (
            <line key={i} x1={-60 + i * 28} y1="320" x2={60 + i * 28} y2="-20" opacity="0.28" />
          ))}
          <polygon
            points="232,24 120,172 192,172 160,282 288,120 212,120"
            fill={INK}
            className="origin-center transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:-rotate-3"
            style={{ transformOrigin: '200px 150px' }}
          />
        </g>
      )}

      {kind === 'wave' && (
        <g fill={INK}>
          {Array.from({ length: 31 }).map((_, i) => {
            const h = r2(30 + Math.abs(Math.sin(i * 0.62) * 110) + Math.abs(Math.cos(i * 0.21) * 60));
            return (
              <rect
                key={i}
                x={20 + i * 12}
                y={r2(150 - h / 2)}
                width="6"
                height={h}
                rx="3"
                className="origin-center transition-transform duration-500 ease-out [transform-box:fill-box] group-hover:scale-y-[1.45]"
                style={{ transitionDelay: `${i * 14}ms` }}
              />
            );
          })}
        </g>
      )}

      {kind === 'signal' && (
        <g>
          {Array.from({ length: 13 }).map((_, c) =>
            Array.from({ length: 9 }).map((__, r) => (
              <circle key={`${c}-${r}`} cx={20 + c * 30} cy={22 + r * 32} r="2.4" fill={INK} opacity="0.55" />
            ))
          )}
          <g fill="none" stroke={INK} strokeWidth="2.5">
            {[0, 1, 2, 3].map((i) => (
              <circle
                key={i}
                cx="200"
                cy="150"
                r={50 + i * 42}
                className="origin-center animate-ripple [transform-box:fill-box]"
                style={{ animationDelay: `${i * 0.7}s` }}
              />
            ))}
          </g>
          <circle cx="200" cy="150" r="16" fill={INK} />
        </g>
      )}
    </svg>
  </div>
);

export default ProjectCover;
