import type { Metadata } from 'next';
import About from '@/views/About';

export const metadata: Metadata = {
  title: 'About',
  description: 'Who is B Venkata Sai Kartikeya — a Full Stack Developer working across MERN, Machine Learning and IoT.',
  alternates: { canonical: '/about' },
};

export default function Page() {
  return <About />;
}
