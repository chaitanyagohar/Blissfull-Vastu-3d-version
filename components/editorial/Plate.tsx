export default function Plate({ className = '' }: { className?: string }) {
  const C = 300, R = 262;
  const fine = Array.from({ length: 10 }, (_, k) => 120 + k * 40);
  const ticks = Array.from({ length: 72 }, (_, k) => { const a = (k / 72) * Math.PI * 2, l = k % 9 === 0 ? 16 : 7; return [C + Math.sin(a) * R, C - Math.cos(a) * R, C + Math.sin(a) * (R + l), C - Math.cos(a) * (R + l)]; });
  const dirs: [string, number][] = [['N', 0], ['NE', 45], ['E', 90], ['SE', 135], ['S', 180], ['SW', 225], ['W', 270], ['NW', 315]];
  return (
    <svg className={`plate ${className}`} viewBox="0 0 600 600" role="img" aria-label="A Vastu plan: nine zones inside a compass ring, north at the top">
      <rect className="plate-centre" x={248} y={248} width={104} height={104} />
      <g fill="none" stroke="currentColor">
        <circle cx={C} cy={C} r={R} strokeWidth={0.8} /><circle cx={C} cy={C} r={R - 14} strokeWidth={0.4} opacity={0.5} />
        {fine.map((v) => <g key={v} opacity={0.3}><line x1={120} y1={v} x2={480} y2={v} strokeWidth={0.5} /><line x1={v} y1={120} x2={v} y2={480} strokeWidth={0.5} /></g>)}
        <rect x={120} y={120} width={360} height={360} strokeWidth={1.2} /><rect x={104} y={104} width={392} height={392} strokeWidth={0.5} />
        {[240, 360].map((v) => <g key={v}><line x1={120} y1={v} x2={480} y2={v} strokeWidth={1.2} /><line x1={v} y1={120} x2={v} y2={480} strokeWidth={1.2} /></g>)}
        <line x1={C} y1={38} x2={C} y2={562} strokeWidth={0.4} opacity={0.5} /><line x1={38} y1={C} x2={562} y2={C} strokeWidth={0.4} opacity={0.5} />
      </g>
      <g stroke="currentColor" strokeWidth={0.7} opacity={0.6}>{ticks.map(([a, b, c, d], k) => <line key={k} x1={a} y1={b} x2={c} y2={d} />)}</g>
      <g className="plate-dirs">{dirs.map(([l, deg]) => { const a = (deg * Math.PI) / 180, r = R + 36; return <text key={l} x={C + Math.sin(a) * r} y={C - Math.cos(a) * r + 4} textAnchor="middle">{l}</text>; })}</g>
    </svg>
  );
}
