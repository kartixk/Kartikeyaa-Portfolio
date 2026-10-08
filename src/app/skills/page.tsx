import type { Metadata } from 'next';
import Skills from '@/views/Skills';

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Technical skills across frontend, backend, databases, machine learning and tooling.',
  alternates: { canonical: '/skills' },
};

export default function Page() {
  return <Skills />;
}
