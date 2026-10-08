'use client';
import { useRef, type CSSProperties } from 'react';
import { useScrub } from '@/lib/useScrub';
import { site } from '@/data/site';
import { bookHref, whatsappHref } from '@/lib/links';
import Button from '@/components/ui/Button';
import Film from '@/components/media/Film';

export default function Final() {
  const ref = useRef<HTMLElement>(null);
  const wa = whatsappHref();
  const c = site.contact, a = site.address;
  const place = [a.street, a.locality, a.city].filter(Boolean).join(', ');
  useScrub(ref, (tl) => {
    tl.fromTo('.final-title', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.18 }, 0.3)
      .fromTo('.final-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.12 }, 0.45)
      .fromTo('.final-film', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.15 }, 0.5)
      .fromTo('.contact', { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.55);
  });
  return (
    <section ref={ref} id="contact" data-chapter="7" className="chapter" style={{ '--h': '230vh' } as CSSProperties} aria-labelledby="final-title">
      <div className="stage center-stage final">
        <div className="final-inner">
          <h2 id="final-title" className="display final-title">Bring your space <em>into alignment.</em></h2>
          <div className="final-actions">
            <Button href={bookHref()} variant="solid">Book a consultation</Button>
            {wa && <Button href={wa}>WhatsApp</Button>}
          </div>
          <div className="final-row">
            <Film id="dawn" className="final-film tick" />
            <address className="contact">
              <ul>
                {place && <li><span className="label">Studio</span>{place}</li>}
                {c.phone && <li><span className="label">Phone</span><a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a></li>}
                {c.email && <li><span className="label">Email</span><a href={`mailto:${c.email}`}>{c.email}</a></li>}
                <li><span className="label">Languages</span>{site.languages.join(' · ')}</li>
                <li><span className="label">Social</span><span className="socials">{site.social.map((s) => s.url ? <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a> : <span key={s.label}>{s.label}{s.handle.startsWith('@') ? ` ${s.handle}` : ''}</span>)}</span></li>
              </ul>
            </address>
          </div>
        </div>
      </div>
    </section>
  );
}
