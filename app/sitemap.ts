import type { MetadataRoute } from 'next';
import { site, services } from '@/data/site';
export default function sitemap(): MetadataRoute.Sitemap {
  if (site.stage !== 'live') return [];
  const now = new Date();
  return [
    { url: new URL('/', site.url).toString(), lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...services.map((s) => ({ url: new URL(s.path, site.url).toString(), lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: new URL('/about', site.url).toString(), lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: new URL('/contact', site.url).toString(), lastModified: now, changeFrequency: 'yearly', priority: 0.7 }
  ];
}
