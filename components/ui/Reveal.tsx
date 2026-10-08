'use client';
import { createElement, useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Reveal({ as = 'div', className = '', children, delay = 0, id }: { as?: string; className?: string; children: ReactNode; delay?: number; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let split: SplitText | null = null, alive = true;
    document.fonts.ready.then(() => {
      if (!alive) return;
      split = SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true, onSplit: (self) => gsap.from(self.lines, { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay, scrollTrigger: { trigger: el, start: 'top 88%', once: true } }) });
    });
    return () => { alive = false; split?.revert(); };
  }, [delay]);
  return createElement(as, { ref, className, id }, children);
}
