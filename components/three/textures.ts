import * as THREE from 'three';

const cache = new Map<string, THREE.Texture>();
type RGB = [number, number, number];
function rng(seed: number) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function fbm(w: number, h: number, cells: number, oct: number, seed: number) {
  const out = new Float32Array(w * h);
  let amp = 1, tot = 0;
  for (let o = 0; o < oct; o++) {
    const c = cells * (1 << o), r = rng(seed + o * 101), stride = c + 1;
    const g = new Float32Array(stride * stride);
    for (let i = 0; i < g.length; i++) g[i] = r();
    for (let y = 0; y < h; y++) {
      const fy = (y / h) * c, y0 = Math.min(c - 1, Math.floor(fy)), ty = fy - y0, sy = ty * ty * (3 - 2 * ty);
      for (let x = 0; x < w; x++) {
        const fx = (x / w) * c, x0 = Math.min(c - 1, Math.floor(fx)), tx = fx - x0, sx = tx * tx * (3 - 2 * tx), x1 = (x0 + 1) % c;
        const a = g[y0 * stride + x0], b = g[y0 * stride + x1], cc = g[(y0 + 1) * stride + x0], d = g[(y0 + 1) * stride + x1];
        out[y * w + x] += amp * ((a * (1 - sx) + b * sx) * (1 - sy) + (cc * (1 - sx) + d * sx) * sy);
      }
    }
    tot += amp; amp *= 0.5;
  }
  for (let i = 0; i < out.length; i++) out[i] /= tot;
  return out;
}
const hex = (c: string): RGB => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
function canvas(w: number, h: number) { const c = document.createElement('canvas'); c.width = w; c.height = h; return { c, g: c.getContext('2d')! }; }
function finish(c: HTMLCanvasElement, srgb = true) { const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
function paint(w: number, h: number, fn: (x: number, y: number, i: number) => RGB) {
  const { c, g } = canvas(w, h);
  const img = g.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x, [r, gg, b] = fn(x, y, i); img.data[i * 4] = r; img.data[i * 4 + 1] = gg; img.data[i * 4 + 2] = b; img.data[i * 4 + 3] = 255; }
  g.putImageData(img, 0, 0);
  return { c, g };
}
function craters(g: CanvasRenderingContext2D, w: number, h: number, count: number, seed: number) {
  const r = rng(seed);
  for (let k = 0; k < count; k++) {
    const x = r() * w, y = h * (0.1 + r() * 0.8), rad = (2 + Math.pow(r(), 3) * 26) * (w / 1024);
    const grd = g.createRadialGradient(x, y, rad * 0.2, x, y, rad);
    grd.addColorStop(0, 'rgba(0,0,0,0.22)'); grd.addColorStop(0.8, 'rgba(0,0,0,0.08)'); grd.addColorStop(1, 'rgba(255,255,255,0.10)');
    g.fillStyle = grd; g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
  }
}

