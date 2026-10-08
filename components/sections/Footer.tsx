import Link from 'next/link';
import { site, services } from '@/data/site';
import { media } from '@/data/media';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-row">
        <span className="display footer-name">{site.brand}</span>
        <span className="label">{site.name} · {site.disciplines.join(' · ')} · Delhi NCR</span>
      </div>
      <nav className="footer-links" aria-label="Pages">
        {services.map((s) => <Link key={s.id} href={s.path}>{s.title}</Link>)}
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      <p className="footer-note">Guidance follows traditional Vastu and numerology practice and is not a substitute for professional, medical, legal or financial advice.</p>
      <div className="footer-row small">
        <span className="label">© {new Date().getFullYear()} {site.brand}</span>
        {media.planetTextures && <span className="label">Planet maps: Solar System Scope, CC BY 4.0</span>}
        <span className="label">Website by OddLambda</span>
      </div>
    </footer>
  );
}