'use client';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { world } from '@/lib/world';
import { sample, mixArr, SHIFT, LIFT } from './poses';

export default function CameraRig() {
  const look = useRef(new THREE.Vector3());
  const tgt = useMemo(() => new THREE.Vector3(), []), lk = useMemo(() => new THREE.Vector3(), []), dir = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, dt) => {
    const P = sample();
    const cam = state.camera as THREE.PerspectiveCamera;
    const aspect = state.size.width / Math.max(1, state.size.height);
    tgt.copy(P.cam); lk.copy(P.look);
    if (aspect > 1.05) { const s = mixArr(SHIFT) * Math.min(1, (aspect - 1.05) * 2); tgt.x -= s; lk.x -= s; }
    else {
      const f = Math.min(2.1, Math.pow(1 / aspect, 0.7));
      tgt.sub(lk).multiplyScalar(f).add(lk);
      const lift = mixArr(LIFT), top = P.plan;
      tgt.z += lift * top; lk.z += lift * top; tgt.y -= lift * (1 - top); lk.y -= lift * (1 - top);
    }
    if (!world.reduced && !world.lite) { tgt.x += world.pointer.x * 0.25; tgt.y += world.pointer.y * 0.15; }
    const a = 1 - Math.exp(-dt * 4.5);
    cam.position.lerp(tgt, a); look.current.lerp(lk, a); cam.lookAt(look.current);
    dir.copy(look.current).sub(cam.position);
    world.camYaw = ((Math.atan2(dir.x, -dir.z) * 180) / Math.PI + 360) % 360;
  });
  return null;
}
