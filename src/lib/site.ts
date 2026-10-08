export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kartikeyaa.me',
  name: 'B Venkata Sai Kartikeya',
  shortName: 'Kartikeya',
  title: 'Kartikeya | Full Stack Developer',
  description:
    'Portfolio of B Venkata Sai Kartikeya — Full Stack Developer specializing in the MERN stack, Machine Learning, and IoT.',
  email: 'kartikeyaa15@gmail.com',
  github: 'https://github.com/kartixk',
  linkedin: 'https://linkedin.com/in/b-venkata-sai-kartikeya-28a99b357',
} as const;

export const ROUTES = [
  { path: '/', label: 'Home', priority: 1 },
  { path: '/about', label: 'About', priority: 0.8 },
  { path: '/projects', label: 'Projects', priority: 0.9 },
  { path: '/skills', label: 'Skills', priority: 0.7 },
  { path: '/experience', label: 'Experience', priority: 0.7 },
  { path: '/education', label: 'Education', priority: 0.6 },
  { path: '/contact', label: 'Contact', priority: 0.8 },
] as const;
