'use client';
/* Panch Tattva on the Vastu plan: water NE · fire SE · earth SW · air NW · space centre.
   Soft colour washes + icon labels, revealed one by one after the plan draws. */
import { useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { world } from '@/lib/world';
import { sample, loc, easeOut, GAP, tileXZ, planYaw } from './poses';

const svg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const EL = [
  { i: 2, sk: 'Jal', en: 'Water', zone: 'NE', color: '#6C9DB8', ink: '#2F5D75', icon: svg(<path d="M12 3c3.5 4.6 6 8 6 11a6 6 0 0 1-12 0c0-3 2.5-6.4 6-11Z" />) },
  { i: 8, sk: 'Agni', en: 'Fire', zone: 'SE', color: '#E07A3F', ink: '#9A3F14', icon: svg(<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.4-4 2.6-5.2.2 1.7 1 2.8 2.1 3.2C11 8.5 11.2 5.6 12 3Z" />) },
  { i: 6, sk: 'Prithvi', en: 'Earth', zone: 'SW', color: '#A9844F', ink: '#5E4421', icon: svg(<path d="M3 19 9.5 8l4 6 2.5-3.5L21 19Z" />) },
  { i: 0, sk: 'Vayu', en: 'Air', zone: 'NW', color: '#8FB0A6', ink: '#3F6158', icon: svg(<path d="M3 9h11a3 3 0 1 0-3-3M3 14h15a3 3 0 1 1-3 3M3 19h7" />) },
  { i: 4, sk: 'Akash', en: 'Space', zone: 'Centre', color: '#A792C6', ink: '#5A4580', icon: svg(<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /></>) }
];

function softTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 8, 64, 64, 92);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export default function Tattva() {
  const group = useRef<THREE.Group>(null!);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const { geo, mats } = useMemo(() => {
    const tex = softTexture();
    return {
      geo: new THREE.PlaneGeometry(GAP * 0.98, GAP * 0.98).rotateX(-Math.PI / 2),
      mats: EL.map((e) => new THREE.MeshBasicMaterial({ color: e.color, map: tex, transparent: true, depthWrite: false, opacity: 0 }))
    };
  }, []);

  useFrame(() => {
    const P = sample();
    const d = P.i < 2 ? 0 : P.i === 2 ? easeOut(loc(2) * 2) : 1;
    const v = P.plan;
    group.current.visible = v > 0.01;
    if (!group.current.visible) return;
    group.current.rotation.y = P.rotY + planYaw();
    group.current.position.y = P.slab + 0.016;
    EL.forEach((e, k) => {
      const reveal = easeOut(d * 1.8 - 1 - k * 0.1);
      const hot = world.hoverZone === e.i ? 1.7 : 1;
      mats[k].opacity = Math.min(0.85, 0.42 * v * reveal * hot);
      const el = labels.current[k];
      if (el) el.style.opacity = String(v * reveal);
    });
  });

  return (
    <group ref={group}>
      {EL.map((e, k) => {
        const [x, z] = tileXZ(e.i);
        return (
          <group key={e.sk} position={[x, 0, z]}>
            <mesh geometry={geo} material={mats[k]} />
            <Html position={[0, 0.02, e.i === 4 ? -0.18 : 0]} center zIndexRange={[4, 0]} style={{ pointerEvents: 'none' }}>
              <span ref={(el) => { labels.current[k] = el; }} style={{ display: 'grid', justifyItems: 'center', gap: 2, color: e.ink, opacity: 0, whiteSpace: 'nowrap', userSelect: 'none' }}>
                {e.icon}
                <b style={{ font: '600 11px var(--sans)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{e.sk}</b>
                <small style={{ font: '500 8.5px var(--mono)', letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.75 }}>{e.en} · {e.zone}</small>
              </span>
            </Html>
          </group>
        );
      })}
    </group>
  );
}