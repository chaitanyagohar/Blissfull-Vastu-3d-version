import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { site } from '@/data/site';
import { SEO_TITLE } from '@/lib/seo';
import './globals.css';
import './type.css';

const serif = localFont({
  src: [{ path: './fonts/marcellus-400.woff2', weight: '400', style: 'normal' }],
  variable: '--font-serif', display: 'swap'
});
const sans = localFont({
  src: [
    { path: './fonts/manrope-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/manrope-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/manrope-600.woff2', weight: '600', style: 'normal' }
  ],
  variable: '--font-sans', display: 'swap'
});
const mono = localFont({
  src: [
    { path: './fonts/ibm-plex-mono-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/ibm-plex-mono-500.woff2', weight: '500', style: 'normal' }
  ],
  variable: '--font-mono', display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: SEO_TITLE, template: `%s · ${site.brand}` },
  description: site.description,
  applicationName: site.brand,
  authors: [{ name: site.name }],
  robots: site.stage === 'live' ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { siteName: site.brand, locale: 'en_IN', type: 'website' },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false }
};
export const viewport: Viewport = { themeColor: '#FFF6EC', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}