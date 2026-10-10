'use client';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { world } from '@/lib/world';
import { sample, loc, lerp } from './poses';

export default function Lights() {
  const sun = useRef<THREE.DirectionalLight>(null!);
  const amb = useRef<THREE.AmbientLight>(null!);
  const target = useMemo(() => new THREE.Object3D(), []);
  const v = useMemo(() => ({ pos: new THREE.Vector3(), vastu: new THREE.Vector3(), jaali: new THREE.Vector3() }), []);
  const white = useMemo(() => new THREE.Color('#FFFFFF'), []), warm = useMemo(() => new THREE.Color('#FFD4AE'), []);
  useEffect(() => {
    const l = sun.current;
    l.target = target;
    l.shadow.mapSize.set(1024, 1024);
    const c = l.shadow.camera as THREE.OrthographicCamera;
    c.left = -7; c.right = 7; c.top = 7; c.bottom = -7; c.near = 0.5; c.far = 40; c.updateProjectionMatrix();
    l.shadow.bias = -0.0006; l.shadow.normalBias = 0.02;
  }, [target]);
  useFrame((state) => {
    const P = sample();
    state.gl.shadowMap.autoUpdate = P.shadow > 0.01 || P.jaali > 0.01;   // pause shadows in the space chapters
    const a = Math.PI * (0.08 + 0.84 * loc(2));
    v.vastu.set(Math.cos(a) * 9, Math.sin(a) * 7 + 1, 1.5);
    v.jaali.set(lerp(-3.5, 3.5, loc(5)), 3.6, -9);
    v.pos.set(4, 8, 3).lerp(v.vastu, P.sun).lerp(v.jaali, P.jaali);
    sun.current.position.copy(v.pos);
    sun.current.intensity = lerp(1.6, 3.4, P.jaali) * (1 - P.orbit * 0.85);
    sun.current.color.copy(white).lerp(warm, P.jaali);
    amb.current.intensity = P.amb;
  });
  return (
    <>
      <ambientLight ref={amb} intensity={0.9} />
      <directionalLight ref={sun} castShadow={!world.lite} position={[4, 8, 3]} intensity={1.6} />
      <primitive object={target} />
      <directionalLight position={[-5, 3, -4]} intensity={0.3} color="#FFD4AE" />
    </>
  );
}
