import type { Metadata } from 'next';
import Contact from '@/views/Contact';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch for full-time roles, internships and freelance projects.',
  alternates: { canonical: '/contact' },
};

export default function Page() {
  return <Contact />;
}
