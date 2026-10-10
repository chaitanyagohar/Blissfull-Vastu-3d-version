import type { Metadata } from 'next';
import SmoothScroll from '@/components/providers/SmoothScroll';
import WorldLoader from '@/components/three/WorldLoader';
import Loader from '@/components/three/Loader';
import Nav from '@/components/ui/Nav';
import Hud from '@/components/ui/Hud';
import Cursor from '@/components/ui/Cursor';
import JsonLd from '@/components/seo/JsonLd';
import Hero from '@/components/sections/Hero';
import Philosophy from '@/components/sections/Philosophy';
import Vastu from '@/components/sections/Vastu';
import Numerology from '@/components/sections/Numerology';
import NavagrahaSection from '@/components/sections/Navagraha';
import Light from '@/components/sections/Light';
import Services from '@/components/sections/Services';
import About from '@/components/sections/About';
import Approach from '@/components/sections/Approach';
import Testimonials from '@/components/sections/Testimonials';
import Final from '@/components/sections/Final';
import Footer from '@/components/sections/Footer';
import { pageMeta } from '@/lib/seo';
import Iris from '@/components/three/Iris';

export const metadata: Metadata = pageMeta({ path: '/' });

export default function Home() {
  return (
    <SmoothScroll>
      <JsonLd path="/" />
      <Loader />
      <WorldLoader />
      <Iris />
      <Nav />
      <Hud />
      <Cursor />
      <main id="main">
        <Hero />
        <Philosophy />
        <Vastu />
        <Numerology />
        <NavagrahaSection />
        <Light />
        <div id="studio" data-chapter="6" className="studio">
          <Services />
          <About />
          <Approach />
          <Testimonials />
        </div>
        <Final />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
