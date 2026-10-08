'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { useScrub } from '@/lib/useScrub';
import { world } from '@/lib/world';

const ZONES = ['NW', 'N', 'NE', 'W', 'Centre', 'E', 'SW', 'S', 'SE'];
const DIRS = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'];
type Orientation = DeviceOrientationEvent & { webkitCompassHeading?: number };

export default function Vastu() {
  const ref = useRef<HTMLElement>(null);
  const [zone, setZone] = useState(-1);
  const [canCompass, setCanCompass] = useState(false);
  const [compass, setCompass] = useState<'off' | 'on' | 'denied'>('off');
  const [heading, setHeading] = useState<number | null>(null);
  const handler = useRef<((e: Event) => void) | null>(null);

  useScrub(ref, (tl) => {
    tl.fromTo('.copy', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.1 }, 0.04).fromTo('.zones', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.3).to('.copy', { opacity: 0, y: -30, duration: 0.08 }, 0.9);
  });
  const stop = () => {
    if (handler.current) { window.removeEventListener('deviceorientationabsolute', handler.current); window.removeEventListener('deviceorientation', handler.current); handler.current = null; }
    world.heading = null; setHeading(null); setCompass('off');
  };
  useEffect(() => {
    setCanCompass('DeviceOrientationEvent' in window && window.matchMedia('(pointer: coarse)').matches);
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const start = async () => {
    const D = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    try { if (typeof D.requestPermission === 'function' && (await D.requestPermission()) !== 'granted') { setCompass('denied'); return; } } catch { setCompass('denied'); return; }
    const h = (e: Event) => {
      const o = e as Orientation;
      const v = typeof o.webkitCompassHeading === 'number' ? o.webkitCompassHeading : o.absolute && o.alpha != null ? 360 - o.alpha : null;
      if (v == null) return;
      world.heading = v; setHeading(Math.round(v));
    };
    handler.current = h;
    window.addEventListener('deviceorientationabsolute', h); window.addEventListener('deviceorientation', h);
    setCompass('on');
  };
  const set = (i: number) => { world.hoverZone = i; setZone(i); };
  return (
    <section ref={ref} id="vastu" data-chapter="2" className="chapter" style={{ '--h': '320vh' } as CSSProperties} aria-labelledby="vastu-title">
      <div className="stage">
        <div className="copy split-copy">
          <p className="label">01 · Vastu</p>
          <h2 id="vastu-title" className="display h2">Every room <em>faces</em> somewhere.</h2>
          <p className="lede">Traditional Vastu practice reads a space through its directions, its nine zones and its centre. As you scroll, the sun rises in the east and crosses the plan.</p>
          <div className="zones" role="group" aria-label="The nine zones of a Vastu plan" onMouseLeave={() => set(-1)}>
            {ZONES.map((z, i) => (
              <button key={z} className={`zone ${zone === i ? 'on' : ''} ${i === 4 ? 'centre' : ''}`} aria-pressed={zone === i} onMouseEnter={() => set(i)} onFocus={() => set(i)} onBlur={() => set(-1)} onClick={() => set(zone === i ? -1 : i)}>
                {i === 4 ? 'Brahmasthan' : z}
              </button>
            ))}
          </div>
          {canCompass && (
            <div className="compass" aria-live="polite">
              {compass === 'on' ? (
                <><p className="compass-read">{heading == null ? 'Finding north…' : <>You’re facing <em>{DIRS[Math.round(heading / 45) % 8]}</em> · {heading}°</>}</p><button className="link-btn" onClick={stop}>Stop</button></>
              ) : <button className="link-btn" onClick={start}>{compass === 'denied' ? 'Compass permission was declined' : 'Align the plan with your room →'}</button>}
            </div>
          )}
          <p className="label note"><Link href="/vastu-consultation">About Vastu consultations →</Link></p>
        </div>
      </div>
    </section>
  );
}
