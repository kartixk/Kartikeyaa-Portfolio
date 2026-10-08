'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { ReactLenis } from 'lenis/react';
import { Toaster } from '@/components/ui/sonner';

/** Theme, smooth-scroll and toast providers — everything global and client-only. */
const Providers = ({ children }: { children: ReactNode }) => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="kartikeya-theme">
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true, wheelMultiplier: 1.1 }}>
      {children}
    </ReactLenis>
    <Toaster />
  </ThemeProvider>
);

export default Providers;
