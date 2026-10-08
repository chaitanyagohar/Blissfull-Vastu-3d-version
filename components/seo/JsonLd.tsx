import { jsonLd } from '@/lib/seo';
import type { Service } from '@/data/site';

export default function JsonLd({ path, crumbs, service }: { path: string; crumbs?: { name: string; path: string }[]; service?: Service }) {
  const json = JSON.stringify(jsonLd(path, crumbs, service)).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
