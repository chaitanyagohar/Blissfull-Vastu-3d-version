import SLOTS from './media.slots.json';
import { AVAILABLE, DIMS } from './media.available';

export type Media = { src: string; alt: string; width: number; height: number; focus?: string; source: string; license: string };
export type Slot = { id: string; kind: 'image' | 'video'; file: string; poster?: string; alt: string; w: number; h: number; focus?: string; tone: string[]; caption: string; source: string; license: string; client?: boolean; ready: boolean };

export const portrait: Media = {
  src: '/images/Anshikaa.jpeg',
  alt: 'Anshikaaa Purii of Blissfull Vastu in a red embroidered suit with gold jewellery, seated in a warmly lit room',
  width: 900, height: 833, focus: '52% 24%', source: 'Client', license: 'Client-owned'
};

export function slot(id: string): Slot {
  const s = (SLOTS as Omit<Slot, 'ready'>[]).find((x) => x.id === id);
  if (!s) throw new Error(`Unknown media slot "${id}"`);
  const d = DIMS[id];
  return { ...s, ...(d ? { w: d[0], h: d[1] } : {}), ready: AVAILABLE.includes(id) };
}

export const media = {
  portrait,
  planetTextures: false,
  planets: {
    sun: '/textures/planets/2k_sun.jpg', moon: '/textures/planets/2k_moon.jpg', mercury: '/textures/planets/2k_mercury.jpg',
    venus: '/textures/planets/2k_venus_atmosphere.jpg', mars: '/textures/planets/2k_mars.jpg', jupiter: '/textures/planets/2k_jupiter.jpg',
    saturn: '/textures/planets/2k_saturn.jpg', saturnRing: '/textures/planets/2k_saturn_ring_alpha.png'
  } as Record<string, string>
};