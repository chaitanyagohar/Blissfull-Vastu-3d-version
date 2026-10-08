import { site } from '@/data/site';

export default function Testimonials() {
  if (!site.testimonials.length) return null;
  return (
    <section id="voices" className="block" aria-labelledby="voices-title">
      <div className="block-head"><h2 className="label" id="voices-title">In their words</h2></div>
      <div className="quotes">
        {site.testimonials.map((q) => (
          <figure key={q.name + q.quote.slice(0, 12)} className="quote"><blockquote className="display">“{q.quote}”</blockquote><figcaption className="label">{q.name}{q.context ? ` · ${q.context}` : ''}</figcaption></figure>
        ))}
      </div>
    </section>
  );
}
