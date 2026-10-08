'use client';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { world } from '@/lib/world';
import { sample, loc, easeOut, GAP, planYaw } from './poses';

const E = 1.5 * GAP + 0.02, RING = 2.75;
const DIRS: [string, number][] = [['N', 0], ['NE', 45], ['E', 90], ['SE', 135], ['S', 180], ['SW', 225], ['W', 270], ['NW', 315]];
function vis() {
  const P = sample();
  const d = P.i < 2 ? 0 : P.i === 2 ? easeOut(loc(2) * 2) : 1;
  const v = Math.max(P.plan, world.hoverService === 'vastu' ? 0.75 * P.dim : 0);
  return { P, d: Math.max(d, world.hoverService === 'vastu' ? 1 : 0), v };
}

export function PlanLines() {
  const group = useRef<THREE.Group>(null!);
  const parts = useMemo(() => {
    const seg = (pts: number[]) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); return g; };
    const grid: number[] = [];
    for (let k = 0; k <= 9; k++) { const v = -E + (k * 2 * E) / 9; grid.push(-E, 0, v, E, 0, v, v, 0, -E, v, 0, E); }
    const frame: number[] = [];
    for (const o of [0.28, 0.34]) { const e = E + o; frame.push(-e, 0, -e, e, 0, -e, e, 0, -e, e, 0, e, e, 0, e, -e, 0, e, -e, 0, e, -e, 0, -e); }
    const axes = [0, 0, -RING, 0, 0, RING, -RING, 0, 0, RING, 0, 0];
    const ring: number[] = [];
    const N = world.lite ? 96 : 192;
    for (let k = 0; k < N; k++) { const a0 = (k / N) * Math.PI * 2, a1 = ((k + 1) / N) * Math.PI * 2; ring.push(Math.sin(a0) * RING, 0, -Math.cos(a0) * RING, Math.sin(a1) * RING, 0, -Math.cos(a1) * RING); }
    for (let k = 0; k < 72; k++) { const a = (k / 72) * Math.PI * 2, l = k % 9 === 0 ? 0.22 : 0.09; ring.push(Math.sin(a) * RING, 0, -Math.cos(a) * RING, Math.sin(a) * (RING + l), 0, -Math.cos(a) * (RING + l)); }
    const mk = () => new THREE.LineBasicMaterial({ transparent: true, depthWrite: false });
    return { grid: seg(grid), frame: seg(frame), axes: seg(axes), ring: seg(ring), m: [mk(), mk(), mk(), mk()] };
  }, []);
  useFrame(() => {
    const { P, d, v } = vis();
    group.current.visible = v > 0.01;
    if (!group.current.visible) return;
    group.current.rotation.y = P.rotY + planYaw();
    group.current.position.y = P.slab + 0.012;
    const count = (g: THREE.BufferGeometry, p: number) => { const n = g.getAttribute('position').count; g.setDrawRange(0, Math.floor((n * p) / 2) * 2); };
    count(parts.grid, d); count(parts.frame, easeOut(d * 1.3 - 0.2)); count(parts.axes, easeOut(d * 1.5 - 0.3)); count(parts.ring, easeOut(d * 1.2 - 0.1));
    const op = [0.5, 0.8, 0.35, 0.65];
    parts.m.forEach((m, k) => { m.color.copy(P.line); m.opacity = op[k] * v; });
  });
  return (
    <group ref={group}>
      <lineSegments geometry={parts.grid} material={parts.m[0]} />
      <lineSegments geometry={parts.frame} material={parts.m[1]} />
      <lineSegments geometry={parts.axes} material={parts.m[2]} />
      <lineSegments geometry={parts.ring} material={parts.m[3]} />
    </group>
  );
}

export function PlanLabels() {
  const group = useRef<THREE.Group>(null!);
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  useFrame(() => {
    const { P, d, v } = vis();
    group.current.rotation.y = P.rotY + planYaw();
    group.current.position.y = P.slab + 0.02;
    const col = `#${P.line.getHexString()}`;
    refs.current.forEach((el, k) => { if (!el) return; el.style.opacity = String(v * easeOut(d * 1.4 - 0.4 - k * 0.04)); el.style.color = col; });
  });
  return (
    <group ref={group}>
      {DIRS.map(([l, deg], k) => {
        const a = (deg * Math.PI) / 180, r = RING + 0.5;
        return (
          <Html key={l} position={[Math.sin(a) * r, 0, -Math.cos(a) * r]} center zIndexRange={[4, 0]} style={{ pointerEvents: 'none' }}>
            <span ref={(el) => { refs.current[k] = el; }} className="gl-label">{l}</span>
          </Html>
        );
      })}
      <Html position={[0, 0.03, 0.42]} center zIndexRange={[4, 0]} style={{ pointerEvents: 'none' }}>
        <span ref={(el) => { refs.current[8] = el; }} className="gl-label gl-small">Brahmasthan</span>
      </Html>
    </group>
  );
}
