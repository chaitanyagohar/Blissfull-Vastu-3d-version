import type { Metadata } from 'next';
import { site, services, type Service } from '@/data/site';

export const absolute = (p = '/') => new URL(p, site.url).toString();
export const SEO_TITLE = `${site.brand} · Vastu & Numerology by ${site.name}, Delhi NCR`;

export function pageMeta({ title = SEO_TITLE, description = site.description, path }: { title?: string; description?: string; path: string }): Metadata {
  const live = site.stage === 'live';
  return {
    title: { absolute: title }, description, alternates: { canonical: path },
    robots: live ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { title, description, url: path, siteName: site.brand, locale: 'en_IN', type: 'website' },
    twitter: { card: 'summary_large_image', title, description }
  };
}
const serviceNode = (s: Service) => ({ '@type': 'Service', name: s.title, description: s.text, url: absolute(s.path), provider: { '@id': absolute('/#practice') }, areaServed: 'Delhi NCR' });

export function jsonLd(path: string, crumbs?: { name: string; path: string }[], service?: Service) {
  const sameAs = site.social.map((s) => s.url).filter(Boolean) as string[];
  const verified = !site.demo;
  const g: unknown[] = [
    { '@type': 'WebSite', '@id': absolute('/#website'), url: absolute('/'), name: site.brand, inLanguage: 'en-IN', publisher: { '@id': absolute('/#practice') } },
    { '@type': 'Person', '@id': absolute('/#person'), name: site.name, url: absolute('/'), worksFor: { '@id': absolute('/#practice') }, knowsAbout: ['Vastu Shastra', 'Numerology'], knowsLanguage: site.languages, ...(site.photo ? { image: absolute(site.photo.src) } : {}) },
    {
      '@type': 'ProfessionalService', '@id': absolute('/#practice'), name: site.brand, url: absolute(path), description: site.description,
      founder: { '@id': absolute('/#person') }, areaServed: site.areaServed.map((name) => ({ '@type': 'City', name })), availableLanguage: site.languages,
      ...(site.photo ? { image: absolute(site.photo.src) } : {}),
      ...(sameAs.length ? { sameAs } : {}),
      ...(verified && site.contact.phone ? { telephone: site.contact.phone } : {}),
      ...(verified && site.contact.email ? { email: site.contact.email } : {}),
      ...(site.address.verified && site.address.street ? { address: { '@type': 'PostalAddress', streetAddress: site.address.street, addressLocality: site.address.city, addressRegion: site.address.region, postalCode: site.address.postalCode ?? undefined, addressCountry: site.address.country } } : {}),
      hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Consultations', itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: serviceNode(s) })) }
    }
  ];
  if (crumbs?.length) g.push({ '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absolute(c.path) })) });
  if (service) g.push(serviceNode(service));
  return { '@context': 'https://schema.org', '@graph': g };
}