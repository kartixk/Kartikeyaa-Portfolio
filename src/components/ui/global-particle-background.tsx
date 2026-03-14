import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  opacity: number;
  phase: number;   // for twinkling
  isCyan: boolean; // site accent color
}

// ── tuning ────────────────────────────────────────────────────────────────────
const PARTICLE_COUNT   = 80;   // fixed count — no density calc
const MOUSE_RADIUS     = 120;
const REPULSION        = 0.45; // gentle push
const RETURN_SPEED     = 0.04; // slow spring back
const DAMPING          = 0.88;
const TWINKLE_SPEED    = 0.0015;
// ─────────────────────────────────────────────────────────────────────────────

export default function GlobalParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const originRef = useRef<{ x: number; y: number }[]>([]);
  const mouseRef = useRef({ x: -999, y: -999, active: false });
  const frameRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  // ── Initialise particles scattered across the full page ───────────────────
  const init = useCallback((w: number, h: number) => {
    sizeRef.current = { w, h };
    const arr: Particle[] = [];
    const origins: { x: number; y: number }[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      arr.push({
        x, y, vx: 0, vy: 0,
        size: Math.random() * 1.8 + 0.4,
        opacity: Math.random() * 0.45 + 0.12,
        phase: Math.random() * Math.PI * 2,
        isCyan: Math.random() > 0.82,
      });
      origins.push({ x, y });
    }
    particlesRef.current = arr;
    originRef.current = origins;
  }, []);

  // ── Animation loop ────────────────────────────────────────────────────────
  const loop = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Use logical size (w/h before DPR), canvas.width/height are DPR-scaled
    const W = sizeRef.current.w;
    const H = sizeRef.current.h;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle pulsing glow — very cheap
    const pulse = Math.sin(time * 0.0006) * 0.025 + 0.05;
    const grd = ctx.createRadialGradient(
      canvas.width / 2, canvas.height * 0.35, 0,
      canvas.width / 2, canvas.height * 0.35, canvas.width * 0.55,
    );
    grd.addColorStop(0, `rgba(0,240,255,${pulse})`);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const mouse = mouseRef.current;
    const particles = particlesRef.current;
    const origins = originRef.current;
    const dpr = window.devicePixelRatio || 1;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const o = origins[i];

      // Mouse repulsion
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        const r2 = MOUSE_RADIUS * MOUSE_RADIUS;
        if (distSq < r2 && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / MOUSE_RADIUS) * REPULSION;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // Spring return to origin
      p.vx += (o.x - p.x) * RETURN_SPEED;
      p.vy += (o.y - p.y) * RETURN_SPEED;

      // Integrate
      p.vx *= DAMPING;
      p.vy *= DAMPING;
      p.x += p.vx;
      p.y += p.vy;

      // Twinkle
      const twinkle = Math.sin(time * TWINKLE_SPEED + p.phase) * 0.35 + 0.65;
      const alpha = p.opacity * twinkle;

      // Draw (scale to DPR space)
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.isCyan ? '#00f0ff' : '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x * dpr, p.y * dpr, p.size * dpr, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    frameRef.current = requestAnimationFrame(loop);
  }, []);

  // ── Resize ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width  = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      init(w, h);
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();
    return () => window.removeEventListener('resize', resize);
  }, [init]);

  // ── Start loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [loop]);

  // ── Mouse tracking (passive for scroll perf) ──────────────────────────────
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const onLeave = () => { mouseRef.current.active = false; };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, willChange: 'transform' }}
    />
  );
}
