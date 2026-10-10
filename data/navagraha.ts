/* Navagraha: number mapping + traditional associations.
   CONFIRM WITH ANSHIKAA — especially Rahu/Ketu days and elements, which vary between traditions. */
export type Graha = {
  id: string; en: string; sk: string; n: number; ring: number; size: number; kind: 'star' | 'planet' | 'node'; tex?: string; atmos?: string;
  colour: string; colourName: string; day: string; gem: string; element: string;
};

export const GRAHAS: Graha[] = [
  { id: 'surya', en: 'Sun', sk: 'Surya', n: 1, ring: 4, size: 0.34, kind: 'star', tex: 'sun', colour: '#E8742E', colourName: 'Copper red', day: 'Sunday · Ravivar', gem: 'Ruby · Manik', element: 'Fire · Agni' },
  { id: 'chandra', en: 'Moon', sk: 'Chandra', n: 2, ring: 1, size: 0.14, kind: 'planet', tex: 'moon', colour: '#EDE8DD', colourName: 'White', day: 'Monday · Somvar', gem: 'Pearl · Moti', element: 'Water · Jal' },
  { id: 'guru', en: 'Jupiter', sk: 'Guru', n: 3, ring: 6, size: 0.3, kind: 'planet', tex: 'jupiter', colour: '#E6B93A', colourName: 'Yellow', day: 'Thursday · Guruvar', gem: 'Yellow sapphire · Pukhraj', element: 'Space · Akash' },
  { id: 'rahu', en: 'Rahu', sk: 'Rahu', n: 4, ring: 8, size: 0.16, kind: 'node', colour: '#8A8290', colourName: 'Smoky grey', day: 'Saturday · Shanivar', gem: 'Hessonite · Gomed', element: 'Air · Vayu' },
  { id: 'budha', en: 'Mercury', sk: 'Budha', n: 5, ring: 2, size: 0.1, kind: 'planet', tex: 'mercury', colour: '#4FA067', colourName: 'Green', day: 'Wednesday · Budhvar', gem: 'Emerald · Panna', element: 'Earth · Prithvi' },
  { id: 'shukra', en: 'Venus', sk: 'Shukra', n: 6, ring: 3, size: 0.15, kind: 'planet', tex: 'venus', atmos: '#F2DFAE', colour: '#F4EEE2', colourName: 'Brilliant white', day: 'Friday · Shukravar', gem: 'Diamond · Heera', element: 'Water · Jal' },
  { id: 'ketu', en: 'Ketu', sk: 'Ketu', n: 7, ring: 8, size: 0.12, kind: 'node', colour: '#A8927C', colourName: 'Smoky multicolour', day: 'Tuesday · Mangalvar', gem: "Cat's eye · Lehsunia", element: 'Fire · Agni' },
  { id: 'shani', en: 'Saturn', sk: 'Shani', n: 8, ring: 7, size: 0.26, kind: 'planet', tex: 'saturn', colour: '#4A5C96', colourName: 'Black · dark blue', day: 'Saturday · Shanivar', gem: 'Blue sapphire · Neelam', element: 'Air · Vayu' },
  { id: 'mangal', en: 'Mars', sk: 'Mangal', n: 9, ring: 5, size: 0.13, kind: 'planet', tex: 'mars', atmos: '#E08A62', colour: '#D2452F', colourName: 'Red', day: 'Tuesday · Mangalvar', gem: 'Red coral · Moonga', element: 'Fire · Agni' }
];

export const RING_R = (ring: number) => 1.0 + ring * 0.55;
export const grahaOfNumber = (n: number) => GRAHAS.find((g) => g.n === n) ?? GRAHAS[0];