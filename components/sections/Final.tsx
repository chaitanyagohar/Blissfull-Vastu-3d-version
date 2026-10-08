'use client';
/* Final CTA: full-screen opaque photograph + warm dark wash, bold uppercase headline, dark frosted bar. */
import Image from 'next/image';
import { useRef, type CSSProperties } from 'react';
import { useScrub } from '@/lib/useScrub';
import { site } from '@/data/site';
import { slot } from '@/data/media';
import { bookHref, whatsappHref } from '@/lib/links';
import Button from '@/components/ui/Button';
import s from './Final.module.css';

export default function Final() {
  const ref = useRef<HTMLElement>(null);
  const wa = whatsappHref();
  const bg = slot('cta');
  const c = site.contact, a = site.address;
  const place = [a.street, a.locality, a.city].filter(Boolean).join(', ');

  useScrub(ref, (tl) => {
    tl.fromTo('.final-bg', { scale: 1.12 }, { scale: 1, duration: 0.6 }, 0)
      .fromTo('.final-title', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.18 }, 0.22)
      .fromTo('.final-bar', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15 }, 0.4);
  });

  return (
    <section ref={ref} id="contact" data-chapter="7" data-theme="dark" className="chapter" style={{ '--h': '230vh' } as CSSProperties} aria-labelledby="final-title">
      <div className={`stage ${s.stage}`}>
        <div className={s.bgWrap} aria-hidden="true">
          <div className={`final-bg ${s.bg}`}>
            {bg.ready
              ? <Image src={bg.file} alt="" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: bg.focus || 'center' }} />
              : <i className={s.bgArt} />}
          </div>
          <i className={s.shade} />
        </div>

        <div className={s.head}>
          <p className="label">07 · Begin</p>
          <h2 id="final-title" className={`final-title ${s.title}`}>Bring your space <em>into alignment.</em></h2>
        </div>

        <div className={`final-bar ${s.bar}`}>
          <div className={s.actions}>
            <Button href={bookHref()} variant="solid">Book a consultation</Button>
            {wa && <Button href={wa}>WhatsApp</Button>}
            <p className="label">Online · In person · Site visits across Delhi NCR</p>
          </div>
          <address className={s.contact}>
            <dl>
              {place && <div><dt className="label">Studio</dt><dd>{place}</dd></div>}
              {c.phone && <div><dt className="label">Phone</dt><dd><a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a></dd></div>}
              {c.email && <div><dt className="label">Email</dt><dd><a href={`mailto:${c.email}`}>{c.email}</a></dd></div>}
              <div><dt className="label">Languages</dt><dd>{site.languages.join(' · ')}</dd></div>
              <div>
                <dt className="label">Social</dt>
                <dd className={s.socials}>
                  {site.social.map((x) => x.url
                    ? <a key={x.label} href={x.url} target="_blank" rel="noopener noreferrer">{x.label}</a>
                    : <span key={x.label}>{x.label}</span>)}
                </dd>
              </div>
            </dl>
          </address>
        </div>
      </div>
    </section>
  );
}