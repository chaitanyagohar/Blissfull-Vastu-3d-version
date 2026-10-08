export const STARS: Record<string, [number, number, number]> = {
  dubhe: [11.062, 61.75, 1.2], merak: [11.031, 56.38, 1], phecda: [11.897, 53.69, 1], megrez: [12.257, 57.03, 0.8], alioth: [12.9, 55.96, 1.2], mizar: [13.399, 54.93, 1.1], alkaid: [13.792, 49.31, 1.1],
  betelgeuse: [5.919, 7.41, 1.4], bellatrix: [5.419, 6.35, 1.1], mintaka: [5.533, -0.3, 1], alnilam: [5.604, -1.2, 1.1], alnitak: [5.679, -1.94, 1.1], saiph: [5.796, -9.67, 1], rigel: [5.242, -8.2, 1.4],
  alcyone: [3.791, 24.11, 0.9], atlas: [3.819, 24.05, 0.7], electra: [3.748, 24.11, 0.7], maia: [3.763, 24.37, 0.7], merope: [3.772, 23.95, 0.6], taygeta: [3.754, 24.47, 0.6],
  sirius: [6.752, -16.72, 1.8], canopus: [6.399, -52.7, 1.6], arcturus: [14.261, 19.18, 1.5], vega: [18.616, 38.78, 1.5], capella: [5.278, 46.0, 1.4], procyon: [7.655, 5.22, 1.3],
  achernar: [1.629, -57.24, 1.2], altair: [19.846, 8.87, 1.2], aldebaran: [4.599, 16.51, 1.3], antares: [16.49, -26.43, 1.3], spica: [13.42, -11.16, 1.2], pollux: [7.755, 28.03, 1.2],
  fomalhaut: [22.961, -29.62, 1.1], deneb: [20.69, 45.28, 1.2], regulus: [10.14, 11.97, 1.1], castor: [7.577, 31.89, 1], polaris: [2.53, 89.26, 1.1]
};
export const FIGURES: [string, string][] = [
  ['dubhe', 'merak'], ['merak', 'phecda'], ['phecda', 'megrez'], ['megrez', 'dubhe'], ['megrez', 'alioth'], ['alioth', 'mizar'], ['mizar', 'alkaid'],
  ['betelgeuse', 'bellatrix'], ['bellatrix', 'mintaka'], ['betelgeuse', 'alnitak'], ['mintaka', 'alnilam'], ['alnilam', 'alnitak'], ['mintaka', 'rigel'], ['alnitak', 'saiph'],
  ['alcyone', 'atlas'], ['alcyone', 'electra'], ['alcyone', 'maia'], ['alcyone', 'merope'], ['maia', 'taygeta']
];
export function starXYZ(raH: number, decD: number, r: number): [number, number, number] {
  const ra = (raH * 15 * Math.PI) / 180, dec = (decD * Math.PI) / 180;
  return [Math.cos(dec) * Math.cos(ra) * r, Math.sin(dec) * r, Math.cos(dec) * Math.sin(ra) * r];
}
