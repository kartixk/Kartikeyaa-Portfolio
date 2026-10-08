import type { Metadata } from 'next';
import Education from '@/views/Education';

export const metadata: Metadata = {
  title: 'Education',
  description: 'Academic background, certifications and coursework.',
  alternates: { canonical: '/education' },
};

export default function Page() {
  return <Education />;
}
