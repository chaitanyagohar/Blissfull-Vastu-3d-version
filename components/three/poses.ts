/* One pose per chapter. Bright: opening, idea, vastu, numerology (peach), studio, final. Black: navagraha, light. */
import * as THREE from 'three';
import { world } from '@/lib/world';

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const smooth = (x: number) => { x = clamp(x); return x * x * (3 - 2 * x); };
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const loc = (i: number) => clamp(world.t - i);

export const GAP = 1.08;
export const LOSHU = [4, 9, 2, 3, 5, 7, 8, 1, 6];
export const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
export const tileXZ = (i: number): [number, number] => [((i % 3) - 1) * GAP, (Math.floor(i / 3) - 1) * GAP];

type V3 = [number, number, number];
type Pose = {
  cam: V3; look: V3; bg: string; line: string; tile: string; glow: string;
  slab: number; numH: number; spread: number; plan: number; nums: number; orbit: number; stars: number; dim: number; cGlow: number;
  shadow: number; sun: number; floor: number; jaali: number; amb: number;
};

export const POSES: Pose[] = [
  /* 0 opening */    { cam: [0, 2.1, 2.5], look: [0, 0, 0], bg: '#FFF6EC', line: '#351C0C', tile: '#E3D6CA', glow: '#FFD4AE', slab: 0.14, numH: 0, spread: 0, plan: 0, nums: 0, orbit: 0, stars: 0, dim: 0, cGlow: 0.35, shadow: 0.5, sun: 0, floor: 0, jaali: 0, amb: 0.95 },
  /* 1 idea */       { cam: [4.4, 3.0, 5.8], look: [0, 0.3, 0], bg: '#F3EAE1', line: '#351C0C', tile: '#CEC1B5', glow: '#FFD4AE', slab: 0.9, numH: 0, spread: 1, plan: 0, nums: 0, orbit: 0, stars: 0, dim: 0, cGlow: 0.2, shadow: 0.35, sun: 0, floor: 0, jaali: 0, amb: 0.9 },
  /* 2 vastu */      { cam: [0, 8.2, 0.9], look: [0, 0, 0], bg: '#FBF1E6', line: '#351C0C', tile: '#E9E1D9', glow: '#674C37', slab: 0.06, numH: 0, spread: 0, plan: 1, nums: 0, orbit: 0, stars: 0, dim: 0, cGlow: 0.1, shadow: 1, sun: 1, floor: 0, jaali: 0, amb: 0.9 },
  /* 3 numerology */ { cam: [5.2, 4.6, 5.2], look: [0, 0.7, 0], bg: '#FFD4AE', line: '#351C0C', tile: '#FFF6EC', glow: '#674C37', slab: 0.1, numH: 1, spread: 0, plan: 0, nums: 1, orbit: 0, stars: 0, dim: 0, cGlow: 0.1, shadow: 0.6, sun: 0, floor: 0, jaali: 0, amb: 0.9 },
  /* 4 navagraha */  { cam: [0, 2.4, 9.4], look: [0, 0.2, 0], bg: '#000000', line: '#CEC1B5', tile: '#1A1A1A', glow: '#FFD4AE', slab: 0.02, numH: 0, spread: 0, plan: 0, nums: 0, orbit: 1, stars: 1, dim: 0, cGlow: 0.4, shadow: 0, sun: 0, floor: 0, jaali: 0, amb: 0.2 },
  /* 5 light */      { cam: [0, 1.5, 4.6], look: [0, 0.1, -0.7], bg: '#000000', line: '#FFD4AE', tile: '#8A6A50', glow: '#FFD4AE', slab: 0.03, numH: 0, spread: 0, plan: 0, nums: 0, orbit: 0, stars: 0, dim: 0, cGlow: 0.2, shadow: 0, sun: 0, floor: 1, jaali: 1, amb: 0.12 },
  /* 6 studio */     { cam: [0, 9.5, 10.5], look: [0, 0, 0], bg: '#FFF6EC', line: '#351C0C', tile: '#E3D6CA', glow: '#FFD4AE', slab: 0.3, numH: 0, spread: 0.35, plan: 0.25, nums: 0, orbit: 0.2, stars: 0, dim: 1, cGlow: 0.2, shadow: 0.3, sun: 0, floor: 0, jaali: 0, amb: 0.9 },
  /* 7 final */      { cam: [0, 2.3, 2.9], look: [0, 0, 0], bg: '#FFF6EC', line: '#674C37', tile: '#CEC1B5', glow: '#FFD4AE', slab: 0.14, numH: 0, spread: 0, plan: 0, nums: 0, orbit: 0.15, stars: 0, dim: 0, cGlow: 0.6, shadow: 0.5, sun: 0, floor: 0, jaali: 0, amb: 0.95 }
];

