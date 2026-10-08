'use client';
import Link from 'next/link';
import { services } from '@/data/site';
import { world } from '@/lib/world';
import { bookHref, whatsappHref } from '@/lib/links';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import Img from '@/components/media/Img';
import { DEV } from '@/components/ui/Placeholder';

export default function Services() {
  return (
    <section id="services" className="block" aria-labelledby="services-title">
      <div className="block-head"><p className="label">Consultations</p><Reveal as="h2" className="display h2" id="services-title">Two ways to <em>begin.</em></Reveal></div>
      <div className="tiles">
        {services.map((s) => (
          <article key={s.id} className="tile-card tick" data-hot onMouseEnter={() => { world.hoverService = s.id; }} onMouseLeave={() => { world.hoverService = ''; }}>
            <Img id={s.image} className="tile-img" sizes="(max-width: 820px) 92vw, 40vw" />
            <div className="tile-body">
              <div className="tile-top"><span className="label">{s.index}</span>{DEV && s.draft && <span className="draft">Draft copy · confirm with client</span>}</div>
              <h3 className="display">{s.title}</h3>
              <p>{s.text}</p>
              <div className="tile-actions">
                <Button href={whatsappHref(`Hello Anshikaa, I would like to book a ${s.title.toLowerCase()}.`) || bookHref()} variant="solid">Book this</Button>
                <Link className="link-btn" href={s.path}>Learn more</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
