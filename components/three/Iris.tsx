'use client';
/* Iris transitions (driven by scroll):
   into space — a circle opens from the Sun through the peach screen, edged by a bronze ring;
   back to light — black opens from the jaali's light with a warm peach bloom. */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { world } from '@/lib/world';
import s from './Iris.module.css';

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const mask = (el: HTMLElement, css: string) => { el.style.maskImage = css; el.style.webkitMaskImage = css; };

export default function Iris() {
  const space = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const a = space.current!, o = ring.current!, b = light.current!;
    const tick = () => {
      const t = world.t, W = window.innerWidth, H = window.innerHeight;

      /* into space: 3.55 → 3.97 */
      const pa = (t - 3.55) / 0.42;
      if (pa >= 0 && pa < 1) {
        const x = world.sunScreen.x * W, y = world.sunScreen.y * H;
        const R = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 4;
        const r = ease(pa) * R;
        a.style.display = 'block';
        mask(a, `radial-gradient(circle at ${x}px ${y}px, transparent ${r}px, #000 ${r + 1}px)`);
        o.style.display = 'block';
        o.style.width = o.style.height = `${r * 2}px`;
        o.style.transform = `translate(${x - r}px, ${y - r}px)`;
        o.style.opacity = String(1 - pa * 0.7);
      } else { a.style.display = 'none'; o.style.display = 'none'; }

      /* back to light: 5.55 → 6.0 */
      const pb = (t - 5.55) / 0.45;
      if (pb >= 0 && pb < 1) {
        const x = 0.5 * W, y = 0.42 * H;
        const R = Math.hypot(W, H) * 0.8;
        const r = ease(pb) * R;
        b.style.display = 'block';
        b.style.background = `radial-gradient(circle at ${x}px ${y}px, #FFD4AE ${r * 0.5}px, #4A2E1A ${r * 0.78}px, #000 ${r}px)`;
        mask(b, `radial-gradient(circle at ${x}px ${y}px, transparent ${r * 0.55}px, #000 ${r}px)`);
      } else { b.style.display = 'none'; }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <>
      <div ref={space} className={s.space} aria-hidden="true" />
      <div ref={ring} className={s.ring} aria-hidden="true" />
      <div ref={light} className={s.light} aria-hidden="true" />
    </>
  );
}