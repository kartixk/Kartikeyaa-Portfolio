import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Icosahedron, Torus, Octahedron, Grid, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import { useTheme } from 'next-themes';

const CYAN = '#22e3ff';
const BLUE = '#4d7cff';
const MAGENTA = '#ff4dd2';
// deeper variants that read on a white background
const CYAN_L = '#0a93b3';
const BLUE_L = '#2b5cd6';
const MAGENTA_L = '#c0249a';

function usePointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  return pointer;
}

function Scene({ reduce, light }: { reduce: boolean; light: boolean }) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const pointer = usePointer();

  // theme-aware look: dark = glowing neon; light = clean translucent blueprint
  const cyan = light ? CYAN_L : CYAN;
  const blue = light ? BLUE_L : BLUE;
  const magenta = light ? MAGENTA_L : MAGENTA;
  const lineBlend = light ? THREE.NormalBlending : THREE.AdditiveBlending;

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const tx = reduce ? 0 : pointer.current.x * 0.45;
    const ty = reduce ? 0 : pointer.current.y * 0.3;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, tx + t * 0.1, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, ty, 0.05);
    if (shell.current) { shell.current.rotation.y += delta * 0.2; shell.current.rotation.x += delta * 0.05; }
    if (ring1.current) ring1.current.rotation.z += delta * 0.4;
    if (ring2.current) ring2.current.rotation.z -= delta * 0.28;
  });

  return (
    <>
      <ambientLight intensity={light ? 0.85 : 0.4} />
      <pointLight position={[-6, 4, 4]} intensity={light ? 30 : 50} color={cyan} />
      <pointLight position={[6, -2, 3]} intensity={light ? 22 : 35} color={magenta} />
      <pointLight position={[0, 5, -5]} intensity={light ? 18 : 28} color={blue} />

      {/* Tron grid floor */}
      <Grid
        position={[0, -1.7, 0]}
        args={[40, 40]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor={light ? '#9fc7d4' : '#0d4654'}
        sectionSize={2.5}
        sectionThickness={1.1}
        sectionColor={cyan}
        fadeDistance={28}
        fadeStrength={1.6}
        infiniteGrid
        followCamera={false}
      />

      <group ref={group} position={[0, 0.5, 0]}>
        {/* outer holographic wireframe */}
        <Icosahedron ref={shell} args={[1.95, 1]}>
          <meshBasicMaterial wireframe color={cyan} transparent opacity={light ? 0.6 : 0.45} blending={lineBlend} />
        </Icosahedron>

        {/* core — solid plasma in dark, clean translucent glass in light */}
        <Float speed={reduce ? 0 : 1.3} rotationIntensity={reduce ? 0 : 0.5} floatIntensity={reduce ? 0 : 0.7}>
          <Icosahedron args={[1.15, 18]}>
            <MeshDistortMaterial
              color={light ? '#cfeef5' : '#031820'}
              emissive={cyan}
              emissiveIntensity={light ? 0.18 : 0.9}
              roughness={light ? 0.5 : 0.15}
              metalness={light ? 0.05 : 0.7}
              transparent
              opacity={light ? 0.4 : 1}
              distort={reduce ? 0 : 0.38}
              speed={reduce ? 0 : 1.6}
            />
          </Icosahedron>
        </Float>

        {/* orbiting rings */}
        <Torus ref={ring1} args={[2.5, light ? 0.02 : 0.013, 8, 128]} rotation={[Math.PI / 2.2, 0, 0]}>
          <meshBasicMaterial color={cyan} transparent opacity={light ? 0.55 : 0.7} blending={lineBlend} />
        </Torus>
        <Torus ref={ring2} args={[2.9, light ? 0.018 : 0.01, 8, 128]} rotation={[Math.PI / 1.7, 0.4, 0]}>
          <meshBasicMaterial color={magenta} transparent opacity={light ? 0.45 : 0.55} blending={lineBlend} />
        </Torus>

        {/* floating shards */}
        <Float speed={reduce ? 0 : 2.2} rotationIntensity={1.4} floatIntensity={1.5}>
          <Octahedron args={[0.3, 0]} position={[2.7, 1.2, -0.4]}>
            <meshStandardMaterial color={magenta} emissive={magenta} emissiveIntensity={light ? 0.25 : 0.8} roughness={light ? 0.5 : 0.3} metalness={light ? 0.2 : 0.6} flatShading />
          </Octahedron>
        </Float>
        <Float speed={reduce ? 0 : 1.7} rotationIntensity={1.2} floatIntensity={1.7}>
          <Octahedron args={[0.22, 0]} position={[-2.8, -0.9, 0.4]}>
            <meshStandardMaterial color={blue} emissive={blue} emissiveIntensity={light ? 0.3 : 0.9} roughness={light ? 0.5 : 0.3} metalness={light ? 0.2 : 0.6} flatShading />
          </Octahedron>
        </Float>
      </group>

      {!reduce && <Sparkles count={light ? 40 : 60} scale={11} size={light ? 1.8 : 2.6} speed={0.3} color={cyan} opacity={light ? 0.5 : 0.8} />}

      {/* bloom only in dark — on white it just hazes the scene */}
      {!reduce && !light && (
        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      )}
    </>
  );
}

const supportsWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch {
    return false;
  }
};

/** CSS-only holographic fallback. */
const FallbackOrb = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center ${className ?? ''}`}>
    <div className="relative h-64 w-64">
      <div className="absolute inset-0 rounded-full border border-brand-1/40 animate-spin-slow" />
      <div className="absolute inset-6 rounded-full border border-brand-3/30 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
      <div className="absolute inset-16 rounded-full blur-2xl opacity-60 animate-glow-pulse"
        style={{ background: 'radial-gradient(circle, hsl(var(--brand-1)), transparent 70%)' }} />
    </div>
  </div>
);

interface Hero3DProps { className?: string }

export const Hero3D = ({ className }: Hero3DProps) => {
  const reduce = useReducedMotion() ?? false;
  const { resolvedTheme } = useTheme();
  const light = resolvedTheme === 'light';
  const [webgl, setWebgl] = useState<boolean | null>(null);
  useEffect(() => setWebgl(supportsWebGL()), []);

  if (webgl === false) return <FallbackOrb className={className} />;

  return (
    <div className={className}>
      <ErrorBoundary fallback={<FallbackOrb className="h-full w-full" />}>
        <Canvas
          dpr={[1, 1.6]}
          camera={{ position: [0, 1.1, 7], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ pointerEvents: 'none' }}
        >
          <Suspense fallback={null}>
            <Scene reduce={reduce} light={light} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};

export default Hero3D;
