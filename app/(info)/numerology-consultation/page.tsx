import type { Metadata } from 'next';
import PageShell from '@/components/pages/PageShell';
import JsonLd from '@/components/seo/JsonLd';
import { site, services } from '@/data/site';
import { pageMeta } from '@/lib/seo';
import { bookHref, extProps } from '@/lib/links';
import { LOSHU } from '@/lib/numerology';

const service = services.find((s) => s.id === 'numerology')!;
const path = '/numerology-consultation';
export const metadata: Metadata = pageMeta({ path, title: `Numerology Consultation in Delhi NCR & Online · ${site.name}`, description: 'Numerology consultations with Anshikaaa Purii: your date of birth and name read together. Online or in person across Delhi NCR, in Hindi or English.' });
const COVERS = [
  ['Root number', 'Mulank: from the day you were born.'],
  ['Destiny number', 'Bhagyank: from your full date of birth.'],
  ['Name number', 'The numbers carried by your name.'],
  ['Lo Shu grid', 'Which numbers appear in your date of birth, and which are missing.']
];

export default function NumerologyPage() {
  const book = bookHref();
  return (
    <PageShell crumb="Numerology consultation">
      <JsonLd path={path} service={service} crumbs={[{ name: 'Home', path: '/' }, { name: 'Numerology consultation', path }]} />
      <section className="pg-hero pg-peach">
        <div className="pg-wrap pg-split">
          <div><p className="label">Numerology · Online & Delhi NCR</p><h1 className="display pg-h1">Numerology consultation <em>online & in Delhi NCR</em></h1><p className="pg-lede">{service.text}</p><a className="btn btn-solid" href={book} {...extProps(book)}>Book a numerology consultation</a></div>
          <div className="pg-loshu" aria-label="The Lo Shu square" role="img">{LOSHU.map((n) => <span key={n} className="display">{n}</span>)}</div>
        </div>
      </section>
      <section className="pg-sec pg-cream"><div className="pg-wrap"><h2 className="display pg-h2">What a consultation <em>looks at</em></h2><ol className="pg-list">{COVERS.map(([t, d], i) => <li key={t}><span className="label">0{i + 1}</span><h3 className="display">{t}</h3><p>{d}</p></li>)}</ol></div></section>
      <section className="pg-sec pg-greige"><div className="pg-wrap pg-facts"><h2 className="display pg-h2">How it <em>works</em></h2><dl><div><dt className="label">Formats</dt><dd>Online · In person</dd></div><div><dt className="label">Languages</dt><dd>{site.languages.join(' · ')}</dd></div><div><dt className="label">Areas</dt><dd>{site.areaServed.join(' · ')} and online</dd></div></dl></div></section>
    </PageShell>
  );
}
