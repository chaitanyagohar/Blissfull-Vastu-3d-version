'use client';
/* Navigation: brand block · numbered roll-up links with an active-section indicator · status + CTA.
   Compacts after the first screen, hides on scroll-down / returns on scroll-up, dark glass over dark sections.
   Mobile: circular-reveal full-screen menu. */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { site } from '@/data/site';
import { bookHref } from '@/lib/links';
import Button from './Button';
import Mark from '@/components/brand/Mark';
import s from './Nav.module.css';

const LINKS = [
  { id: 'vastu', label: 'Vastu' },
  { id: 'numerology', label: 'Numerology' },
  { id: 'navagraha', label: 'Navagraha' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' }
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState('');
  const linksRef = useRef<HTMLElement>(null);
  const ind = useRef<HTMLSpanElement>(null);

  /* dark glass over dark sections */
  useEffect(() => {
    const seen = new Set<Element>();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); });
      setDark(seen.size > 0);
    }, { rootMargin: '-30px 0px -94% 0px' });
    document.querySelectorAll('[data-theme="dark"]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* active section */
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id === 'top' ? '' : e.target.id); });
    }, { rootMargin: '-45% 0px -54% 0px' });
    ['top', ...LINKS.map((l) => l.id)].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  /* indicator follows the active link */
  useEffect(() => {
    const wrap = linksRef.current, el = ind.current;
    if (!wrap || !el) return;
    const a = wrap.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!a) { el.style.opacity = '0'; return; }
    el.style.opacity = '1';
    el.style.transform = `translateX(${a.offsetLeft + a.offsetWidth / 2 - 3}px)`;
  }, [active]);

  /* compact + hide on scroll down / show on scroll up */
  useEffect(() => {
    let last = window.scrollY, raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setCompact(y > 80);
        if (Math.abs(y - last) > 8) { setHidden(y > last && y > window.innerHeight * 0.9); last = y; }
      });
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); if (raf) cancelAnimationFrame(raf); };
  }, []);

  /* menu: lock page, Escape closes */
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  const c = site.contact;
  const cls = [s.nav, dark && !open ? s.dark : '', compact ? s.compact : '', hidden && !open ? s.hidden : '', open ? s.isOpen : ''].join(' ');

  return (
    <>
      <header className={cls}>
        <a href="#top" className={s.brand} aria-label={`${site.brand}, back to top`} onClick={() => setOpen(false)}>
          <Mark className={s.logo} />
          <span className={s.brandText}>
            <span className={s.brandName}>{site.brand}</span>
            <span className={s.brandSub}>{site.name}</span>
          </span>
        </a>

        <nav className={s.links} ref={linksRef} aria-label="Main">
          {LINKS.map((l, i) => (
            <a key={l.id} href={`#${l.id}`} data-id={l.id} className={`${s.link} ${active === l.id ? s.on : ''}`} aria-current={active === l.id ? 'location' : undefined}>
              <sup>0{i + 1}</sup>
              <span className={s.roll}><span>{l.label}</span><span aria-hidden="true">{l.label}</span></span>
            </a>
          ))}
          <span ref={ind} className={s.indicator} aria-hidden="true" />
        </nav>

        <div className={s.actions}>
          <span className={s.status}><i aria-hidden="true" />Delhi NCR · Online</span>
          <span className={s.cta}><Button href={bookHref()} variant="solid">Book a consultation</Button></span>
          <button className={s.burger} aria-expanded={open} aria-controls="site-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
            <i /><i />
          </button>
        </div>
      </header>

      <div id="site-menu" className={`${s.menu} ${open ? s.menuOpen : ''}`} aria-hidden={!open} onClick={(e) => { if ((e.target as HTMLElement).closest('a')) setOpen(false); }}>
        <nav className={s.menuLinks} aria-label="Mobile">
          {LINKS.map((l, i) => (
            <a key={l.id} href={`#${l.id}`} tabIndex={open ? 0 : -1} style={{ '--i': i } as CSSProperties}>
              <span className={s.menuNum}>0{i + 1}</span>{l.label}
            </a>
          ))}
        </nav>
        <div className={s.menuFoot}>
          <Button href={bookHref()} variant="solid">Book a consultation</Button>
          <dl className={s.menuInfo}>
            {c.phone && <div><dt>Phone</dt><dd><a href={`tel:${c.phone.replace(/\s/g, '')}`} tabIndex={open ? 0 : -1}>{c.phone}</a></dd></div>}
            {c.email && <div><dt>Email</dt><dd><a href={`mailto:${c.email}`} tabIndex={open ? 0 : -1}>{c.email}</a></dd></div>}
            <div><dt>Languages</dt><dd>{site.languages.join(' · ')}</dd></div>
          </dl>
        </div>
      </div>
    </>
  );
}