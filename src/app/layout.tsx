import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Orbitron, Space_Grotesk } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Providers from '@/components/Providers';
import AppShell from '@/components/AppShell';
import { SITE } from '@/lib/site';
import './globals.css';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['500', '600', '700', '800', '900'], variable: '--font-hero', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.shortName}` },
  description: SITE.description,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  keywords: ['Full Stack Developer', 'MERN', 'React', 'Next.js', 'Three.js', 'Machine Learning', 'IoT', 'Portfolio', SITE.name],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE.url,
    siteName: SITE.shortName,
    title: SITE.title,
    description: SITE.description,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: SITE.title }],
  },
  twitter: { card: 'summary_large_image', title: SITE.title, description: SITE.description, images: ['/opengraph-image'] },
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#05070d' },
    { media: '(prefers-color-scheme: light)', color: '#f4f8fb' },
  ],
  width: 'device-width',
  initialScale: 1,
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.name,
  url: SITE.url,
  jobTitle: 'Full Stack Developer',
  email: `mailto:${SITE.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Visakhapatnam', addressCountry: 'IN' },
  sameAs: [SITE.github, SITE.linkedin],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
        {process.env.VERCEL ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}
