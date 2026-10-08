'use client';
import { useRef, type CSSProperties } from 'react';
import { useScrub } from '@/lib/useScrub';
import Img from '@/components/media/Img';

export default function Light() {
  const ref = useRef<HTMLElement>(null);
  useScrub(ref, (tl) => {
    tl.fromTo('.copy', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.12 }, 0.2).fromTo('.light-photo', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.15 }, 0.3).to(['.copy', '.light-photo'], { opacity: 0, duration: 0.1 }, 0.86);
  });
  return (
    <section ref={ref} id="light" data-chapter="5" data-theme="dark" className="chapter" style={{ '--h': '240vh' } as CSSProperties} aria-labelledby="light-title">
      <div className="stage light-stage">
        <div className="copy light-copy">
          <p className="label">Light</p>
          <h2 id="light-title" className="display h2">The sky’s light, <em>in a real room.</em></h2>
          <p className="lede">Where the morning reaches, where the afternoon falls, what the walls let in. A space is read in light as much as in lines.</p>
        </div>
        <Img id="jaali" className="light-photo" ratio="4 / 5" sizes="(max-width: 820px) 46vw, 22vw" fig />
      </div>
    </section>
  );
}
