import type { MetadataRoute } from 'next';
import { ROUTES, SITE } from '@/lib/site';
import { projects } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ROUTES.map(({ path, priority }) => ({
    url: `${SITE.url}${path === '/' ? '' : path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority,
  }));
  const cases = projects.map((p) => ({
    url: `${SITE.url}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  return [...pages, ...cases];
}
