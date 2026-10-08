/* Number mapping follows common Indian numerology (CONFIRM WITH Anshikaa). */
export type Graha = { id: string; en: string; sk: string; n: number; ring: number; size: number; kind: 'star' | 'planet' | 'node'; tex?: string; atmos?: string };
export const GRAHAS: Graha[] = [
  { id: 'surya', en: 'Sun', sk: 'Surya', n: 1, ring: 4, size: 0.34, kind: 'star', tex: 'sun' },
  { id: 'chandra', en: 'Moon', sk: 'Chandra', n: 2, ring: 1, size: 0.14, kind: 'planet', tex: 'moon' },
  { id: 'guru', en: 'Jupiter', sk: 'Guru', n: 3, ring: 6, size: 0.3, kind: 'planet', tex: 'jupiter' },
  { id: 'rahu', en: 'Rahu', sk: 'Rahu', n: 4, ring: 8, size: 0.16, kind: 'node' },
  { id: 'budha', en: 'Mercury', sk: 'Budha', n: 5, ring: 2, size: 0.1, kind: 'planet', tex: 'mercury' },
  { id: 'shukra', en: 'Venus', sk: 'Shukra', n: 6, ring: 3, size: 0.15, kind: 'planet', tex: 'venus', atmos: '#F2DFAE' },
  { id: 'ketu', en: 'Ketu', sk: 'Ketu', n: 7, ring: 8, size: 0.12, kind: 'node' },
  { id: 'shani', en: 'Saturn', sk: 'Shani', n: 8, ring: 7, size: 0.26, kind: 'planet', tex: 'saturn' },
  { id: 'mangal', en: 'Mars', sk: 'Mangal', n: 9, ring: 5, size: 0.13, kind: 'planet', tex: 'mars', atmos: '#E08A62' }
];
export const RING_R = (ring: number) => 1.0 + ring * 0.55;
export const grahaOfNumber = (n: number) => GRAHAS.find((g) => g.n === n) ?? GRAHAS[0];
