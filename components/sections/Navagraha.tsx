'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useScrub } from '@/lib/useScrub';
import { world } from '@/lib/world';
import { loadSky } from '@/lib/sky';
import { GRAHAS } from '@/data/navagraha';
import s from './Navagraha.module.css';

export default function NavagrahaSection() {
  const ref = useRef<HTMLElement>(null);
  const [focus, setFocus] = useState('');
  const [when, setWhen] = useState<string | null>(null);
  useScrub(ref, (tl) => { tl.fromTo('.copy', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.12 }, 0.12).to('.copy', { opacity: 0, duration: 0.1 }, 0.86); });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      loadSky().then(() => setWhen(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }))).catch(() => setWhen(null));
    }, { rootMargin: '1400px 0px' });
    io.observe(el);
    const leave = new IntersectionObserver(([e]) => { if (!e.isIntersecting) { world.focusGraha = ''; setFocus(''); } });
    leave.observe(el);
    return () => { io.disconnect(); leave.disconnect(); };
  }, []);

  const set = (id: string) => { world.focusGraha = id; setFocus(id); };
  const g = GRAHAS.find((x) => x.id === focus);

  return (
    <section ref={ref} id="navagraha" data-chapter="4" data-theme="dark" className="chapter" style={{ '--h': '300vh' } as CSSProperties} aria-labelledby="graha-title">
      <div className="stage">
        <div className="copy split-copy">
          <p className="label">03 · Navagraha</p>
          <h2 id="graha-title" className="display h2">Nine numbers. <em>Nine grahas.</em></h2>
          <p className="lede">In Indian tradition each number from one to nine is linked with a graha: the Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, and the shadow points Rahu and Ketu.</p>
          <ul className="grahas" onMouseLeave={() => set('')}>
            {GRAHAS.slice().sort((a, b) => a.n - b.n).map((x) => (
              <li key={x.id}>
                <button className={focus === x.id ? 'on' : ''} aria-pressed={focus === x.id} onMouseEnter={() => set(x.id)} onFocus={() => set(x.id)} onClick={() => set(focus === x.id ? '' : x.id)}>
                  <span className="g-n">{x.n}</span><span className="g-sk">{x.sk}</span><span className="g-en">{x.en}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="label note">
            {when ? `Placed in the real sky of ${when}.` : 'Placed on their orbits around you.'} Hover or tap a graha for its colour, day, gemstone and element.
          </p>
        </div>

        <aside className={`${s.card} ${g ? s.show : ''}`} style={{ '--g': g?.colour ?? '#C29A6C' } as CSSProperties} aria-live="polite">
          {g && (
            <div key={g.id} className={s.inner}>
              <div className={s.head}>
                <span className={s.orb} aria-hidden="true" />
                <div><p className={s.name}>{g.sk}</p><p className={s.sub}>{g.en} · Number {g.n}</p></div>
              </div>
              <dl className={s.rows}>
                <div><dt>Colour</dt><dd><i className={s.swatch} aria-hidden="true" />{g.colourName}</dd></div>
                <div><dt>Day</dt><dd>{g.day}</dd></div>
                <div><dt>Gemstone</dt><dd>{g.gem}</dd></div>
                <div><dt>Element</dt><dd>{g.element}</dd></div>
              </dl>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}