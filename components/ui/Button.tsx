import Magnetic from './Magnetic';
import { extProps } from '@/lib/links';

export default function Button({ href, children, variant = 'line', className = '' }: { href: string; children: React.ReactNode; variant?: 'solid' | 'line'; className?: string }) {
  return (
    <Magnetic>
      <a href={href} className={`btn btn-${variant} ${className}`} {...extProps(href)}>
        <span>{children}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 13 13 1M5 1h8v8" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
      </a>
    </Magnetic>
  );
}
