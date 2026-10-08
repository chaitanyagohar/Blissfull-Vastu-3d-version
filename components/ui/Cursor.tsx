'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;
    el.style.display = 'block';
    const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' }), y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });
    const move = (e: PointerEvent) => { x(e.clientX); y(e.clientY); el.classList.toggle('hot', !!(e.target as HTMLElement).closest('a, button, input, [data-hot]')); };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);
  return <div ref={ref} className="cursor" aria-hidden="true" />;
}
