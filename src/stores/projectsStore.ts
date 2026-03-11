import { create } from 'zustand';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string[];
  tech: string[];
  link?: string;
  github?: string;
}

interface ProjectsState {
  projects: Project[];
}

export const useProjectsStore = create<ProjectsState>(() => ({
  projects: [
    {
      id: '1',
      title: 'Velvet Plate',
      subtitle: 'Full-Stack SaaS Management System',
      description: [
        'Built a multi-tenant restaurant management platform with role-based access for Admins, Branch Managers, and Customers.',
        'Implemented dynamic menu and inventory management with branch-specific pricing and stock tracking.',
        'Developed a secure branch onboarding workflow with document verification.',
        'Integrated cloud-based media storage and built scalable APIs.',
      ],
      tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Cloud Storage'],
      github: '#',
    },
    {
      id: '2',
      title: 'Zenith-Zap Platform',
      subtitle: 'Mobile-First React Web Platform',
      description: [
        'Created a mobile-first React web platform supporting 50+ daily active users.',
        'Ensured cross-browser compatibility and consistent UI behavior.',
        'Improved UI responsiveness by reducing unnecessary component re-renders.',
      ],
      tech: ['React', 'Tailwind CSS', 'Vercel'],
      link: 'https://zenithzap.vercel.app',
    },
    {
      id: '3',
      title: 'Sentiment Analysis System',
      subtitle: 'NLP & Deep Learning',
      description: [
        'Engineered a Bidirectional LSTM-based sentiment analysis system.',
        'Achieved 82% accuracy on 200+ test samples through model tuning.',
        'Applied NLP preprocessing including tokenization, padding, and class imbalance handling.',
      ],
      tech: ['Python', 'TensorFlow', 'LSTM', 'NLP'],
      github: '#',
    },
    {
      id: '4',
      title: 'Environmental Monitoring IoT',
      subtitle: 'Real-Time Sensor Data System',
      description: [
        'Built an IoT-based system for real-time environmental data acquisition.',
        'Displayed live sensor readings on ThingSpeak dashboards.',
        'Ensured stable Wi-Fi-based data transmission with minimal packet loss.',
      ],
      tech: ['IoT', 'ThingSpeak', 'Sensors', 'Arduino'],
    },
  ],
}));
