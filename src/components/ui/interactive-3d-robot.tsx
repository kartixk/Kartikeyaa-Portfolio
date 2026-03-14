'use client';

import React, { Suspense, lazy, useEffect, useState } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

interface RobotErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface RobotErrorBoundaryState {
  hasError: boolean;
}

class RobotErrorBoundary extends React.Component<RobotErrorBoundaryProps, RobotErrorBoundaryState> {
  constructor(props: RobotErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Prevent runtime WebGL errors from crashing the whole app.
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

const RobotFallback = ({ className }: { className?: string }) => (
  <div
    className={`w-full h-full ${className ?? ''}`}
    style={{
      background:
        'radial-gradient(1200px 500px at 50% 30%, rgba(14,165,233,0.22) 0%, rgba(2,6,23,0.15) 45%, rgba(2,6,23,0.95) 100%)',
    }}
    aria-hidden="true"
  >
    <img
      src="https://source.unsplash.com/1600x900/?robot,ai"
      alt=""
      className="absolute inset-0 h-full w-full object-cover opacity-30"
    />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-cyan-400/30 bg-black/40 px-4 py-1 text-xs text-cyan-100/80 backdrop-blur-sm">
      3D preview unavailable on this device/browser
    </div>
  </div>
);

const supportsWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
};

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  const [canRenderWebGL, setCanRenderWebGL] = useState(false);

  useEffect(() => {
    setCanRenderWebGL(supportsWebGL());
  }, []);

  if (!canRenderWebGL) {
    return <RobotFallback className={className} />;
  }

  return (
    <RobotErrorBoundary fallback={<RobotFallback className={className} />}>
      <Suspense fallback={<RobotFallback className={className} />}>
        <Spline scene={scene} className={className} />
      </Suspense>
    </RobotErrorBoundary>
  );
}
