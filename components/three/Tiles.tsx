'use client';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { world } from '@/lib/world';
import { sample, loc, easeOut, LOSHU, LINES, tileXZ, planYaw, slabHeight } from './poses';
import { stoneTexture } from './textures';

export default function Tiles() {
  const group = useRef<THREE.Group>(null!);
  const meshes = useRef<THREE.Mesh[]>([]);
  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), []);
  const egeo = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  const stone = useMemo(() => stoneTexture(), []);
  const mats = useMemo(() => Array.from({ length: 9 }, () => new THREE.MeshStandardMaterial({ map: stone, roughness: 0.9, metalness: 0, transparent: true })), [stone]);
  const lmats = useMemo(() => Array.from({ length: 9 }, () => new THREE.LineBasicMaterial({ transparent: true })), []);
  const rnd = useMemo(() => Array.from({ length: 9 }, (_, i) => ({ y: Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, rx: Math.sin(i * 7.1) * 0.7, rz: Math.cos(i * 3.7) * 0.7 })), []);
  const C = useMemo(() => ({ bronze: new THREE.Color('#C29A6C'), coffee: new THREE.Color('#674C37'), peach: new THREE.Color('#F2B98A') }), []);

  useFrame((state) => {
    const P = sample();
    const time = state.clock.elapsedTime;
    const hero = loc(0), fin = loc(7), drift = world.reduced ? 0 : 1;
    group.current.rotation.y = P.rotY + planYaw() + Math.sin(time * 0.12) * 0.03 * (1 - P.plan) * (1 - P.jaali) * drift;
    const line = P.nums > 0.5 && world.sumRow >= 0 ? LINES[world.sumRow] : null;
    const root = world.dob?.root ?? -1;
    for (let i = 0; i < 9; i++) {
      const m = meshes.current[i];
      if (!m) continue;
      const [x, z] = tileXZ(i);
      const d = Math.abs(Math.floor(i / 3) - 1) + Math.abs((i % 3) - 1);
      let vis = 1;
      if (i !== 4) {
        if (P.i === 0) vis = world.reduced ? (hero > 0.3 ? 1 : 0) : easeOut(hero * 2.2 - d * 0.35);
        vis *= 1 - easeOut(fin * 1.8);
      }
      const n = LOSHU[i];
      const focus = P.nums > 0.5 && world.hoverNumber === n;
      const h = slabHeight(n) + (focus ? 0.3 : 0);
      const sp = P.spread, s = Math.max(0.0001, vis) * (1 - P.orbit * 0.5);
      m.position.set(x * (1 + sp * 0.9), sp * (rnd[i].y * 1.6 - 0.3) + Math.sin(time * 0.6 + i) * 0.05 * sp * drift, z * (1 + sp * 0.9));
      m.rotation.set(rnd[i].rx * sp, 0, rnd[i].rz * sp);
      m.scale.set(s, Math.max(0.002, h) * Math.max(0.0001, vis), s);
      const mat = mats[i];
      let col = i === 4 ? C.bronze : P.tile;
      if (P.plan > 0.5 && world.hoverZone === i) col = C.coffee;
      if (line && line.includes(i)) col = C.peach;
      if (P.nums > 0.5 && n === root) col = C.bronze;
      if (focus) col = C.coffee;
      mat.color.copy(col);
      mat.emissive.copy(P.glow);
      mat.emissiveIntensity = i === 4 ? P.cGlow * 0.5 * (1 + Math.sin(time * 1.6) * 0.1 * drift) : 0;
      mat.opacity = 1 - P.dim * 0.45;
      lmats[i].color.copy(P.line);
      lmats[i].opacity = (0.4 + P.plan * 0.4) * (1 - P.dim * 0.4) * (1 - P.jaali * 0.7);
    }
  });

  return (
    <group ref={group}>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} ref={(el) => { if (el) meshes.current[i] = el; }} geometry={geo} material={mats[i]} castShadow receiveShadow>
          <lineSegments geometry={egeo} material={lmats[i]} />
        </mesh>
      ))}
    </group>
  );
}
