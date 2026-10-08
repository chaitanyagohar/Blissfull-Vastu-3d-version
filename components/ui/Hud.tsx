'use client';
/* Chapter rail (desktop) + sound toggle. Plays a soft chime on chapter change when sound is on. */
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { world } from '@/lib/world';
import { soundOn, soundOff, chime } from '@/lib/sound';

const CHAPTERS = [
  { id: 'top', label: 'Opening' }, { id: 'philosophy', label: 'The idea' }, { id: 'vastu', label: 'Vastu' }, { id: 'numerology', label: 'Numerology' },
  { id: 'navagraha', label: 'Navagraha' }, { id: 'light', label: 'Light' }, { id: 'studio', label: 'Consultations' }, { id: 'contact', label: 'Contact' }
];
const NOTES = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];

export default function Hud() {
  const fill = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    let last = -1;
    const tick = () => {
      const ch = Math.min(7, Math.floor(world.t + 1e-4));
      if (ch !== last) { if (last >= 0) chime(NOTES[ch]); last = ch; setActive(ch); }
      if (fill.current) fill.current.style.transform = `scaleY(${Math.min(1, world.t / 7)})`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const toggle = () => { if (sound) { soundOff(); setSound(false); } else { soundOn(); setSound(true); } };

  return (
    <>
      <nav className="hud-rail" aria-label="Chapters">
        <div className="hud-track" aria-hidden="true"><div ref={fill} className="hud-fill" /></div>
        {CHAPTERS.map((c, i) => (
          <a key={c.id} href={`#${c.id}`} className={`hud-tick ${i === active ? 'on' : ''}`} aria-current={i === active ? 'step' : undefined}>
            <span>{c.label}</span>
          </a>
        ))}
      </nav>
      <button className="hud-sound" aria-pressed={sound} onClick={toggle}>
        <span className="hud-bars" aria-hidden="true"><i /><i /><i /></span>
        {sound ? 'Sound on' : 'Sound off'}
      </button>
    </>
  );
}