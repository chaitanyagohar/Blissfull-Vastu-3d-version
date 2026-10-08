'use client';
import { useEffect, useState } from 'react';
import { site } from '@/data/site';
import { bookHref } from '@/lib/links';
import Button from './Button';
import Mark from '@/components/brand/Mark';

const LINKS = [
  { href: '#vastu', label: 'Vastu' }, { href: '#numerology', label: 'Numerology' }, { href: '#navagraha', label: 'Navagraha' },
  { href: '#about', label: 'About' }, { href: '#contact', label: 'Contact' }
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const seen = new Set<Element>();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); });
      setDark(seen.size > 0);
    }, { rootMargin: '-40px 0px -92% 0px' });
    document.querySelectorAll('[data-theme="dark"]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);
  return (
    <>
      <header className={`nav ${dark ? 'on-dark' : ''}`}>
        <a href="#top" className="nav-mark" aria-label={`${site.brand}, back to top`}><Mark className="nav-logo" /><span>{site.brand}</span></a>
        <nav className="nav-links" aria-label="Main">{LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}</nav>
        <div className="nav-cta"><Button href={bookHref()} variant="solid">Book a consultation</Button></div>
        <button className="nav-toggle" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
      </header>
      <div id="menu" className={`menu ${open ? 'open' : ''}`} aria-hidden={!open} onClick={(e) => { if ((e.target as HTMLElement).closest('a')) setOpen(false); }}>
        <nav aria-label="Mobile">{LINKS.map((l, i) => <a key={l.href} href={l.href} tabIndex={open ? 0 : -1}><span className="label">{String(i + 1).padStart(2, '0')}</span>{l.label}</a>)}</nav>
        <Button href={bookHref()} variant="solid">Book a consultation</Button>
      </div>
    </>
  );
}