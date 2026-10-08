import type { Metadata } from 'next';
import PageShell from '@/components/pages/PageShell';
import JsonLd from '@/components/seo/JsonLd';
import Plate from '@/components/editorial/Plate';
import { site, services } from '@/data/site';
import { pageMeta } from '@/lib/seo';
import { bookHref, extProps } from '@/lib/links';

const service = services.find((s) => s.id === 'vastu')!;
const path = '/vastu-consultation';
export const metadata: Metadata = pageMeta({ path, title: `Vastu Consultation in Delhi NCR · ${site.name}`, description: 'Vastu consultations with Anshikaaa Purii for homes and workplaces across Delhi NCR: online, in person or as a site visit, in Hindi or English.' });
const COVERS = [
  ['Directions', 'How the plan sits on the eight directions, and which rooms face where.'],
  ['The nine zones', 'The Vastu Purusha Mandala read across your floor plan.'],
  ['The centre', 'The Brahmasthan, the centre of the space, and how it is used.'],
  ['Entrances & light', 'Where you enter, where light and air come in.'],
  ['Room placement', 'Kitchen, bedrooms, workspace and puja room within the plan.']
];

export default function VastuPage() {
  const book = bookHref();
  return (
    <PageShell crumb="Vastu consultation">
      <JsonLd path={path} service={service} crumbs={[{ name: 'Home', path: '/' }, { name: 'Vastu consultation', path }]} />
      <section className="pg-hero pg-cream">
        <div className="pg-wrap pg-split">
          <div><p className="label">Vastu · Delhi NCR</p><h1 className="display pg-h1">Vastu consultation <em>in Delhi NCR</em></h1><p className="pg-lede">{service.text}</p><a className="btn btn-solid" href={book} {...extProps(book)}>Book a Vastu consultation</a></div>
          <Plate />
        </div>
      </section>
      <section className="pg-sec pg-greige"><div className="pg-wrap"><h2 className="display pg-h2">What a consultation <em>looks at</em></h2><ol className="pg-list">{COVERS.map(([t, d], i) => <li key={t}><span className="label">0{i + 1}</span><h3 className="display">{t}</h3><p>{d}</p></li>)}</ol></div></section>
      <section className="pg-sec pg-cream"><div className="pg-wrap pg-facts"><h2 className="display pg-h2">How it <em>works</em></h2><dl><div><dt className="label">Formats</dt><dd>{site.modes.join(' · ')}</dd></div><div><dt className="label">Languages</dt><dd>{site.languages.join(' · ')}</dd></div><div><dt className="label">Areas</dt><dd>{site.areaServed.join(' · ')}</dd></div></dl></div></section>
    </PageShell>
  );
}
