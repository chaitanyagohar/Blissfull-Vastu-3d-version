/* Drawn Vastu compass: 5° ticks + degrees, 16 zones, 8 Sanskrit directions, 3×3 grid, Brahmasthan, needle. */
import s from './VastuCompass.module.css';

const C = 200;
const pt = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return [C + Math.sin(a) * r, C - Math.cos(a) * r] as const;
};
const ZONES = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
const SANSKRIT = ['Uttara', 'Ishanya', 'Purva', 'Agneya', 'Dakshina', 'Nairutya', 'Paschima', 'Vayavya'];

export default function VastuCompass({ className = '' }: { className?: string }) {
  const ticks = Array.from({ length: 72 }, (_, k) => {
    const deg = k * 5, long = deg % 30 === 0;
    const [x1, y1] = pt(deg, 190), [x2, y2] = pt(deg, long ? 174 : 182);
    return `M${x1} ${y1}L${x2} ${y2}`;
  }).join('');
  const sectors = Array.from({ length: 16 }, (_, k) => {
    const deg = k * 22.5 + 11.25;
    const [x1, y1] = pt(deg, 140), [x2, y2] = pt(deg, 168);
    return `M${x1} ${y1}L${x2} ${y2}`;
  }).join('');

  return (
    <svg className={`${s.svg} ${className}`} viewBox="0 0 400 400" role="img" aria-label="Vastu compass: sixteen zones around a nine-square plan, north at the top">
      {/* rings */}
      <g fill="none" stroke="currentColor">
        <circle cx={C} cy={C} r="190" strokeWidth="1" />
        <circle cx={C} cy={C} r="168" strokeWidth="0.6" opacity="0.6" />
        <circle cx={C} cy={C} r="140" strokeWidth="0.8" />
        <circle cx={C} cy={C} r="116" strokeWidth="0.5" opacity="0.5" />
      </g>
      <path d={ticks} stroke="currentColor" strokeWidth="0.7" opacity="0.75" />
      <path d={sectors} stroke="currentColor" strokeWidth="0.5" opacity="0.5" />

      {/* degrees every 30° */}
      <g className={s.deg}>
        {Array.from({ length: 12 }, (_, k) => {
          const deg = k * 30, [x, y] = pt(deg, 202);
          return <text key={deg} x={x} y={y + 3} textAnchor="middle">{deg}</text>;
        })}
      </g>

      {/* 16 zones */}
      <g className={s.zone}>
        {ZONES.map((z, k) => {
          const [x, y] = pt(k * 22.5, 154);
          return <text key={z} x={x} y={y + 3.5} textAnchor="middle" className={z === 'N' ? s.north : k % 2 ? s.minor : ''}>{z}</text>;
        })}
      </g>

      {/* 8 Sanskrit directions */}
      <g className={s.sk}>
        {SANSKRIT.map((n, k) => {
          const [x, y] = pt(k * 45, 128);
          return <text key={n} x={x} y={y + 3} textAnchor="middle">{n}</text>;
        })}
      </g>

      {/* 3×3 grid + Brahmasthan */}
      <g fill="none" stroke="currentColor" strokeWidth="0.9">
        <rect x="134" y="134" width="132" height="132" />
        <path d="M178 134V266M222 134V266M134 178H266M134 222H266" opacity="0.7" />
      </g>
      <rect x="183" y="183" width="34" height="34" className={s.centre} />

      {/* needle */}
      <g className={s.needle}>
        <path d="M200 74 L209 200 L200 200 Z" className={s.nDark} />
        <path d="M200 74 L191 200 L200 200 Z" className={s.nLight} />
        <path d="M200 326 L209 200 L191 200 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx={C} cy={C} r="5" className={s.pin} />
      </g>
    </svg>
  );
}