/** Single source of truth for portfolio content. */

export type Category = 'Web' | 'ML' | 'IoT';
export type CoverKind = 'plate' | 'bolt' | 'wave' | 'signal';

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  /** outcome-led one-liner, shown as the card headline */
  outcome: string;
  summary: string;
  description: string[];
  tech: string[];
  category: Category[];
  link?: string;
  github?: string;
  cover: CoverKind;
  /** cover gradient colours, hsl triples */
  hue: string;
  hue2: string;
  /** optional real screenshot (served from /public) */
  image?: string;
}

export const projects: Project[] = [
  {
    slug: 'velvet-plate',
    title: 'Velvet Plate',
    subtitle: 'Full-Stack SaaS Management System',
    outcome: 'One platform running every branch of a restaurant chain.',
    summary: 'A multi-tenant restaurant management platform with role-based access for admins, branch managers and customers.',
    description: [
      'Built a multi-tenant restaurant management platform with role-based access for Admins, Branch Managers, and Customers.',
      'Implemented dynamic menu and inventory management with branch-specific pricing and stock tracking.',
      'Developed a secure branch onboarding workflow with document verification.',
      'Integrated cloud-based media storage and built scalable APIs.',
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Cloud Storage'],
    category: ['Web'],
    github: '#',
    cover: 'plate',
    hue: '22 100% 60%',
    hue2: '340 100% 63%',
  },
  {
    slug: 'zenith-zap',
    title: 'Zenith-Zap Platform',
    subtitle: 'Mobile-First React Web Platform',
    outcome: 'A mobile-first platform trusted by 50+ daily users.',
    summary: 'A responsive React web platform with consistent behaviour across browsers and snappier interactions.',
    description: [
      'Created a mobile-first React web platform supporting 50+ daily active users.',
      'Ensured cross-browser compatibility and consistent UI behavior.',
      'Improved UI responsiveness by reducing unnecessary component re-renders.',
    ],
    tech: ['React', 'Tailwind CSS', 'Vercel'],
    category: ['Web'],
    link: 'https://zenithzap.vercel.app',
    cover: 'bolt',
    hue: '76 96% 58%',
    hue2: '186 96% 56%',
    image: '/projects/zenith-zap.jpg',
  },
  {
    slug: 'sentiment-analysis',
    title: 'Sentiment Analysis System',
    subtitle: 'NLP & Deep Learning',
    outcome: 'Reading tone in text at 82% accuracy with a BiLSTM.',
    summary: 'A bidirectional LSTM model that classifies sentiment, tuned and tested on 200+ samples.',
    description: [
      'Engineered a Bidirectional LSTM-based sentiment analysis system.',
      'Achieved 82% accuracy on 200+ test samples through model tuning.',
      'Applied NLP preprocessing including tokenization, padding, and class imbalance handling.',
    ],
    tech: ['Python', 'TensorFlow', 'LSTM', 'NLP'],
    category: ['ML'],
    github: '#',
    cover: 'wave',
    hue: '264 95% 72%',
    hue2: '340 100% 63%',
  },
  {
    slug: 'environmental-iot',
    title: 'Environmental Monitoring IoT',
    subtitle: 'Real-Time Sensor Data System',
    outcome: 'Live environmental data with minimal packet loss.',
    summary: 'An IoT system that captures sensor readings and streams them to live ThingSpeak dashboards over Wi-Fi.',
    description: [
      'Built an IoT-based system for real-time environmental data acquisition.',
      'Displayed live sensor readings on ThingSpeak dashboards.',
      'Ensured stable Wi-Fi-based data transmission with minimal packet loss.',
    ],
    tech: ['IoT', 'ThingSpeak', 'Sensors', 'Arduino'],
    category: ['IoT'],
    cover: 'signal',
    hue: '186 96% 56%',
    hue2: '264 95% 72%',
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const experiences = [
  {
    company: 'Spotmies LLP',
    role: 'Software Developer Intern',
    period: 'Dec 2025 – Present',
    short: 'Dec 2025 — Now',
    location: 'Remote',
    highlight: 'Building & maintaining scalable web apps',
    points: [
      'Contributing to core development tasks across the product.',
      'Collaborating with the team to build and maintain scalable web applications.',
    ],
  },
  {
    company: 'NTPC Limited',
    role: 'Software Engineer Intern',
    period: 'May 2025',
    short: 'May 2025',
    location: 'Visakhapatnam, India',
    highlight: 'Cut user interaction time by 35%',
    points: [
      'Improved frontend usability of internal web tools, reducing user interaction time by 35%.',
      'Resolved UI defects through cross-team collaboration, decreasing reported issues by 20%.',
    ],
  },
  {
    company: 'Zenith-Zap',
    role: 'Software Engineer Intern',
    period: 'May 2025 – Jun 2025',
    short: 'May — Jun 2025',
    location: 'Remote',
    highlight: 'Improved page load by 25%',
    points: [
      'Built responsive React interfaces, improving page load performance by 25%.',
      'Optimized API integration and state handling, reducing request latency by 15%.',
    ],
  },
];

export const certifications = [
  { title: 'AI-ML Virtual Internship', org: 'EduSkills Foundation', period: 'Apr 2025 – Jun 2025' },
  { title: 'MERN Full Stack Training', org: 'XceedIQ Innovate360', period: 'Jan 2024 – Jul 2024' },
];

export const education = [
  {
    school: 'GITAM University',
    degree: 'B.Tech in Computer Science (IoT)',
    period: 'Aug 2022 – Present',
    location: 'Visakhapatnam, India',
    grade: '7.03',
    gradeLabel: 'CGPA / 10',
    status: 'Ongoing',
    highlights: [
      'Specialization in Internet of Things (IoT)',
      'Coursework: Data Structures, DBMS, Computer Networks, ML Fundamentals',
      'Active participant in tech clubs and hackathons',
    ],
  },
  {
    school: 'Sri Chaitanya Junior College',
    degree: 'Senior Secondary (PCM)',
    period: '2020 – 2022',
    location: 'Visakhapatnam, India',
    grade: '85%',
    gradeLabel: 'Percentage',
    status: 'Completed',
    highlights: [
      'Physics, Chemistry, Mathematics (PCM)',
      'Built a strong foundation in analytical thinking',
      'First exposure to programming and computing concepts',
    ],
  },
];

export const skillGroups = [
  { title: 'Programming', skills: ['Python', 'Java', 'C', 'JavaScript', 'TypeScript', 'SQL'] },
  { title: 'Web', skills: ['HTML', 'CSS', 'React.js', 'Node.js', 'Express.js', 'REST APIs'] },
  { title: 'Data & Tools', skills: ['MongoDB', 'Git', 'GitHub', 'Firebase', 'Supabase', 'ThingSpeak', 'Figma'] },
  { title: 'Exploring', skills: ['Machine Learning', 'IoT', 'NLP', 'TensorFlow', 'Deep Learning'] },
];

export const strengths = [
  { label: 'Frontend Engineering', value: 90 },
  { label: 'Backend & APIs', value: 85 },
  { label: 'Databases', value: 80 },
  { label: 'Machine Learning', value: 60 },
];

export const timeline = [
  { year: 'Dec 2025 — Now', title: 'Software Developer Intern · Spotmies LLP', description: 'Building and maintaining scalable web applications with the core dev team.' },
  { year: '2025', title: 'Software Engineer Intern', description: 'Interned at NTPC Limited & Zenith-Zap — shipped features used by real users.' },
  { year: '2025', title: 'AI-ML Virtual Internship', description: 'Explored ML foundations & NLP through the EduSkills virtual internship.' },
  { year: '2024', title: 'MERN Full Stack Training', description: 'Intensive training at XceedIQ Innovate360 — built production-ready apps end to end.' },
  { year: '2022', title: 'Started B.Tech · GITAM University', description: 'Computer Science Engineering specializing in IoT.' },
  { year: '2020', title: 'Senior Secondary', description: 'Sri Chaitanya Junior College — PCM. Developed a strong interest in computing.' },
];

export const specializations = ['MERN Stack Development', 'API & Backend Engineering', 'IoT & Real-time Systems', 'Clean, Usable Interfaces'];

export const interests = [
  { title: 'Web Development', description: 'Building modern, responsive web applications with React and Node.js.' },
  { title: 'IoT Systems', description: 'Developing real-time sensor monitoring and data acquisition systems.' },
  { title: 'Scalable Systems', description: 'Designing multi-tenant architectures and optimized backend services.' },
  { title: 'Learning AI / ML', description: 'Exploring ML concepts through internships and personal projects.' },
];

export const softSkills = ['Problem Solving', 'Team Collaboration', 'Time Management', 'Adaptability'];

export const stats = [
  { value: 3, suffix: '+', label: 'Internships' },
  { value: 10, suffix: '+', label: 'Projects shipped' },
  { value: 82, suffix: '%', label: 'ML model accuracy' },
  { value: 35, suffix: '%', label: 'Faster UX delivered' },
];

export const PHOTO = 'https://res.cloudinary.com/dvf0ugwrr/image/upload/v1779630443/My_o9qgpi.jpg';
export const RESUME_URL = 'https://res.cloudinary.com/dvf0ugwrr/image/upload/fl_attachment/v1773757669/kartikeyaa-Resume_khl64p.pdf';
export const PHONE = '+91-8250977949';
