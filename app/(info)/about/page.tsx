import type { Metadata } from 'next';
import Image from 'next/image';
import PageShell from '@/components/pages/PageShell';
import JsonLd from '@/components/seo/JsonLd';
import { site } from '@/data/site';
import { pageMeta } from '@/lib/seo';

const path = '/about';
export const metadata: Metadata = pageMeta({ path, title: `About ${site.name} · Vastu & Numerology, Delhi NCR`, description: `${site.name} offers Vastu and numerology consultations in Hindi and English, online and in person across Delhi NCR.` });

export default function AboutPage() {
  const p = site.photo;
  return (
    <PageShell crumb="About">
      <JsonLd path={path} crumbs={[{ name: 'Home', path: '/' }, { name: 'About', path }]} />
      <section className="pg-hero pg-greige">
        <div className="pg-wrap pg-split pg-about">
          {p && <div className="portrait tick"><Image src={p.src} alt={p.alt} fill priority sizes="(max-width: 900px) 92vw, 40vw" style={{ objectFit: 'cover', objectPosition: p.focus || 'center' }} /></div>}
          <div>
            <p className="label">About</p><h1 className="display pg-h1">{site.name}</h1><p className="pg-stand">{site.disciplines.join(' & ')} · Delhi NCR</p>
            {site.bio?.map((t, i) => <p key={i} className="pg-lede">{t}</p>)}
            <dl className="pg-dl"><div><dt className="label">Consultations</dt><dd>{site.modes.join(' · ')}</dd></div><div><dt className="label">Languages</dt><dd>{site.languages.join(' · ')}</dd></div><div><dt className="label">Serving</dt><dd>{site.areaServed.join(' · ')}</dd></div></dl>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
