import { portrait, type Media } from './media';

export type Testimonial = { quote: string; name: string; context?: string };
export type Step = { title: string; text: string };
export type Service = { id: 'vastu' | 'numerology' | 'astrology'; index: string; title: string; text: string; path: string; image: string; draft: boolean };
export type Social = { label: string; handle: string; url: string | null };

export const site = {
  brand: 'Blissfull Vastu',
  name: 'Anshikaaa Purii',
  firstName: 'Anshikaaa',
  disciplines: ['Vastu', 'Numerology'],
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com', // e.g. https://www.blissfullvastu.com
  stage: 'proposal' as 'proposal' | 'live',
  demo: true,
  astrology: false,
  description: 'Blissfull Vastu: Vastu and numerology consultations with Anshikaaa Purii, online and in person across Delhi NCR, in Hindi and English.',
  languages: ['Hindi', 'English'],
  areaServed: ['Delhi', 'Gurugram', 'Noida', 'Ghaziabad', 'Faridabad'],
  modes: ['Online consultations', 'In-person consultations', 'Site visits across Delhi NCR'],
  contact: {
    whatsapp: null as string | null, // DEMO
    phone: '+91 00000 00000' as string | null, // DEMO
    email: 'hello@example.com' as string | null, // DEMO
    city: 'New Delhi' as string | null,
    bookingUrl: null as string | null
  },
  address: { street: null as string | null, locality: 'South Delhi', city: 'New Delhi', region: 'Delhi', postalCode: null as string | null, country: 'IN', verified: false }, // DEMO
  social: [
    { label: 'Instagram', handle: '@blissfullvastu', url: null }, // DEMO
    { label: 'Facebook', handle: 'Blissfull Vastu', url: null }, // DEMO
    { label: 'YouTube', handle: 'Blissfull Vastu', url: null } // DEMO
  ] as Social[],
  photo: portrait as Media | null,
  bio: [
    'Anshikaaa Purii works with two traditional systems: Vastu, which reads the space you live and work in, and numerology, which reads the numbers in your name and date of birth.',
    'Consultations are in Hindi or English, online or in person, with site visits across Delhi NCR.'
  ] as string[] | null,
  approach: [ // DEMO
    { title: 'Share', text: 'Your floor plan, or your name and date of birth, depending on the consultation.' },
    { title: 'Consult', text: 'A conversation, online or in person, in Hindi or English.' },
    { title: 'Guidance', text: 'Clear, practical guidance based on traditional principles.' }
  ] as Step[] | null,
  testimonials: [] as Testimonial[]
};

const ALL: Service[] = [
  { id: 'vastu', index: '01', title: 'Vastu consultation', path: '/vastu-consultation', image: 'interior', draft: true,
    text: 'Your home or workplace read as a plan: its directions, its zones and its centre, with guidance based on traditional Vastu principles. Online, in person, or as a site visit across Delhi NCR.' },
  { id: 'numerology', index: '02', title: 'Numerology consultation', path: '/numerology-consultation', image: 'numbers', draft: true,
    text: 'The numbers in your date of birth and your name, read together, and what they suggest for the decisions in front of you. In Hindi or English, online or in person.' },
  { id: 'astrology', index: '03', title: 'Astrology consultation', path: '/astrology-consultation', image: 'interior', draft: true, text: '' }
];
export const services = ALL.filter((s) => s.id !== 'astrology' || site.astrology);