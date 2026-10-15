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
  /** long-form write-up; when present the project page renders the full case study */
  caseStudy?: CaseStudy;
}

export interface CaseShot {
  src: string;
  alt: string;
  caption: string;
}

export interface CaseRole {
  id: string;
  label: string;
  tagline: string;
  shot: CaseShot;
  points: string[];
}

export interface CaseStudy {
  role: string;
  /** the problem, written as the product's reason to exist */
  problem: { heading: string; body: string[] };
  stats: { value: string; label: string }[];
  roles: CaseRole[];
  /** ordered states an order moves through */
  lifecycle: { step: string; note: string }[];
  decisions: { title: string; body: string }[];
  gallery: CaseShot[];
  mobile: CaseShot[];
  /** full-length page capture, scrolled on hover */
  scrollShot: CaseShot;
  stack: { name: string; use: string }[];
  next: string[];
  note: string;
}

const vp = (f: string) => `/projects/velvet-plate/${f}.jpg`;

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
    link: 'https://velvet-plate.vercel.app/',
    github: '#',
    cover: 'plate',
    hue: '18 90% 70%',
    hue2: '36 95% 76%',
    image: vp('landing-hero'),
    caseStudy: {
      role: 'Product design · Full-stack engineering',
      problem: {
        heading: 'A restaurant brand is really a network of kitchens.',
        body: [
          'Growing from one kitchen to many breaks the tools a single restaurant gets away with: menus drift between locations, stock and pricing differ by branch, and every new outlet has to be vetted before it can take a single order.',
          'Velvet Plate treats the brand as a platform. Diners get one calm place to order from their nearest branch, branch managers get a console for their own kitchen, and the admin sees the whole network — with strict boundaries between the three.',
        ],
      },
      stats: [
        { value: '3', label: 'role-based experiences' },
        { value: '4', label: 'order states, one tap each' },
        { value: '2', label: 'dining modes: dine-in & takeaway' },
        { value: '15%', label: 'platform fee, shown to every partner' },
      ],
      roles: [
        {
          id: 'diner',
          label: 'Diner',
          tagline: 'Warm, editorial and fast to order from.',
          shot: { src: vp('customer-menu'), alt: 'Velvet Plate customer menu with dish photography', caption: 'Branch-aware menu with category filters and search' },
          points: [
            'Pick the nearest branch from a searchable location picker grouped by city.',
            'Browse that branch’s live menu — veg / non-veg markers, quantity steppers and one-tap add to cart.',
            'Check out as dine-in or takeaway with a transparent SGST / CGST breakdown.',
            'Follow every order from Received to Completed.',
          ],
        },
        {
          id: 'manager',
          label: 'Branch manager',
          tagline: 'A calm, dense console for running one kitchen.',
          shot: { src: vp('manager-orders'), alt: 'Partner Center live order board', caption: 'Live order board — advance an order with a single button' },
          points: [
            'Dashboard with gross revenue, platform fee, completed orders and average order value.',
            'Live order board that moves tickets Received → Preparing → Ready → Completed.',
            'Menu management with per-branch price and availability.',
            'Store profile, verification status and payouts in one place.',
          ],
        },
        {
          id: 'admin',
          label: 'Admin',
          tagline: 'The whole network at a glance.',
          shot: { src: vp('admin-overview'), alt: 'Admin Platform Pulse dashboard', caption: 'Platform Pulse — sales, orders and top outlets across every branch' },
          points: [
            'Platform Pulse with 7D / 30D / 90D / 12M windows and period-over-period deltas.',
            'Branch directory with live, hidden, in-review and rejected states, revenue and order counts.',
            'Application review for new partners: documents, bank details, approve or reject.',
            'Global menu items that appear in every branch alongside branch-only items.',
          ],
        },
      ],
      lifecycle: [
        { step: 'Received', note: 'Customer places the order' },
        { step: 'Preparing', note: 'Kitchen picks it up' },
        { step: 'Ready', note: 'Plated and waiting' },
        { step: 'Completed', note: 'Handed over and counted in revenue' },
      ],
      decisions: [
        {
          title: 'Two visual languages, one brand',
          body: 'Diners get warm cream, a serif display face and generous dish photography. Staff tools drop the ornament for dark sidebars, tight tables and clear status colour — same orange, different job.',
        },
        {
          title: 'Tenancy is a product rule, not a filter',
          body: 'Every query is scoped by role and branch on the server. A manager can only ever see their own orders and menu; only admins see across branches. The UI mirrors those boundaries so no one lands on a screen they cannot use.',
        },
        {
          title: 'Onboarding is a gate',
          body: 'A new branch moves from pending to under review to verified before it appears to diners. Admins check legal identity, payout bank details and licence documents in a single review screen.',
        },
        {
          title: 'Money is never a surprise',
          body: 'Checkout itemises SGST and CGST, and partner dashboards show gross revenue next to the 15% platform fee so settlements are predictable.',
        },
      ],
      gallery: [
        { src: vp('admin-analytics'), alt: 'Admin analytics with sales velocity, weekday and hourly demand charts', caption: 'Analytics — sales velocity, weekday mix and the busiest hours' },
        { src: vp('manager-dashboard'), alt: 'Branch manager dashboard with revenue chart and order distribution', caption: 'Partner dashboard — revenue trend and dine-in vs takeaway' },
        { src: vp('admin-branches'), alt: 'Admin branch directory with status and revenue', caption: 'Branch directory — status, revenue and orders per outlet' },
        { src: vp('customer-cart'), alt: 'Checkout with dine-in and takeaway selection', caption: 'Checkout — order type, payment and tax breakdown' },
        { src: vp('customer-orders'), alt: 'Customer order history', caption: 'Order history with live status' },
        { src: vp('admin-requests'), alt: 'Admin application review screen', caption: 'Application review — verify a branch before it goes live' },
      ],
      mobile: [
        { src: vp('m-landing'), alt: 'Velvet Plate landing page on mobile', caption: 'Landing' },
        { src: vp('m-menu'), alt: 'Menu on mobile', caption: 'Menu' },
        { src: vp('m-cart'), alt: 'Checkout on mobile', caption: 'Checkout' },
        { src: vp('m-admin'), alt: 'Admin dashboard on mobile', caption: 'Admin' },
      ],
      scrollShot: { src: vp('landing-full'), alt: 'Full Velvet Plate landing page', caption: 'Landing page — hover to scroll the full length' },
      stack: [
        { name: 'React + Vite', use: 'Three role-based front ends, one codebase' },
        { name: 'TanStack Query · Zustand', use: 'Server cache, cart and session state' },
        { name: 'Tailwind · Motion', use: 'Design system and interaction polish' },
        { name: 'Node · Express', use: 'REST API with role and branch guards' },
        { name: 'Prisma · MongoDB', use: 'Orders, branches, catalogue and carts' },
        { name: 'Cloudinary · Resend', use: 'Media storage and transactional email' },
      ],
      next: [
        'UPI and card payments — the checkout already reserves the slots.',
        'Push-based order updates so the kitchen board never needs a refresh.',
        'Per-branch opening hours surfaced to diners at order time.',
      ],
      note: 'Dashboards are shown with sample data so the charts have something to say.',
    },
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
    hue: '18 90% 70%',
    hue2: '36 95% 76%',
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
    hue: '60 22% 92%',
    hue2: '60 22% 92%',
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
    hue: '90 6% 68%',
    hue2: '90 6% 68%',
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const experiences = [
  {
    company: 'Spotmies LLP',
    role: 'Software Developer',
    period: 'Dec 2025 – Present',
    // shown stacked on the Experience page, newest first
    periods: ['Jul 2026 – Present · Full-time', 'Dec 2025 – Jun 2026 · Intern'],
    short: 'Dec 2025 — Now',
    location: 'Remote',
    highlight: 'Intern to full-time on the core dev team',
    points: [
      'Joined as a Software Developer Intern in Dec 2025 and moved to a full-time role in Jul 2026.',
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
  { title: 'Web', skills: ['HTML', 'CSS', 'React.js', 'Next.js', 'Node.js', 'Express.js', 'REST APIs'] },
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
  { year: 'Dec 2025 — Now', title: 'Software Developer · Spotmies LLP', description: 'Joined as an intern, full-time since Jul 2026 — building and maintaining scalable web applications with the core dev team.' },
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
export const RESUME_URL = 'https://res.cloudinary.com/dvf0ugwrr/image/upload/fl_attachment:kartikeya-resume/v1791798886/Kartikeya01_go1lam.pdf';
export const PHONE = '+91-8250977949';
