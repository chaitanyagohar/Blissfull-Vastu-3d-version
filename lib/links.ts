import { site } from '@/data/site';

const digits = (s: string) => s.replace(/[^\d]/g, '');
export function whatsappHref(msg = `Hello ${site.firstName}, I would like to book a consultation.`) {
  return site.contact.whatsapp ? `https://wa.me/${digits(site.contact.whatsapp)}?text=${encodeURIComponent(msg)}` : null;
}
export function bookHref() {
  return site.contact.bookingUrl || whatsappHref() || (site.contact.email ? `mailto:${site.contact.email}?subject=${encodeURIComponent(`Consultation request · ${site.brand}`)}` : '/contact');
}
export const extProps = (h: string) => (/^https?:/.test(h) ? { target: '_blank', rel: 'noopener noreferrer' } : {});