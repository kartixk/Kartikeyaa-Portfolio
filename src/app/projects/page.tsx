import type { Metadata } from 'next';
import Projects from '@/views/Projects';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Selected work: SaaS platforms, NLP models and IoT systems built end to end.',
  alternates: { canonical: '/projects' },
};

export default function Page() {
  return <Projects />;
}
