'use client';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { world } from '@/lib/world';
import { sample, loc, easeOut, lerp, clamp, LOSHU, tileXZ, slabHeight } from './poses';

const SUB = 18;
const progress = () => { const P = sample(); return P.i < 3 ? 0 : P.i === 3 ? easeOut(loc(3) / 0.7) : 1; };

export function LoShuPath() {
  const group = useRef<THREE.Group>(null!);
  const { geo, mat, obj } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array((8 * SUB + 1) * 3), 3));
    const m = new THREE.LineBasicMaterial({ color: '#674C37', transparent: true, depthTest: false });
    return { geo: g, mat: m, obj: new THREE.Line(g, m) };
  }, []);
  const a = useMemo(() => new THREE.Vector3(), []), b = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const P = sample();
    const v = Math.max(P.nums, world.hoverService === 'numerology' ? 0.7 * P.dim : 0);
    group.current.visible = v > 0.01 && !world.dob;
    if (!group.current.visible) return;
    group.current.rotation.y = P.rotY;
    const top = (n: number, out: THREE.Vector3) => { const [x, z] = tileXZ(LOSHU.indexOf(n)); return out.set(x, slabHeight(n) + 0.03, z); };
    const pos = geo.getAttribute('position') as THREE.BufferAttribute;
    let k = 0;
    for (let n = 1; n < 9; n++) {
      top(n, a); top(n + 1, b);
      for (let s = 0; s < SUB; s++) {
        const t = s / SUB;
        pos.setXYZ(k++, lerp(a.x, b.x, t), lerp(a.y, b.y, t) + Math.sin(t * Math.PI) * 0.25, lerp(a.z, b.z, t));
      }
    }
    top(9, a); pos.setXYZ(k, a.x, a.y, a.z);
    pos.needsUpdate = true;
    const prog = world.hoverService === 'numerology' && P.dim > 0.5 ? 1 : progress();
    geo.setDrawRange(0, Math.max(0, Math.floor(prog * (8 * SUB + 1))));
    mat.opacity = v * 0.95;
  });

  return <group ref={group}><primitive object={obj} /></group>;
}

export function Numerals() {
  const group = useRef<THREE.Group>(null!);
  const holders = useRef<THREE.Group[]>([]);
  const els = useRef<(HTMLSpanElement | null)[]>([]);
  useFrame(() => {
    const P = sample();
    const v = Math.max(P.nums * (1 - easeOut((world.t - 3.55) / 0.3)), world.hoverService === 'numerology' ? 0.7 * P.dim : 0);
    group.current.rotation.y = P.rotY;
    const prog = progress();
    const col = `#${P.line.getHexString()}`;
    for (let n = 1; n <= 9; n++) {
      const [x, z] = tileXZ(LOSHU.indexOf(n));
      const focus = world.hoverNumber === n || world.dob?.root === n;
      holders.current[n]?.position.set(x, slabHeight(n) + (focus && P.nums > 0.5 ? 0.3 : 0) + 0.42, z);
      const el = els.current[n];
      if (!el) continue;
      const present = world.dob ? (world.dob.counts[n] > 0 ? 1 : 0.25) : Math.max(0.15, clamp(prog * 9 - (n - 1) + 0.5));
      el.style.opacity = String(v * present);
      el.style.color = focus ? '#674C37' : col;
    }
  });
  return (
    <group ref={group}>
      {Array.from({ length: 9 }, (_, k) => k + 1).map((n) => (
        <group key={n} ref={(el) => { if (el) holders.current[n] = el; }}>
          <Html center zIndexRange={[4, 0]} style={{ pointerEvents: 'none' }}>
            <span ref={(el) => { els.current[n] = el; }} className="gl-num">{n}</span>
          </Html>
        </group>
      ))}
    </group>
  );
}