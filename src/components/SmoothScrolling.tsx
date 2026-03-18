import { ReactLenis } from '@studio-freight/react-lenis';
import { ReactNode } from 'react';

interface SmoothScrollingProps {
  children: ReactNode;
}

const SmoothScrolling = ({ children }: SmoothScrollingProps) => {
  return (
    <ReactLenis root options={{ lerp: 0.06, smoothWheel: true, wheelMultiplier: 1.2 }}>
      {children}
    </ReactLenis>
  );
};

export default SmoothScrolling;
