import { site } from '@/data/site';

export default function Approach() {
  if (!site.approach) return null;
  return (
    <section id="approach" className="block" aria-labelledby="approach-title">
      <div className="block-head"><p className="label">Approach</p><h2 id="approach-title" className="display h2">How it <em>works.</em></h2></div>
      <ol className="steps">
        {site.approach.map((s, i) => (
          <li key={s.title} className="step"><span className="step-n display" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><h3 className="display">{s.title}</h3><p>{s.text}</p></li>
        ))}
      </ol>
    </section>
  );
}
