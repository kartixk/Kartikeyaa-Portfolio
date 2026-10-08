import type { Metadata } from 'next';
import Experience from '@/views/Experience';

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Professional experience, internships and hands-on engineering work.',
  alternates: { canonical: '/experience' },
};

export default function Page() {
  return <Experience />;
}
