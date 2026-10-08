'use client';
/* Opening: drawing-sheet details + three alternating scenes (text ↔ image) while the 3D square unfolds. */
import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { useScrub } from '@/lib/useScrub';
import { site } from '@/data/site';
import Img from '@/components/media/Img';
import s from './Hero.module.css';

const RIBBON = ['Vastu', 'Numerology', 'Delhi NCR', 'Online & in person', 'Site visits', 'Hindi & English', 'Nine zones', 'Nine numbers'];

type Scene = { cls: string; side: 'left' | 'right'; kicker: string; text: ReactNode; media: 'interior' | 'numbers' | 'portrait' };
const SCENES: Scene[] = [
  { cls: 'scene-1', side: 'right', kicker: '01 · Space', text: <>Every room <em>faces</em> somewhere.</>, media: 'interior' },
  { cls: 'scene-2', side: 'left', kicker: '02 · Number', text: <>Every name <em>adds up</em> to something.</>, media: 'numbers' },
  { cls: 'scene-3', side: 'right', kicker: `03 · ${site.name}`, text: <>{site.firstName} reads <em>where the two meet.</em></>, media: 'portrait' }
];

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

const Compass = () => (<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1" /><path d="M8 3.2 9.4 8 8 12.8 6.6 8Z" fill="currentColor" /></svg>);
const Grid = () => (<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2h12v12H2zM6 2v12M10 2v12M2 6h12M2 10h12" fill="none" stroke="currentColor" strokeWidth="1" /><rect x="6.6" y="6.6" width="2.8" height="2.8" fill="currentColor" /></svg>);

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const time = useIST();
  const p = site.photo;

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
    tl.to('.hero-title', { yPercent: -25, opacity: 0, duration: 0.2 }, 0.05)
      .to('.hero-foot, .hero-meta, .hero-block, .hero-chip, .hero-label, .hero-marquee', { opacity: 0, duration: 0.08 }, 0.04);

    SCENES.forEach((sc, i) => {
      const at = 0.26 + i * 0.22, sel = `.${sc.cls}`, dir = sc.side === 'right' ? 1 : -1;
      tl.set(sel, { autoAlpha: 1 }, at)
        .fromTo(`${sel} .scene-img`, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.08, ease: 'power2.out' }, at)
        .fromTo(`${sel} .scene-zoom`, { scale: 1.22 }, { scale: 1, duration: 0.16 }, at)
        .fromTo(`${sel} .scene-text`, { autoAlpha: 0, x: 70 * dir }, { autoAlpha: 1, x: 0, duration: 0.08, ease: 'power2.out' }, at + 0.02);
      if (i < SCENES.length - 1) {
        tl.to(`${sel} .scene-img`, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.06, ease: 'power2.in' }, at + 0.16)
          .to(`${sel} .scene-text`, { autoAlpha: 0, x: -50 * dir, duration: 0.05, ease: 'power2.in' }, at + 0.16)
          .set(sel, { autoAlpha: 0 }, at + 0.22);
      } else {
        tl.to(sel, { autoAlpha: 0, duration: 0.05 }, 0.94);
      }
    });
  });

  return (
    <section ref={ref} id="top" data-chapter="0" className={`chapter ${s.root}`} style={{ '--h': '300vh' } as CSSProperties} aria-labelledby="hero-title">
      <div className={`stage hero ${s.stage}`}>
        <div className={s.glow} aria-hidden="true" />

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

        {/* three alternating scenes */}
        <div className={s.scenes}>
          {SCENES.map((sc, i) => (
            <div key={sc.cls} className={`${sc.cls} ${s.scene} ${sc.side === 'right' ? s.textRight : s.textLeft}`}>
              <figure className={`scene-img ${s.media}`}>
                <div className={`scene-zoom ${s.zoom}`}>
                  {sc.media === 'portrait'
                    ? (p && <Image src={p.src} alt={p.alt} fill sizes="(max-width: 820px) 46vw, 26vw" style={{ objectFit: 'cover', objectPosition: p.focus || 'center' }} />)
                    : <Img id={sc.media} ratio="4 / 5" sizes="(max-width: 820px) 46vw, 26vw" className={s.img} />}
                </div>
                <figcaption className={`label ${s.fig}`}>Fig. 0{i + 1}</figcaption>
              </figure>
              <div className={`scene-text ${s.text}`}>
                <span className="label">{sc.kicker}</span>
                <p className="display">{sc.text}</p>
              </div>
            </div>
          ))}
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
          <div className={s.track}>{[...RIBBON, ...RIBBON].map((w, i) => <span key={i}>{w}<i /></span>)}</div>
        </div>
      </div>
    </section>
  );
}