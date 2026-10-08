'use client';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { world } from '@/lib/world';
import { sample } from './poses';

export default function Dust() {
  const ref = useRef<THREE.Points>(null!);
  const { geo, mat } = useMemo(() => {
    const n = world.lite ? 200 : 600;
    const p = new Float32Array(n * 3);
    for (let k = 0; k < n; k++) { p[k * 3] = (Math.random() - 0.5) * 10; p[k * 3 + 1] = Math.random() * 4.2; p[k * 3 + 2] = (Math.random() - 0.5) * 9; }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
    return { geo, mat: new THREE.PointsMaterial({ size: 0.02, transparent: true, depthWrite: false, sizeAttenuation: true }) };
  }, []);
  useFrame((state, dt) => {
    const P = sample();
    mat.color.copy(P.line);
    mat.opacity = 0.14 * (1 - P.plan) * (1 - P.orbit) + P.jaali * 0.5;
    if (world.reduced) return;
    const time = state.clock.elapsedTime;
    ref.current.rotation.y = time * 0.01;
    ref.current.position.y = Math.sin(time * 0.2) * 0.08;
    ref.current.position.x += (world.pointer.x * 0.35 - ref.current.position.x) * (1 - Math.exp(-dt * 2));
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}
