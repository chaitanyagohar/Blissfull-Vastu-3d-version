import { ImageResponse } from 'next/og';
import { site } from '@/data/site';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${site.brand} · Vastu & Numerology by ${site.name} · Delhi NCR`;
export default function OG() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#FFF6EC', color: '#351C0C', padding: 72, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 640 }}>
          <div style={{ fontSize: 20, letterSpacing: 6, color: '#674C37' }}>VASTU · NUMEROLOGY · DELHI NCR</div>
          <div style={{ fontSize: 96, lineHeight: 1, letterSpacing: -2 }}>{site.brand}</div>
          <div style={{ fontSize: 34, color: '#674C37' }}>Space has a language. · {site.name}</div>
        </div>
        <svg width="360" height="360" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="29" fill="none" stroke="#351C0C" strokeWidth="0.6" />
          <rect x="14" y="14" width="36" height="36" fill="none" stroke="#351C0C" strokeWidth="0.6" />
          <path d="M26 14v36M38 14v36M14 26h36M14 38h36" stroke="#351C0C" strokeWidth="0.6" />
          <rect x="27.5" y="27.5" width="9" height="9" fill="#C29A6C" />
        </svg>
      </div>
    ),
    size
  );
}