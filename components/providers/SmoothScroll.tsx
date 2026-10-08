'use client';
import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { world, detectEnv } from '@/lib/world';
import { measure, update } from '@/lib/story';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    detectEnv();
    let lenis: Lenis | null = null;
    const raf = (t: number) => lenis?.raf(t * 1000);
    if (!world.reduced) {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }
    const onScroll = () => update(window.scrollY);
    const onRefresh = () => { measure(); onScroll(); };
    const onMove = (e: PointerEvent) => { world.pointer.x = (e.clientX / window.innerWidth) * 2 - 1; world.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1; };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      const id = a?.getAttribute('href');
      if (!a || !id || id.length < 2) return;
      const el = document.querySelector<HTMLElement>(id);
      if (!el) return;
      e.preventDefault();
      const dist = Math.abs(el.getBoundingClientRect().top);
      if (lenis) lenis.scrollTo(el, { duration: Math.min(3.2, 1.2 + dist / 6000), easing: (x: number) => 1 - Math.pow(1 - x, 4) });
      else el.scrollIntoView();
      history.replaceState(null, '', id);
    };
    ScrollTrigger.addEventListener('refresh', onRefresh);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('click', onClick);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      ScrollTrigger.removeEventListener('refresh', onRefresh);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      lenis?.destroy();
    };
  }, []);
  return <>{children}</>;
}
