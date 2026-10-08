'use client';
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useScrub } from '@/lib/useScrub';
import { world } from '@/lib/world';
import { LOSHU, LINES, readDate } from '@/lib/numerology';
import { grahaOfNumber } from '@/data/navagraha';

type Result = NonNullable<ReturnType<typeof readDate>>;

export default function Numerology() {
  const ref = useRef<HTMLElement>(null);
  const [cur, setCur] = useState(1);
  const [line, setLine] = useState(-1);
  const [dob, setDob] = useState('');
  const [res, setRes] = useState<Result | null>(null);
  const [err, setErr] = useState('');
  const manual = useRef(false);
  useScrub(ref, (tl) => {
    tl.fromTo('.copy', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.1 }, 0.04).fromTo('.giant', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.06).to(['.copy', '.giant'], { opacity: 0, duration: 0.08 }, 0.92);
  });
  useEffect(() => {
    let lastN = -1, lastL = -2;
    const tick = () => {
      const l = Math.min(1, Math.max(0, world.t - 3));
      const n = Math.max(1, Math.min(9, Math.floor((l / 0.7) * 9) + 1));
      const ln = !world.dob && l > 0.74 && l < 0.98 ? Math.min(7, Math.floor(((l - 0.74) / 0.24) * 8)) : -1;
      if (!manual.current && !world.dob && n !== lastN) { lastN = n; world.hoverNumber = n; setCur(n); }
      if (ln !== lastL) { lastL = ln; world.sumRow = ln; setLine(ln); }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
  const pick = (n: number | null) => { manual.current = n !== null; if (n !== null) { world.hoverNumber = n; setCur(n); } };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const r = readDate(dob);
    if (!r) { setErr('Please enter a valid date of birth.'); return; }
    setErr(''); setRes(r); world.dob = r; world.hoverNumber = r.root; setCur(r.root);
  };
  const clear = () => { setRes(null); setDob(''); world.dob = null; manual.current = false; };
  const sum = line >= 0 ? LINES[line].map((i) => LOSHU[i]) : null;
  const missing = res ? [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !res.counts[n]) : [];
  const rootG = res ? grahaOfNumber(res.root) : null, destG = res ? grahaOfNumber(res.destiny) : null;
  return (
    <section ref={ref} id="numerology" data-chapter="3" className="chapter" style={{ '--h': '360vh' } as CSSProperties} aria-labelledby="num-title">
      <div className="stage">
        <div className="giant" aria-hidden="true">{cur}</div>
        <div className="copy split-copy">
          <p className="label">02 · Numerology</p>
          <h2 id="num-title" className="display h2">Nine numbers. <em>One rhythm.</em></h2>
          <p className="lede">Numerology works with the numbers in your date of birth and your name. Arranged in the Lo Shu square, every row, column and diagonal adds up to fifteen.</p>
          <div className="nums" role="group" aria-label="Numbers one to nine" onMouseLeave={() => pick(null)}>
            {Array.from({ length: 9 }, (_, k) => k + 1).map((n) => (
              <button key={n} className={`n ${cur === n ? 'on' : ''} ${res && !res.counts[n] ? 'absent' : ''}`} onMouseEnter={() => pick(n)} onFocus={() => pick(n)} onClick={() => pick(n)} aria-pressed={cur === n}>{n}</button>
            ))}
          </div>
          {!res ? (
            <form className="dob" onSubmit={submit} noValidate>
              <label htmlFor="dob" className="label">Your date of birth</label>
              <div className="dob-row">
                <input id="dob" type="date" value={dob} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDob(e.target.value)} autoComplete="bday" />
                <button type="submit" className="link-btn">Build my grid →</button>
              </div>
              <p className="dob-note">{err || 'Calculated on this device. Nothing is sent or stored.'}</p>
              <p className={`sum ${sum ? 'show' : ''}`} aria-live="polite">{sum ? <>{sum.join(' + ')} = <em>15</em></> : '\u00a0'}</p>
            </form>
          ) : (
            <div className="dob-result" aria-live="polite">
              <p><span className="label">Root number</span><strong className="display">{res.root}</strong> traditionally {rootG!.en} ({rootG!.sk})</p>
              <p><span className="label">Destiny number</span><strong className="display">{res.destiny}</strong> traditionally {destG!.en} ({destG!.sk})</p>
              <p className="dob-note">{missing.length ? <>Not in your grid: {missing.join(', ')}.</> : 'All nine numbers appear in your grid.'} What this means for you is what a consultation is for.</p>
              <div className="dob-actions"><a href="#contact" className="link-btn">Book a consultation →</a><button className="link-btn quiet" onClick={clear}>Clear</button></div>
            </div>
          )}
          <p className="label note"><Link href="/numerology-consultation">About numerology consultations →</Link></p>
        </div>
      </div>
    </section>
  );
}
