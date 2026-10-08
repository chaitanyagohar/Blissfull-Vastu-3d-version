'use client';
/* Small looping video: plays only while visible, on desktop, without data-saver or reduced motion. Otherwise poster. */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { slot } from '@/data/media';

export default function Film({ id, className = '' }: { id: string; className?: string }) {
  const s = slot(id);
  const ref = useRef<HTMLVideoElement>(null);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (!s.ready) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setPlay(!window.matchMedia('(prefers-reduced-motion: reduce)').matches && !conn?.saveData && window.innerWidth > 820);
  }, [s.ready]);
  useEffect(() => {
    const v = ref.current;
    if (!v || !play) return;
    v.src = s.file;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { rootMargin: '200px' });
    io.observe(v);
    return () => io.disconnect();
  }, [play, s.file]);
  const style = { '--a': s.tone[0], '--b': s.tone[1] } as CSSProperties;
  if (!s.ready) return <div className={`film film-art ${className}`} style={style} aria-hidden="true" />;
  return (
    <div className={`film ${className}`} style={style}>
      {play
        ? <video ref={ref} muted playsInline loop preload="metadata" poster={s.poster} aria-hidden="true" />
        // eslint-disable-next-line @next/next/no-img-element
        : <img src={s.poster} alt="" aria-hidden="true" loading="lazy" decoding="async" />}
    </div>
  );
}
