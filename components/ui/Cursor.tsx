'use client';
/* Cursor: small dot + soft trailing ring. Grows over interactive elements, tightens on press,
   switches to light tones over dark sections, hides over text fields. Desktop (fine pointer) only. */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import s from './Cursor.module.css';

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = dot.current, r = ring.current;
    if (!d || !r) return;
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const html = document.documentElement;
    const style = document.createElement('style');
    style.textContent = 'html.has-cursor, html.has-cursor * { cursor: none !important; } html.has-cursor input, html.has-cursor textarea, html.has-cursor select { cursor: text !important; }';
    document.head.appendChild(style);
    html.classList.add('has-cursor');

    const dx = gsap.quickTo(d, 'x', { duration: 0.08, ease: 'power3' }), dy = gsap.quickTo(d, 'y', { duration: 0.08, ease: 'power3' });
    const rx = gsap.quickTo(r, 'x', { duration: 0.45, ease: 'power3' }), ry = gsap.quickTo(r, 'y', { duration: 0.45, ease: 'power3' });
    let shown = false;

    const move = (e: PointerEvent) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      if (!shown) { shown = true; d.classList.add(s.on); r.classList.add(s.on); }
      const t = e.target as HTMLElement;
      const text = !!t.closest('input, textarea, select');
      const hot = !text && !!t.closest('a, button, [data-hot], label, summary');
      const dark = !!t.closest('[data-theme="dark"]') || !!t.closest('footer');
      r.classList.toggle(s.hot, hot); d.classList.toggle(s.hot, hot);
      r.classList.toggle(s.dark, dark); d.classList.toggle(s.dark, dark);
      r.classList.toggle(s.text, text); d.classList.toggle(s.text, text);
    };
    const down = () => r.classList.add(s.press);
    const up = () => r.classList.remove(s.press);
    const leave = () => { shown = false; d.classList.remove(s.on); r.classList.remove(s.on); };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.removeEventListener('pointerleave', leave);
      html.classList.remove('has-cursor');
      style.remove();
    };
  }, []);

  return (
    <>
      <div ref={ring} className={s.ring} aria-hidden="true"><i /></div>
      <div ref={dot} className={s.dot} aria-hidden="true"><i /></div>
    </>
  );
}