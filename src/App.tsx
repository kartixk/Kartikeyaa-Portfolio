import { lazy, Suspense, useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import Navbar from '@/components/Navbar';
import Preloader from '@/components/ui/preloader';
import { AnimatePresence } from 'framer-motion';
import SmoothScrolling from '@/components/SmoothScrolling';
import { AuroraBackground } from '@/components/ui/starfall-portfolio-landing';

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

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const AppContent = ({ showPreloader }: { showPreloader: boolean }) => {
  const location = useLocation();
  const showGlobalAurora = location.pathname !== '/';

  return (
    <>
      {showGlobalAurora && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <AuroraBackground />
        </div>
      )}
      {!showPreloader && <Navbar />}
      <Suspense fallback={<Loading />}>
        <AnimatePresence mode="wait">
          {!showPreloader && (
            <Routes>
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
    </>
  );
};

import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
    <div className="max-w-md text-center space-y-4">
      <h2 className="text-2xl font-bold text-destructive">Oops, something went wrong</h2>
      <p className="text-muted-foreground text-sm">We're sorry, but an unexpected error occurred.</p>
      <div className="bg-destructive/10 text-destructive p-4 rounded-md text-left overflow-auto text-xs font-mono">
        {error.message}
      </div>
      <button 
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
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
  );
};

export default App;
