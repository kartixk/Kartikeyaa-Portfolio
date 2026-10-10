'use client';

import { useEffect, useRef } from 'react';

const ticks = Array.from({ length: 60 }, (_, i) => i);
const f2 = (n: number) => n.toFixed(2);

/** Analog clock widget showing Visakhapatnam time (IST). Hands move via refs — no React re-renders. */
export const Clock = ({ className }: { className?: string }) => {
  const h = useRef<SVGLineElement>(null);
  const m = useRef<SVGLineElement>(null);
  const s = useRef<SVGGElement>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
    const tick = () => {
      const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
      const hh = Number(parts.hour) % 12;
      const mm = Number(parts.minute);
      const ss = Number(parts.second);
      h.current?.setAttribute('transform', `rotate(${hh * 30 + mm * 0.5} 50 50)`);
      m.current?.setAttribute('transform', `rotate(${mm * 6 + ss * 0.1} 50 50)`);
      s.current?.setAttribute('transform', `rotate(${ss * 6} 50 50)`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={className} role="img" aria-label="Analog clock showing the current time in Visakhapatnam, India">
      <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]">
        <rect x="1" y="1" width="98" height="98" rx="20" fill="#121512" stroke="rgb(255 255 255 / 0.12)" />
        {ticks.map((i) => {
          const a = (i * 6 * Math.PI) / 180;
          const major = i % 5 === 0;
          const r1 = major ? 38 : 41;
          return (
            <line
              key={i}
              x1={f2(50 + Math.sin(a) * r1)}
              y1={f2(50 - Math.cos(a) * r1)}
              x2={f2(50 + Math.sin(a) * 44)}
              y2={f2(50 - Math.cos(a) * 44)}
              stroke={major ? '#f1f2ea' : 'rgb(241 242 234 / 0.4)'}
              strokeWidth={major ? 1.3 : 0.6}
            />
          );
        })}
        {[12, 3, 6, 9].map((n, i) => {
          const a = (i * 90 * Math.PI) / 180;
          return (
            <text key={n} x={f2(50 + Math.sin(a) * 31)} y={f2(50 - Math.cos(a) * 31 + 3.2)} textAnchor="middle" fontSize="9" fontWeight="600" fill="#f1f2ea" fontFamily="var(--font-display), sans-serif">
              {n}
            </text>
          );
        })}
        <text x="50" y="66" textAnchor="middle" fontSize="6" letterSpacing="0.6" fill="rgb(241 242 234 / 0.55)" fontFamily="var(--font-mono), monospace">
          IST
        </text>
        <line ref={h} x1="50" y1="50" x2="50" y2="29" stroke="#f1f2ea" strokeWidth="3" strokeLinecap="round" transform="rotate(300 50 50)" />
        <line ref={m} x1="50" y1="50" x2="50" y2="19" stroke="#f1f2ea" strokeWidth="2" strokeLinecap="round" transform="rotate(60 50 50)" />
        <g ref={s} transform="rotate(0 50 50)">
          <line x1="50" y1="56" x2="50" y2="14" stroke="hsl(76 96% 58%)" strokeWidth="1" strokeLinecap="round" />
        </g>
        <circle cx="50" cy="50" r="2.4" fill="hsl(76 96% 58%)" />
      </svg>
    </div>
  );
};

export default Clock;
