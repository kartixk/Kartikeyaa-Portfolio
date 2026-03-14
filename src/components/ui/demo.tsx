import { Briefcase, Bot, LayoutDashboard } from 'lucide-react';
import { PortfolioPage, PortfolioPageProps } from '@/components/ui/starfall-portfolio-landing';

const customPortfolioData: PortfolioPageProps = {
  logo: {
    initials: 'AT',
    name: 'Alex Thompson',
  },
  navLinks: [
    { label: 'Bio', href: '#about' },
    { label: 'Work', href: '#projects' },
    { label: 'Expertise', href: '#skills' },
  ],
  resume: {
    label: 'Download CV',
    onClick: () => alert('Downloading CV...'),
  },
  hero: {
    titleLine1: 'Full-Stack Engineer &',
    titleLine2Gradient: 'UX Architect',
    subtitle:
      'I build robust and scalable web applications with a strong focus on user-centric design and performance.',
  },
  ctaButtons: {
    primary: {
      label: 'Explore My Work',
      onClick: () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    secondary: {
      label: 'Contact Me',
      onClick: () => {
        window.location.href = 'mailto:alex.thompson@example.com';
      },
    },
  },
  projects: [
    {
      title: 'E-commerce Platform',
      description: 'A scalable online store built with Next.js, TypeScript, and Stripe.',
      tags: ['Next.js', 'Stripe', 'Vercel'],
      imageContent: (
        <div className="relative w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80"
            alt="E-commerce dashboard"
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
        </div>
      ),
    },
    {
      title: 'SaaS Dashboard',
      description: 'A real-time analytics dashboard for a B2B software-as-a-service product.',
      tags: ['React', 'Chart.js', 'Firebase'],
      imageContent: (
        <div className="relative w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80"
            alt="Analytics dashboard"
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-black/35 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-7 h-7 text-white" />
          </div>
        </div>
      ),
    },
    {
      title: 'AI Content Generator',
      description: 'Leveraging OpenAI to generate marketing copy for businesses.',
      tags: ['SvelteKit', 'OpenAI', 'Tailwind CSS'],
      imageContent: (
        <div className="w-full h-full rounded-xl bg-white/5 flex items-center justify-center">
          <Bot className="w-8 h-8 text-white/70" />
        </div>
      ),
    },
  ],
  stats: [
    { value: '7+', label: 'Years of Experience' },
    { value: '30+', label: 'Client Projects' },
    { value: '99%', label: 'Client Satisfaction' },
  ],
  showAnimatedBackground: true,
};

const DemoOne = () => {
  return <PortfolioPage {...customPortfolioData} />;
};

export { DemoOne };
