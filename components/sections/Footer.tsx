import Link from 'next/link';
import { site, services } from '@/data/site';
import { media } from '@/data/media';
import VastuCompass from '@/components/editorial/VastuCompass';
import Magnetic from '@/components/ui/Magnetic';
import s from './Footer.module.css';

export default function Footer() {
  const c = site.contact;
  return (
    <footer className={s.footer}>
      <div className={s.top}>
        <div className={s.intro}>
          <div className={s.compass} aria-hidden="true"><VastuCompass onDark /></div>
          <p className={s.tag}>Space has a <em>language.</em></p>
        </div>

        <nav className={s.col} aria-label="Pages">
          <p className="label">Explore</p>
          {services.map((x) => <Link key={x.id} href={x.path}>{x.title}</Link>)}
          <Link href="/about">About {site.firstName}</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className={s.col}>
          <p className="label">Reach</p>
          {c.phone && <a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a>}
          {c.email && <a href={`mailto:${c.email}`}>{c.email}</a>}
          {site.social.map((x) => x.url
            ? <a key={x.label} href={x.url} target="_blank" rel="noopener noreferrer">{x.label}</a>
            : <span key={x.label}>{x.label}</span>)}
        </div>

        <div className={s.backWrap}>
          
            <a href="#top" className={s.back}>
              <span className={s.backIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M4 4h16v16H4zM9.33 4v16M14.67 4v16M4 9.33h16M4 14.67h16" />
                  <rect x="9.9" y="9.9" width="4.2" height="4.2" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <span>Back to the<br />first square</span>
            </a>
          
        </div>
      </div>

      <svg className={s.word} viewBox="0 0 1000 150" role="img" aria-label={site.brand}>
        <text x="0" y="128" textLength="1000" lengthAdjust="spacingAndGlyphs">{site.brand.toUpperCase()}</text>
      </svg>

      <div className={s.bottom}>
        <span className="label">© {new Date().getFullYear()} {site.brand} · {site.name}</span>
        {media.planetTextures && <span className="label">Planet maps: Solar System Scope, CC BY 4.0</span>}
        <span className="label">Website by OddLambda</span>
      </div>
    </footer>
  );
}