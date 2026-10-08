'use client';
/* Loader: "Space has a language", the nine-square plan in the centre, Blissfull Vastu beneath.
   Transform/opacity animations only (smooth while the 3D initialises); nine tiles open in Lo Shu order. */
import { useEffect, useState, type CSSProperties } from 'react';
import { site } from '@/data/site';
import s from './Loader.module.css';

const LOSHU = [4, 9, 2, 3, 5, 7, 8, 1, 6];
const px = (i: number) => 35 + (i % 3) * 15;
const py = (i: number) => 35 + Math.floor(i / 3) * 15;
const SEGS = Array.from({ length: 8 }, (_, k) => {
  const a = LOSHU.indexOf(k + 1), b = LOSHU.indexOf(k + 2);
  const x1 = px(a), y1 = py(a), x2 = px(b), y2 = py(b);
  return { x1, y1, len: Math.hypot(x2 - x1, y2 - y1) / 100, ang: (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI };
});
const TICKS = Array.from({ length: 72 }, (_, k) => {
  const a = (k / 72) * Math.PI * 2, r = 170, l = k % 9 === 0 ? 14 : 6;
  return `M${200 + Math.sin(a) * r} ${200 - Math.cos(a) * r}L${200 + Math.sin(a) * (r + l)} ${200 - Math.cos(a) * (r + l)}`;
}).join('');
const FINE = Array.from({ length: 10 }, (_, k) => 110 + k * 20).map((v) => `M110 ${v}H290M${v} 110V290`).join('');
const d = (ms: number) => ({ '--d': `${ms}ms` } as CSSProperties);

export default function Loader() {
  const [phase, setPhase] = useState<'load' | 'exit' | 'gone'>('load');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const html = document.documentElement;
    const minTime = reduced ? 300 : 2300;
    const t0 = performance.now();
    let done = false;
    html.style.overflow = 'hidden';

    const exit = () => {
      if (done) return;
      done = true;
      setPhase('exit');
      html.style.overflow = '';
      html.dataset.loaded = '1';
      window.dispatchEvent(new Event('loader:done'));
      setTimeout(() => setPhase('gone'), reduced ? 350 : 1400);
    };
    const onReady = () => setTimeout(exit, Math.max(0, minTime - (performance.now() - t0)));
    window.addEventListener('world:ready', onReady, { once: true });
    const cap = setTimeout(exit, 4000);
    return () => { clearTimeout(cap); window.removeEventListener('world:ready', onReady); html.style.overflow = ''; };
  }, []);

  if (phase === 'gone') return null;
  return (
    <div className={`${s.root} ${phase === 'exit' ? s.exit : ''}`} aria-hidden="true">
      <div className={s.tiles}>{Array.from({ length: 9 }, (_, i) => <i key={i} className={s.tile} style={d((LOSHU[i] - 1) * 55)} />)}</div>

      <div className={s.stage}>
        <p className={s.caption}>Space has a language</p>

        <div className={s.plate}>
          <div className={s.ringIn}>
            <div className={s.ringSpin}>
              <svg viewBox="0 0 400 400" className={s.svg}>
                <circle cx="200" cy="200" r="170" fill="none" stroke="currentColor" strokeWidth="0.8" />
                <circle cx="200" cy="200" r="158" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.45" />
                <path d={TICKS} stroke="currentColor" strokeWidth="0.7" />
              </svg>
              <span className={s.north}>N</span>
            </div>
          </div>
          <div className={s.gridIn}>
            <svg viewBox="0 0 400 400" className={s.svg}>
              <path d={FINE} stroke="currentColor" strokeWidth="0.5" opacity="0.22" fill="none" />
              <rect x="110" y="110" width="180" height="180" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M110 170H290M110 230H290M170 110V290M230 110V290" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
          </div>
          <i className={s.centre} />
          {SEGS.map((g, k) => (
            <i key={k} className={s.seg} style={{ left: `${g.x1}%`, top: `${g.y1}%`, '--len': g.len, '--ang': `${g.ang}deg`, ...d(760 + k * 120) } as CSSProperties} />
          ))}
          {LOSHU.map((n, i) => <span key={n} className={s.num} style={{ left: `${px(i)}%`, top: `${py(i)}%`, ...d(700 + (n - 1) * 120) }}>{n}</span>)}
        </div>

        <p className={s.brand}>{site.brand}</p>
      </div>
    </div>
  );
}