import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Magnetic, AnimatedText } from '@/components/fx';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative z-10">
          <h1 className="font-display text-[28vw] font-extrabold leading-none tracking-tighter md:text-[16rem]">
            <span className="aurora-text">404</span>
          </h1>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
            <AnimatedText text="This page drifted into space." />
          </p>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          <div className="mt-9 flex justify-center">
            <Magnetic strength={0.4}>
              <Link to="/" className="btn-gradient group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold">
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                Back to Home
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