export const SHIFT = [0, 0.9, 1.2, 1.0, 0.7, 0, 0, 0];
export const LIFT = [0.3, 0.6, 1.1, 0.7, 0.6, 0.4, 0, 0.3];

const Y = new THREE.Vector3(0, 1, 0);
const tmp = new THREE.Vector3();
function camOf(i: number, l: number, out: THREE.Vector3) {
  out.set(...POSES[i].cam);
  switch (i) {
    case 0: out.lerp(tmp.set(0, 3.4, 4.6), easeOut(l / 0.6)); break;
    case 1: out.applyAxisAngle(Y, -l * 0.9); break;
    case 2: out.y -= l * 0.9; break;
    case 3: out.applyAxisAngle(Y, l * 1.0); out.y -= l * 0.6; break;
    case 4: out.applyAxisAngle(Y, l * 0.45); out.y += l * 1.4; break;
    case 5: out.x += lerp(-0.7, 0.7, l); break;
    case 7: tmp.set(0, 5.2, 7.8); out.copy(tmp.lerp(out, easeOut(l / 0.7))); break;
  }
  return out;
}
const rotOf = (i: number, l: number) => (i === 0 ? l * 0.5 : i === 1 ? 0.5 + l * 1.1 : 0);

const NUMS = ['slab', 'numH', 'spread', 'plan', 'nums', 'orbit', 'stars', 'dim', 'cGlow', 'shadow', 'sun', 'floor', 'jaali', 'amb'] as const;
export const S = {
  i: 0, f: 0, k: 0, rotY: 0, cam: new THREE.Vector3(), look: new THREE.Vector3(),
  bg: new THREE.Color(), line: new THREE.Color(), tile: new THREE.Color(), glow: new THREE.Color(),
  slab: 0, numH: 0, spread: 0, plan: 0, nums: 0, orbit: 0, stars: 0, dim: 0, cGlow: 0, shadow: 0, sun: 0, floor: 0, jaali: 0, amb: 0
};
const ca = new THREE.Vector3(), cb = new THREE.Vector3(), c2 = new THREE.Color();
let last = NaN;

export function sample() {
  const t = world.t;
  if (t === last) return S;
  last = t;
  const n = POSES.length, tt = clamp(t, 0, n - 1);
  const i = Math.min(n - 1, Math.floor(tt)), f = tt - i, j = Math.min(n - 1, i + 1);
  const k = i === j ? 0 : world.reduced ? (f > 0.8 ? 1 : 0) : smooth((f - 0.6) / 0.4);
  const A = POSES[i], B = POSES[j];
  S.i = i; S.f = f; S.k = k;
  camOf(i, f, ca); camOf(j, 0, cb); S.cam.copy(ca).lerp(cb, k);
  S.look.set(...A.look).lerp(cb.set(...B.look), k);
  S.rotY = lerp(rotOf(i, f), rotOf(j, 0), k);
  S.bg.set(A.bg).lerp(c2.set(B.bg), k);
  S.line.set(A.line).lerp(c2.set(B.line), k);
  S.tile.set(A.tile).lerp(c2.set(B.tile), k);
  S.glow.set(A.glow).lerp(c2.set(B.glow), k);
  for (const key of NUMS) S[key] = lerp(A[key], B[key], k);
  return S;
}
export const mixArr = (arr: number[]) => lerp(arr[S.i], arr[Math.min(arr.length - 1, S.i + 1)], S.k);
export const planYaw = () => (world.heading != null ? (world.heading * Math.PI) / 180 * S.plan : 0);
export function slabHeight(n: number) {
  const target = world.dob ? 0.08 + world.dob.counts[n] * 0.42 : 0.12 + n * 0.17;
  return lerp(S.slab, target, S.numH);
}
