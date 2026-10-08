import { world } from './world';
export async function loadSky(date = new Date()) {
  if (world.sky) return world.sky;
  const A = await import('astronomy-engine');
  const lon = (b: Parameters<typeof A.GeoVector>[0]) => A.Ecliptic(A.GeoVector(b, date, true)).elon;
  const T = (date.getTime() / 86400000 + 2440587.5 - 2451545.0) / 36525;
  const rahu = (((125.04452 - 1934.136261 * T) % 360) + 360) % 360;
  world.sky = { surya: A.SunPosition(date).elon, chandra: lon(A.Body.Moon), budha: lon(A.Body.Mercury), shukra: lon(A.Body.Venus), mangal: lon(A.Body.Mars), guru: lon(A.Body.Jupiter), shani: lon(A.Body.Saturn), rahu, ketu: (rahu + 180) % 360 };
  return world.sky;
}
