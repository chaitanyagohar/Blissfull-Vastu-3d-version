'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { site } from '@/data/site';
import Reveal from '@/components/ui/Reveal';
import Img from '@/components/media/Img';
import Placeholder from '@/components/ui/Placeholder';

export default function About() {
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!frame.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = gsap.fromTo(frame.current, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: frame.current, start: 'top 80%', once: true } });
    return () => { t.kill(); };
  }, []);
  const p = site.photo;
  const [first, ...rest] = site.name.split(' ');
  return (
    <section id="about" className="block about profile" aria-labelledby="about-title">
      <div className="about-media">
        {p ? (
          <figure>
            <div ref={frame} className="portrait tick"><Image src={p.src} alt={p.alt} fill sizes="(max-width: 900px) 92vw, 38vw" style={{ objectFit: 'cover', objectPosition: p.focus || 'center' }} /></div>
            <figcaption className="label">{site.name} · {site.disciplines.join(' & ')}</figcaption>
          </figure>
        ) : <Placeholder need="A real portrait of Anshikaa (4:5)." className="photo-ph" />}
        <Img id="studio" className="about-detail" ratio="4 / 5" sizes="(max-width: 820px) 40vw, 14vw" />
      </div>
      <div className="about-copy">
        <p className="label">About</p>
        <Reveal as="h2" className="display name" id="about-title">{first} <em>{rest.join(' ')}</em></Reveal>
        <p className="label disciplines">{site.disciplines.join(' · ')} · Delhi NCR</p>
        {site.bio?.map((t, i) => <p key={i} className="lede">{t}</p>)}
        <dl className="facts">
          <div><dt className="label">Consultations</dt><dd>{site.modes.join(' · ')}</dd></div>
          <div><dt className="label">Languages</dt><dd>{site.languages.join(' · ')}</dd></div>
          <div><dt className="label">Serving</dt><dd>{site.areaServed.join(' · ')}</dd></div>
        </dl>
        <p className="label note"><Link href="/about">Read more about {first} →</Link></p>
      </div>
    </section>
  );
}
