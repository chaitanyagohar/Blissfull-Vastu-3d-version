'use client';
import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export function useScrub(ref: RefObject<HTMLElement>, build: (tl: gsap.core.Timeline) => void) {
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
      build(tl);
      tl.set({}, {}, 1);
    }, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
