/* Image slot: ready → next/image (AVIF/WebP, responsive, lazy); not yet supplied → soft drawn plate. */
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { slot } from '@/data/media';

export default function Img({ id, className = '', sizes, ratio = '3 / 2', fig }: { id: string; className?: string; sizes: string; ratio?: string; fig?: boolean }) {
  const s = slot(id);
  const style = { '--a': s.tone[0], '--b': s.tone[1], '--ar': ratio } as CSSProperties;
  return (
    <figure className={`img ${className}`} style={style}>
      <div className="img-frame">
        {s.ready ? (
          <Image src={s.file} alt={s.alt} fill sizes={sizes} style={{ objectFit: 'cover', objectPosition: s.focus || 'center' }} />
        ) : (
          <div className="img-fallback" aria-hidden="true">
            <svg viewBox="0 0 100 100"><g fill="none" stroke="currentColor" strokeWidth="0.3"><circle cx="50" cy="50" r="34" /><rect x="28" y="28" width="44" height="44" /><path d="M42.7 28v44M57.3 28v44M28 42.7h44M28 57.3h44" /></g><rect x="45.5" y="45.5" width="9" height="9" fill="currentColor" opacity="0.5" /></svg>
          </div>
        )}
      </div>
      {fig && <figcaption className="label img-cap">{s.caption}</figcaption>}
    </figure>
  );
}
