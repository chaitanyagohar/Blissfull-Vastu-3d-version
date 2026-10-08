import Link from 'next/link';
import type { ReactNode } from 'react';
import { site } from '@/data/site';
import { bookHref, extProps } from '@/lib/links';
import Mark from '@/components/brand/Mark';
import Footer from '@/components/sections/Footer';

export default function PageShell({ crumb, children }: { crumb: string; children: ReactNode }) {
  const book = bookHref();
  return (
    <div className="pg">
      <header className="pg-nav">
        <Link href="/" className="nav-mark"><Mark className="nav-logo" /><span>{site.brand}</span></Link>
        <nav aria-label="Main" className="pg-links"><Link href="/vastu-consultation">Vastu</Link><Link href="/numerology-consultation">Numerology</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></nav>
        <a className="btn btn-solid pg-cta" href={book} {...extProps(book)}>Book a consultation</a>
      </header>
      <nav className="pg-crumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li aria-current="page">{crumb}</li></ol></nav>
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}