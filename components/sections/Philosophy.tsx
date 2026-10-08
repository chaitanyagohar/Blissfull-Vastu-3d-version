'use client';
import { useRef, type CSSProperties } from 'react';
import { useScrub } from '@/lib/useScrub';

const WORDS = [
  { w: 'Space', t: 'Every home and workplace is a plan of directions.' },
  { w: 'Number', t: 'Every name and date of birth carries numbers.' },
  { w: 'Energy', t: 'Traditional practice reads how the two interact.' },
  { w: 'Life', t: 'So the places and choices around you feel right.' }
];

export default function Philosophy() {
  const ref = useRef<HTMLElement>(null);
  useScrub(ref, (tl) => {
    WORDS.forEach((_, i) => {
      const at = 0.04 + i * 0.23;
      tl.fromTo(`.pw-${i}`, { opacity: 0, yPercent: 30 }, { opacity: 1, yPercent: 0, duration: 0.07 }, at);
      tl.to(`.pw-${i}`, { opacity: 0, yPercent: -20, duration: 0.05 }, at + 0.17);
    });
  });
  return (
    <section ref={ref} id="philosophy" data-chapter="1" className="chapter" style={{ '--h': '320vh' } as CSSProperties} aria-labelledby="idea-title">
      <div className="stage">
        <h2 id="idea-title" className="label stage-label">The idea</h2>
        {WORDS.map((x, i) => (
          <div key={x.w} className={`pword pw-${i}`}>
            <span className="label">{String(i + 1).padStart(2, '0')} / 04</span>
            <p className="display pword-w">{x.w}</p>
            <p>{x.t}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
