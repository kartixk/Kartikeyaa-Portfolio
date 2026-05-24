import { lazy, Suspense, useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Backdrop from '@/components/Backdrop';
import { ScrollProgress } from '@/components/fx';
import Preloader from '@/components/ui/preloader';
import { AnimatePresence } from 'framer-motion';
import SmoothScrolling from '@/components/SmoothScrolling';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Skills = lazy(() => import('./pages/Skills'));
const Experience = lazy(() => import('./pages/Experience'));
const Education = lazy(() => import('./pages/Education'));
const Contact = lazy(() => import('./pages/Contact'));
const Demo = lazy(() => import('./pages/Demo'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient();

const KNOWN_ROUTES = ['/', '/about', '/projects', '/skills', '/experience', '/education', '/contact'];

const Loading = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-2 border-t-transparent" />
  </div>
);

const AppContent = ({ showPreloader }: { showPreloader: boolean }) => {
  const location = useLocation();
  const showFooter = KNOWN_ROUTES.includes(location.pathname);

  return (
    <>
      <Backdrop />
      <div className="noise-overlay" />

      {!showPreloader && <ScrollProgress />}
      {!showPreloader && <Navbar />}
      <Suspense fallback={<Loading />}>
        <AnimatePresence mode="wait">
          {!showPreloader && (
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/education" element={<Education />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </AnimatePresence>
      </Suspense>
      {!showPreloader && showFooter && <Footer />}
    </>
  );
};

import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
    <div className="max-w-md space-y-4 text-center">
      <h2 className="text-2xl font-bold text-destructive">Oops, something went wrong</h2>
      <p className="text-sm text-muted-foreground">We're sorry, but an unexpected error occurred.</p>
      <div className="overflow-auto rounded-md bg-destructive/10 p-4 text-left font-mono text-xs text-destructive">
        {error.message}
      </div>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  </div>
);

const App = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  const handlePreloaderComplete = useCallback(() => setShowPreloader(false), []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="kartikeya-theme">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <SmoothScrolling>
              <Sonner />
              <BrowserRouter>
                <AppContent showPreloader={showPreloader} />
              </BrowserRouter>
            </SmoothScrolling>
          </TooltipProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
