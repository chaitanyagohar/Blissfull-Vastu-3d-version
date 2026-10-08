'use client';
/* Opening ornaments: a bronze compass ring (72 ticks + N) and the nine Lo Shu numbers orbiting the first square.
   Visible only in the opening; fades as the slabs unfold. */
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { world } from '@/lib/world';
import { sample, loc, easeOut } from './poses';

const RING = 1.75, ORBIT = 2.3;

export default function HeroOrnaments() {
  const tilt = useRef<THREE.Group>(null!);
  const spin = useRef<THREE.Group>(null!);
  const orbit = useRef<THREE.Group>(null!);
  const north = useRef<HTMLSpanElement>(null);
  const nums = useRef<(HTMLSpanElement | null)[]>([]);
  const holders = useRef<THREE.Group[]>([]);

  const { ring, ticks, inner, mat, mat2 } = useMemo(() => {
    const seg = world.lite ? 96 : 160;
    const pts: number[] = [], pts2: number[] = [];
    for (let k = 0; k < seg; k++) {
      const a = (k / seg) * Math.PI * 2;
      pts.push(Math.cos(a) * RING, 0, Math.sin(a) * RING);
      pts2.push(Math.cos(a) * ORBIT, 0, Math.sin(a) * ORBIT);
    }
    const ring = new THREE.BufferGeometry(); ring.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const inner = new THREE.BufferGeometry(); inner.setAttribute('position', new THREE.Float32BufferAttribute(pts2, 3));
    const t: number[] = [];
    for (let k = 0; k < 72; k++) {
      const a = (k / 72) * Math.PI * 2, l = k % 9 === 0 ? 0.16 : 0.07;
      t.push(Math.cos(a) * RING, 0, Math.sin(a) * RING, Math.cos(a) * (RING + l), 0, Math.sin(a) * (RING + l));
    }
    const ticks = new THREE.BufferGeometry(); ticks.setAttribute('position', new THREE.Float32BufferAttribute(t, 3));
    return {
      ring, ticks, inner,
      mat: new THREE.LineBasicMaterial({ color: '#C29A6C', transparent: true, depthWrite: false }),
      mat2: new THREE.LineBasicMaterial({ color: '#674C37', transparent: true, depthWrite: false })
    };
  }, []);

  useFrame((state, dt) => {
    const P = sample();
    const v = P.i === 0 ? 1 - easeOut((loc(0) - 0.3) / 0.35) : 0;
    tilt.current.visible = v > 0.01;
    if (!tilt.current.visible) return;
    const still = world.reduced ? 0 : 1;
    const px = world.lite ? 0 : world.pointer.x, py = world.lite ? 0 : world.pointer.y;
    tilt.current.rotation.x += ((-0.08 + py * 0.12) - tilt.current.rotation.x) * Math.min(1, dt * 3);
    tilt.current.rotation.z += ((-px * 0.1) - tilt.current.rotation.z) * Math.min(1, dt * 3);
    spin.current.rotation.y += dt * 0.06 * still;
    orbit.current.rotation.y -= dt * 0.035 * still;
    mat.opacity = 0.75 * v;
    mat2.opacity = 0.18 * v;
    if (north.current) north.current.style.opacity = String(v);
    const cam = state.camera.position;
    const w = new THREE.Vector3();
    for (let n = 1; n <= 9; n++) {
      const el = nums.current[n], h = holders.current[n];
      if (!el || !h) continue;
      h.getWorldPosition(w);
      const front = THREE.MathUtils.clamp(1.2 - w.distanceTo(cam) / 6, 0.35, 1);
      el.style.opacity = String(v * front);
    }
  });

  return (
    <group ref={tilt} position={[0, 0.07, 0]}>
      <group ref={spin}>
        <lineLoop geometry={ring} material={mat} />
        <lineSegments geometry={ticks} material={mat} />
        <Html position={[0, 0, -RING - 0.32]} center zIndexRange={[4, 0]} style={{ pointerEvents: 'none' }}>
          <span ref={north} className="gl-label" style={{ color: '#674C37', fontSize: 11 }}>N</span>
        </Html>
      </group>
      <group ref={orbit}>
        <lineLoop geometry={inner} material={mat2} />
        {Array.from({ length: 9 }, (_, k) => k + 1).map((n) => {
          const a = ((n - 1) / 9) * Math.PI * 2;
          return (
            <group key={n} ref={(el) => { if (el) holders.current[n] = el; }} position={[Math.cos(a) * ORBIT, 0.02, Math.sin(a) * ORBIT]}>
              <Html center zIndexRange={[4, 0]} style={{ pointerEvents: 'none' }}>
                <span ref={(el) => { nums.current[n] = el; }} className="gl-num" style={{ color: '#674C37', fontSize: 'clamp(18px, 1.6vw, 26px)' }}>{n}</span>
              </Html>
            </group>
          );
        })}
      </group>
    </group>
  );
}