'use client';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { sample, easeOut } from './poses';
import { jaaliTexture, stoneTexture, glowTexture } from './textures';

export function Jaali() {
  const ref = useRef<THREE.Mesh>(null!);
  const back = useRef<THREE.Mesh>(null!);
  const { mat, depth, geo, backMat } = useMemo(() => {
    const tex = jaaliTexture().clone();
    tex.needsUpdate = true; tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(5, 3);
    return {
      geo: new THREE.PlaneGeometry(6, 3.6).translate(0, 1.8, 0),
      mat: new THREE.MeshStandardMaterial({ color: '#4A3222', roughness: 0.95, alphaMap: tex, alphaTest: 0.5, side: THREE.DoubleSide }),
      depth: new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, alphaMap: tex, alphaTest: 0.5 }),
      backMat: new THREE.MeshBasicMaterial({ map: glowTexture('rgba(255,212,174,1)', 'dawn'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
    };
  }, []);
  useFrame(() => {
    const P = sample();
    const v = P.jaali > 0.02;
    ref.current.visible = v; back.current.visible = v;
    ref.current.scale.y = Math.max(0.001, easeOut(P.jaali * 1.2));
    backMat.opacity = P.jaali * 0.9;
  });
  return (
    <>
      <mesh ref={back} position={[0, 2, -4.2]} scale={[12, 7, 1]} material={backMat}><planeGeometry args={[1, 1]} /></mesh>
      <mesh ref={ref} position={[0, 0, -2.6]} geometry={geo} material={mat} customDepthMaterial={depth} castShadow />
    </>
  );
}

export function Ground() {
  const floor = useRef<THREE.Mesh>(null!);
  const catcher = useRef<THREE.Mesh>(null!);
  const { floorMat, shadowMat } = useMemo(() => {
    const t = stoneTexture().clone();
    t.needsUpdate = true; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 6);
    return {
      floorMat: new THREE.MeshStandardMaterial({ color: '#674C37', map: t, roughness: 1, transparent: true }),
      shadowMat: new THREE.ShadowMaterial({ opacity: 0.2, transparent: true, color: '#351C0C' })
    };
  }, []);
  useFrame(() => {
    const P = sample();
    floor.current.visible = P.floor > 0.01;
    floorMat.opacity = P.floor;
    catcher.current.visible = P.shadow > 0.01;
    shadowMat.opacity = 0.22 * P.shadow;
  });
  return (
    <>
      <mesh ref={floor} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} material={floorMat} receiveShadow><planeGeometry args={[18, 18]} /></mesh>
      <mesh ref={catcher} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} material={shadowMat} receiveShadow><planeGeometry args={[18, 18]} /></mesh>
    </>
  );
}
