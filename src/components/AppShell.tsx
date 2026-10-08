'use client';

import { ReactNode, useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Backdrop from '@/components/Backdrop';
import { ScrollProgress } from '@/components/fx';
import Preloader from '@/components/ui/preloader';
import { ROUTES } from '@/lib/site';

const SEEN_KEY = 'kartikeya-preloader-seen';
const KNOWN_PATHS: string[] = ROUTES.map((r) => r.path);

/** Persistent chrome around every route: backdrop, nav, footer and the one-time intro. */
const AppShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [showPreloader, setShowPreloader] = useState(true);

  // Play the intro once per browser session; skip it on later visits / hard reloads of inner pages.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) setShowPreloader(false);
    } catch {
      /* storage unavailable — just show the intro */
    }
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* ignore */
    }
    setShowPreloader(false);
  }, []);

  const showFooter = KNOWN_PATHS.includes(pathname);

  return (
    <>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
      <Backdrop />
      <div className="noise-overlay" />
      <ScrollProgress />
      <Navbar />
      <main id="main">{children}</main>
      {showFooter && <Footer />}
    </>
  );
};

export default AppShell;
