'use client';
/* Opening as an architect's drawing sheet: crop marks, ruler, discipline tags, live IST clock,
   title block and a slow word ribbon around the existing headline and 3D square. */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { useScrub } from '@/lib/useScrub';
import { site } from '@/data/site';
import s from './Hero.module.css';

const RIBBON = ['Vastu', 'Numerology', 'Delhi NCR', 'Online & in person', 'Site visits', 'Hindi & English', 'Nine zones', 'Nine numbers'];

function useIST() {
  const [t, setT] = useState('--:--');
  useEffect(() => {
    const f = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
    const u = () => setT(f.format(new Date()));
    u();
    const id = setInterval(u, 30000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const Compass = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1" /><path d="M8 3.2 9.4 8 8 12.8 6.6 8Z" fill="currentColor" /></svg>
);
const Grid = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2h12v12H2zM6 2v12M10 2v12M2 6h12M2 10h12" fill="none" stroke="currentColor" strokeWidth="1" /><rect x="6.6" y="6.6" width="2.8" height="2.8" fill="currentColor" /></svg>
);

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const time = useIST();

  useEffect(() => {
    let play: (() => void) | null = null;
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
        .from('.hero-label, .hero-chip', { opacity: 0, y: 12, duration: 0.8, stagger: 0.07 })
        .from('.hero-meta > *', { opacity: 0, y: 10, duration: 0.7, stagger: 0.06 }, '<0.1')
        .from('.hero-title .ln > span', { yPercent: 115, duration: 1.5, ease: 'expo.out', stagger: 0.12 }, '-=0.6')
        .from('.hero-h1-sub', { opacity: 0, y: 10, duration: 0.9 }, '-=1.1')
        .from('.hero-block', { opacity: 0, y: 16, duration: 0.9 }, '-=0.9')
        .from('.hero-foot, .hero-marquee', { opacity: 0, duration: 1 }, '-=0.8');
      play = () => tl.play();
      if (document.documentElement.dataset.loaded) play();
      else window.addEventListener('loader:done', play, { once: true });
    }, ref);
    return () => { if (play) window.removeEventListener('loader:done', play); ctx.revert(); };
  }, []);

  useScrub(ref, (tl) => {
    tl.to('.hero-title', { yPercent: -25, opacity: 0, duration: 0.22 }, 0.06)
      .to('.hero-foot, .hero-meta, .hero-block, .hero-chip, .hero-label, .hero-marquee', { opacity: 0, duration: 0.08 }, 0.04);
    ['.s1', '.s2', '.s3'].forEach((sel, i) => {
      const at = 0.3 + i * 0.2;
      tl.fromTo(sel, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.07 }, at);
      if (i < 2) tl.to(sel, { opacity: 0, y: -30, duration: 0.06 }, at + 0.14);
      else tl.to(sel, { opacity: 0, duration: 0.05 }, 0.94);
    });
  });

  return (
    <section ref={ref} id="top" data-chapter="0" className={`chapter ${s.root}`} style={{ '--h': '260vh' } as CSSProperties} aria-labelledby="hero-title">
      <div className={`stage hero ${s.stage}`}>
        <div className={s.glow} aria-hidden="true" />
        <div className={s.frame} aria-hidden="true"><i /><i /><i /><i /></div>
        <div className={s.ruler} aria-hidden="true" />

        <div className={s.top}>
          <div className={s.topLeft}>
            <p className="label hero-label">Sheet 00 · Delhi NCR</p>
            <ul className={s.chips} aria-label="Disciplines">
              <li className={`hero-chip ${s.chip}`}><Compass />Vastu</li>
              <li className={`hero-chip ${s.chip}`}><Grid />Numerology</li>
            </ul>
          </div>
          <div className={`hero-meta ${s.meta}`} aria-hidden="true">
            <span className="label">Fig. 00 · The first square</span>
            <span className="label">28.6139° N · 77.2090° E</span>
            <span className="label">New Delhi · {time} IST</span>
          </div>
        </div>

        <h1 id="hero-title" className={`display hero-title ${s.title}`}>
          <span className="ln"><span>Space has</span></span>
          <span className="ln"><span>a <em>language.</em></span></span>
          <span className="hero-h1-sub">Vastu &amp; numerology consultations with {site.name} · Delhi NCR</span>
        </h1>

        <div className="hero-seq">
          <p className="seq s1">Every room <em>faces</em> somewhere.</p>
          <p className="seq s2">Every name <em>adds up</em> to something.</p>
          <p className="seq s3">{site.name.split(' ')[0]} reads <em>where the two meet.</em></p>
        </div>

        <div className={s.bottom}>
          <div className={`hero-foot ${s.foot}`}>
            <span className="label">Online · In person · Hindi &amp; English</span>
            <span className={`label ${s.cue}`} aria-hidden="true"><i />Scroll · the grid opens</span>
          </div>
          <dl className={`hero-block ${s.block}`} aria-hidden="true">
            <div><dt>Project</dt><dd>Your space</dd></div>
            <div><dt>Read by</dt><dd>{site.name}</dd></div>
            <div><dt>Scale</dt><dd>1 : 1</dd></div>
            <div><dt>Sheet</dt><dd>00 / 07</dd></div>
          </dl>
        </div>

        <div className={`hero-marquee ${s.marquee}`} aria-hidden="true">
          <div className={s.track}>
            {[...RIBBON, ...RIBBON].map((w, i) => <span key={i}>{w}<i /></span>)}
          </div>
        </div>
      </div>
    </section>
  );
}