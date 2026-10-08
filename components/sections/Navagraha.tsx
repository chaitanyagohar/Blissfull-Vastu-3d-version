'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useScrub } from '@/lib/useScrub';
import { world } from '@/lib/world';
import { loadSky } from '@/lib/sky';
import { GRAHAS } from '@/data/navagraha';

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
    return () => io.disconnect();
  }, []);
  const set = (id: string) => { world.focusGraha = id; setFocus(id); };
  return (
    <section ref={ref} id="navagraha" data-chapter="4" data-theme="dark" className="chapter" style={{ '--h': '300vh' } as CSSProperties} aria-labelledby="graha-title">
      <div className="stage">
        <div className="copy split-copy">
          <p className="label">03 · Navagraha</p>
          <h2 id="graha-title" className="display h2">Nine numbers. <em>Nine grahas.</em></h2>
          <p className="lede">In Indian tradition each number from one to nine is linked with a graha: the Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, and the shadow points Rahu and Ketu.</p>
          <ul className="grahas" onMouseLeave={() => set('')}>
            {GRAHAS.slice().sort((a, b) => a.n - b.n).map((g) => (
              <li key={g.id}>
                <button className={focus === g.id ? 'on' : ''} aria-pressed={focus === g.id} onMouseEnter={() => set(g.id)} onFocus={() => set(g.id)} onBlur={() => set('')} onClick={() => set(focus === g.id ? '' : g.id)}>
                  <span className="g-n">{g.n}</span><span className="g-sk">{g.sk}</span><span className="g-en">{g.en}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="label note">{when ? `Placed where they are in the sky on ${when}, as seen from Earth.` : 'Placed on their orbits around you, at the centre.'}</p>
        </div>
      </div>
    </section>
  );
}
