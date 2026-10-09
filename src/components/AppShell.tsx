'use client';

import { ReactNode, useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Cursor, ScrollProgress } from '@/components/fx';
import Aurora from '@/components/Aurora';
import Preloader from '@/components/ui/preloader';
import { ReadyProvider } from '@/components/ready';
import { RouteTransitionProvider } from '@/components/RouteTransition';
import { ROUTES } from '@/lib/site';

const SEEN_KEY = 'kartikeya-preloader-seen';
const KNOWN_PATHS: string[] = ROUTES.map((r) => r.path);

type Intro = 'checking' | 'show' | 'done';

/** Persistent chrome around every route: intro, cursor, nav, page wipe and footer. */
const AppShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [intro, setIntro] = useState<Intro>('checking');
  const [ready, setReady] = useState(false);

  // Play the intro once per browser session.
  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(SEEN_KEY);
    } catch {
      /* storage unavailable — just show the intro */
    }
    setIntro(seen ? 'done' : 'show');
    if (seen) setReady(true);
  }, []);

  const handleExit = useCallback(() => setReady(true), []);
  const handleComplete = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* ignore */
    }
    setIntro('done');
  }, []);

  const showFooter = KNOWN_PATHS.includes(pathname) || pathname.startsWith('/projects/');

  return (
    <ReadyProvider value={ready}>
      <RouteTransitionProvider>
        {/* hides first paint until we know whether to play the intro */}
        {intro === 'checking' && <div className="fixed inset-0 z-[100] bg-[#0b0d0a]" />}
        {intro === 'show' && <Preloader onExit={handleExit} onComplete={handleComplete} />}
        <Aurora />
        <div className="grain" aria-hidden />
        <Cursor />
        <ScrollProgress />
        <Navbar />
        <main id="main">{children}</main>
        {showFooter && <Footer />}
      </RouteTransitionProvider>
    </ReadyProvider>
  );
};

export default AppShell;
