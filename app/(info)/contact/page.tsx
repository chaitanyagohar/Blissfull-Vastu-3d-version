import type { Metadata } from 'next';
import PageShell from '@/components/pages/PageShell';
import JsonLd from '@/components/seo/JsonLd';
import { site } from '@/data/site';
import { pageMeta } from '@/lib/seo';
import { bookHref, whatsappHref, extProps } from '@/lib/links';

const path = '/contact';
export const metadata: Metadata = pageMeta({ path, title: `Contact & Booking · ${site.name}`, description: 'Book a Vastu or numerology consultation with Anshikaa Purii: online, in person or a site visit across Delhi NCR.' });

export default function ContactPage() {
  const book = bookHref(), wa = whatsappHref();
  const c = site.contact, a = site.address;
  const place = [a.street, a.locality, a.city].filter(Boolean).join(', ');
  return (
    <PageShell crumb="Contact">
      <JsonLd path={path} crumbs={[{ name: 'Home', path: '/' }, { name: 'Contact', path }]} />
      <section className="pg-hero pg-peach">
        <div className="pg-wrap">
          <p className="label">Contact</p>
          <h1 className="display pg-h1">Bring your space <em>into alignment.</em></h1>
          <div className="pg-actions"><a className="btn btn-solid" href={book} {...extProps(book)}>Book a consultation</a>{wa && <a className="btn btn-line" href={wa} {...extProps(wa)}>WhatsApp</a>}</div>
          <address className="pg-contact">
            <dl className="pg-dl">
              {place && <div><dt className="label">Studio</dt><dd>{place}</dd></div>}
              {c.phone && <div><dt className="label">Phone</dt><dd><a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a></dd></div>}
              {c.email && <div><dt className="label">Email</dt><dd><a href={`mailto:${c.email}`}>{c.email}</a></dd></div>}
              <div><dt className="label">Formats</dt><dd>{site.modes.join(' · ')}</dd></div>
              <div><dt className="label">Languages</dt><dd>{site.languages.join(' · ')}</dd></div>
              <div><dt className="label">Areas</dt><dd>{site.areaServed.join(' · ')}</dd></div>
            </dl>
          </address>
        </div>
      </section>
    </PageShell>
  );
}