export function planetTexture(id: string, lite: boolean) {
  const w = lite ? 512 : 1024, h = w / 2, key = `${id}-${w}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const n = fbm(w, h, 8, 4, id.length * 17 + 3);
  let out: { c: HTMLCanvasElement; g: CanvasRenderingContext2D };
  switch (id) {
    case 'jupiter': {
      const cream = hex('#ECDDC2'), tan = hex('#C2956C'), brown = hex('#8A5A3B'), spot = hex('#B5563A');
      out = paint(w, h, (x, y, i) => {
        const lat = y / h; let c = mix(cream, tan, (Math.sin(lat * Math.PI * 17 + n[i] * 4.2) * 0.5 + 0.5) * 0.85);
        if (Math.abs(lat - 0.42) < 0.035 || Math.abs(lat - 0.58) < 0.045) c = mix(c, brown, 0.55);
        const dx = (x / w - 0.3) / 0.055, dy = (lat - 0.655) / 0.028, d = dx * dx + dy * dy;
        return d < 1 ? mix(c, spot, (1 - d) * 0.85) : c;
      });
      break;
    }
    case 'saturn': {
      const a = hex('#E8D8AC'), b = hex('#C7A86F'), pole = hex('#9C8A64');
      out = paint(w, h, (x, y, i) => { const lat = y / h; return mix(mix(a, b, (Math.sin(lat * Math.PI * 13 + n[i] * 1.6) * 0.5 + 0.5) * 0.6), pole, Math.max(0, Math.abs(lat - 0.5) * 2 - 0.75) * 2); });
      break;
    }
    case 'mars': {
      const n2 = fbm(w, h, 5, 4, 91), a = hex('#A9452A'), b = hex('#D27A45'), dark = hex('#6B2E1C'), ice = hex('#F1E9E1');
      out = paint(w, h, (x, y, i) => { const lat = y / h; let c = mix(a, b, n[i]); if (n2[i] < 0.44) c = mix(c, dark, Math.min(1, (0.44 - n2[i]) * 3.2)); return lat < 0.07 || lat > 0.93 ? mix(c, ice, 0.85) : c; });
      craters(out.g, w, h, 40, 5);
      break;
    }
    case 'moon': {
      const a = hex('#77736E'), b = hex('#BDB8B0'), mare = hex('#55524F'), n2 = fbm(w, h, 4, 3, 33);
      out = paint(w, h, (x, y, i) => { const c = mix(a, b, n[i]); return n2[i] < 0.42 ? mix(c, mare, (0.42 - n2[i]) * 2.4) : c; });
      craters(out.g, w, h, 140, 7);
      break;
    }
    case 'mercury': {
      const a = hex('#6C6259'), b = hex('#A99C8C');
      out = paint(w, h, (x, y, i) => mix(a, b, n[i]));
      craters(out.g, w, h, 180, 11);
      break;
    }
    case 'venus': {
      const a = hex('#D5B97F'), b = hex('#F2E3B9');
      out = paint(w, h, (x, y, i) => mix(a, b, Math.sin((y / h) * Math.PI * 7 + n[i] * 7 + (x / w) * Math.PI * 0.6) * 0.5 + 0.5));
      break;
    }
    default: {
      const f = fbm(w, h, 32, 3, 77), a = hex('#E8761C'), b = hex('#FFD782');
      out = paint(w, h, (x, y, i) => mix(a, b, Math.min(1, f[i] * 0.7 + n[i] * 0.5)));
    }
  }
  const t = finish(out.c);
  cache.set(key, t);
  return t;
}

export function ringTexture() {
  const hit = cache.get('ring');
  if (hit) return hit;
  const { c, g } = canvas(512, 4);
  const img = g.createImageData(512, 4);
  const r = rng(4), wob = Array.from({ length: 512 }, () => r());
  const cream = hex('#E9DCC0'), tan = hex('#B59C74');
  for (let x = 0; x < 512; x++) {
    const u = x / 511;
    let a = 0.35 + 0.45 * (Math.sin(u * 90) * 0.5 + 0.5) * (0.6 + wob[x] * 0.4);
    if (u < 0.04) a *= u / 0.04;
    if (u > 0.55 && u < 0.6) a = 0.05;
    if (u > 0.96) a *= (1 - u) / 0.04;
    const col = mix(cream, tan, wob[x] * 0.5 + (u > 0.6 ? 0.3 : 0));
    for (let y = 0; y < 4; y++) { const i = (y * 512 + x) * 4; img.data[i] = col[0]; img.data[i + 1] = col[1]; img.data[i + 2] = col[2]; img.data[i + 3] = Math.round(a * 255); }
  }
  g.putImageData(img, 0, 0);
  const t = finish(c);
  cache.set('ring', t);
  return t;
}

export function glowTexture(color: string, key = 'glow') {
  const id = `${key}-${color}`, hit = cache.get(id);
  if (hit) return hit;
  const { c, g } = canvas(256, 256);
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, color); grd.addColorStop(0.18, color); grd.addColorStop(0.45, 'rgba(255,212,174,0.25)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
  const t = finish(c);
  cache.set(id, t);
  return t;
}

export function coronaTexture() {
  const hit = cache.get('corona');
  if (hit) return hit;
  const { c, g } = canvas(256, 256);
  const grd = g.createRadialGradient(128, 128, 30, 128, 128, 128);
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.34, 'rgba(255,240,220,0.95)'); grd.addColorStop(0.42, 'rgba(255,212,174,0.45)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
  const t = finish(c);
  cache.set('corona', t);
  return t;
}

export function stoneTexture() {
  const hit = cache.get('stone');
  if (hit) return hit;
  const n = fbm(256, 256, 6, 5, 21);
  const { c } = paint(256, 256, (x, y, i) => { const v = 215 + n[i] * 40; return [v, v * 0.98, v * 0.95]; });
  const t = finish(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  cache.set('stone', t);
  return t;
}

export function jaaliTexture() {
  const hit = cache.get('jaali');
  if (hit) return hit;
  const S = 512, cell = 128;
  const { c, g } = canvas(S, S);
  g.fillStyle = '#fff'; g.fillRect(0, 0, S, S);
  g.fillStyle = '#000';
  for (let cy = 0; cy < S / cell; cy++) for (let cx = 0; cx < S / cell; cx++) {
    const ox = cx * cell + cell / 2, oy = cy * cell + cell / 2;
    g.beginPath();
    for (let k = 0; k < 16; k++) { const a = (k / 16) * Math.PI * 2 + Math.PI / 16, r = k % 2 === 0 ? 46 : 27; const x = ox + Math.cos(a) * r, y = oy + Math.sin(a) * r; if (k === 0) g.moveTo(x, y); else g.lineTo(x, y); }
    g.closePath(); g.fill();
    g.beginPath(); g.moveTo(cx * cell, cy * cell - 12); g.lineTo(cx * cell + 12, cy * cell); g.lineTo(cx * cell, cy * cell + 12); g.lineTo(cx * cell - 12, cy * cell); g.closePath(); g.fill();
  }
  g.fillStyle = '#fff';
  for (let cy = 0; cy < S / cell; cy++) for (let cx = 0; cx < S / cell; cx++) { g.beginPath(); g.arc(cx * cell + cell / 2, cy * cell + cell / 2, 9, 0, Math.PI * 2); g.fill(); }
  const t = finish(c, false);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  cache.set('jaali', t);
  return t;
}
