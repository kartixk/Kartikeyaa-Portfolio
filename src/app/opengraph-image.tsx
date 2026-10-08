import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 80, background: '#05070d', color: '#eaffff', fontFamily: 'sans-serif',
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(34,227,255,0.28), transparent 55%)',
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 8, color: '#22e3ff', textTransform: 'uppercase' }}>Portfolio</div>
        <div style={{ fontSize: 92, fontWeight: 800, marginTop: 24, lineHeight: 1.05 }}>{SITE.name}</div>
        <div style={{ fontSize: 40, marginTop: 28, color: '#8fb4c0' }}>Full Stack Developer · MERN · ML · IoT</div>
      </div>
    ),
    size
  );
}
