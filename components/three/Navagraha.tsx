'use client';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { world } from '@/lib/world';
import { GRAHAS, RING_R, grahaOfNumber } from '@/data/navagraha';
import { media } from '@/data/media';
import { sample, loc, easeOut, lerp, clamp, LOSHU, tileXZ, slabHeight } from './poses';
import { planetTexture, ringTexture, glowTexture, coronaTexture } from './textures';
import { STARS, FIGURES, starXYZ } from './stars';

const VS = `varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`;
const FS = `uniform vec3 c; uniform float o; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - max(dot(vN, vV), 0.0), 3.0); gl_FragColor = vec4(c, f * o); }`;

export default function Navagraha() {
  const root = useRef<THREE.Group>(null!);
  const bodies = useRef<Record<string, THREE.Group>>({});
  const spins = useRef<Record<string, THREE.Mesh>>({});
  const labels = useRef<Record<string, THREE.Group>>({});
  const labelEls = useRef<Record<string, HTMLSpanElement | null>>({});
  const rings = useRef<THREE.LineLoop[]>([]);
  const sunLight = useRef<THREE.PointLight>(null!);
  const starsRef = useRef<THREE.Group>(null!);
  const lite = world.lite;

  const res = useMemo(() => {
    const seg = lite ? 24 : 48;
    const sphere = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.75));
    const mats: Record<string, THREE.Material> = {}, atm: Record<string, THREE.Material> = {};
    for (const g of GRAHAS) {
      if (g.kind === 'planet') mats[g.id] = new THREE.MeshStandardMaterial({ map: planetTexture(g.tex!, lite), roughness: 0.95, metalness: 0 });
      else if (g.kind === 'star') mats[g.id] = new THREE.MeshBasicMaterial({ map: planetTexture('sun', lite) });
      else mats[g.id] = new THREE.MeshBasicMaterial({ color: '#030306' });
      if (g.atmos) atm[g.id] = new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, uniforms: { c: { value: new THREE.Color(g.atmos) }, o: { value: 0.9 } }, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    }
    const ringGeo = new THREE.RingGeometry(1.3, 2.3, lite ? 64 : 128, 1);
    const pos = ringGeo.getAttribute('position') as THREE.BufferAttribute, uv = ringGeo.getAttribute('uv') as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, Math.hypot(pos.getX(i), pos.getY(i)) - 1.3, 0.5);
    const ringMat = new THREE.MeshStandardMaterial({ map: ringTexture(), transparent: true, side: THREE.DoubleSide, depthWrite: false, roughness: 1 });
    const pts: number[] = [];
    const cs = lite ? 96 : 160;
    for (let k = 0; k < cs; k++) { const a = (k / cs) * Math.PI * 2; pts.push(Math.cos(a), 0, Math.sin(a)); }
    const circle = new THREE.BufferGeometry(); circle.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const ringLineMats = Array.from({ length: 8 }, () => new THREE.LineBasicMaterial({ transparent: true, depthWrite: false }));
    const sunGlow = new THREE.SpriteMaterial({ map: glowTexture('rgba(255,214,160,1)', 'sun'), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false });
    const corona = new THREE.SpriteMaterial({ map: coronaTexture(), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false });
    const n = lite ? 600 : 1600;
    const sp = new Float32Array(n * 3);
    for (let k = 0; k < n; k++) { const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, r = 32 + Math.random() * 14, s = Math.sqrt(1 - u * u); sp[k * 3] = s * Math.cos(th) * r; sp[k * 3 + 1] = u * r; sp[k * 3 + 2] = s * Math.sin(th) * r; }
    const field = new THREE.BufferGeometry(); field.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    const fieldMat = new THREE.PointsMaterial({ color: '#FFF6EC', size: 0.08, sizeAttenuation: true, transparent: true, depthWrite: false });
    const bright = new THREE.BufferGeometry(); bright.setAttribute('position', new THREE.Float32BufferAttribute(Object.values(STARS).flatMap(([ra, dec]) => starXYZ(ra, dec, 30)), 3));
    const brightMat = new THREE.PointsMaterial({ color: '#FFF0DC', size: 0.24, sizeAttenuation: true, transparent: true, depthWrite: false });
    const fig = new THREE.BufferGeometry(); fig.setAttribute('position', new THREE.Float32BufferAttribute(FIGURES.flatMap(([a, b]) => [...starXYZ(STARS[a][0], STARS[a][1], 30), ...starXYZ(STARS[b][0], STARS[b][1], 30)]), 3));
    const figMat = new THREE.LineBasicMaterial({ color: '#CEC1B5', transparent: true, depthWrite: false });
    return { sphere, mats, atm, ringGeo, ringMat, circle, ringLineMats, sunGlow, corona, field, fieldMat, bright, brightMat, fig, figMat };
  }, [lite]);

  useEffect(() => {
    if (!media.planetTextures) return;
    const loader = new THREE.TextureLoader();
    for (const g of GRAHAS) {
      if (!g.tex || !media.planets[g.tex]) continue;
      loader.load(media.planets[g.tex], (t) => { t.colorSpace = THREE.SRGBColorSpace; const m = res.mats[g.id] as THREE.MeshStandardMaterial | THREE.MeshBasicMaterial; m.map = t; m.needsUpdate = true; });
    }
    loader.load(media.planets.saturnRing, (t) => { t.colorSpace = THREE.SRGBColorSpace; res.ringMat.map = t; res.ringMat.needsUpdate = true; });
  }, [res]);

  const tmp = useMemo(() => new THREE.Vector3(), []), end = useMemo(() => new THREE.Vector3(), []), centre = useMemo(() => new THREE.Vector3(0, 0.25, 0), []);
  const proj = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, dt) => {
    const P = sample();
    const time = state.clock.elapsedTime;
    const born = easeOut(clamp((world.t - 3.55) / 0.9));
    const fin = easeOut(loc(7) * 1.3);
    const vis = born > 0.001 && P.orbit + born * (P.i <= 4 ? 1 : 0) > 0.01;
    root.current.visible = vis;
    starsRef.current.visible = P.stars > 0.01;
    res.fieldMat.opacity = P.stars * 0.7; res.brightMat.opacity = P.stars; res.figMat.opacity = P.stars * 0.18;
    if (!world.reduced) starsRef.current.rotation.y = 1.9 + time * 0.004;
    const orbitVis = Math.max(P.orbit, P.i === 3 ? born * 0.6 : 0);
    rings.current.forEach((r, k) => {
      if (!r) return;
      const R = RING_R(k + 1) * lerp(0.3, 1, born);
      r.scale.set(R, 1, R);
      res.ringLineMats[k].color.copy(P.line);
      res.ringLineMats[k].opacity = orbitVis * (k === 7 ? 0.35 : 0.22) * (1 - fin);
    });
    const focusId = world.focusGraha || (world.dob ? grahaOfNumber(world.dob.root).id : '');
    let rahuAng = 0;
    for (const g of GRAHAS) {
      const body = bodies.current[g.id];
      if (!body) continue;
      let ang: number;
      if (world.sky) ang = (world.sky[g.id] * Math.PI) / 180;
      else if (g.id === 'ketu') ang = rahuAng + Math.PI;
      else ang = (g.n * 40 * Math.PI) / 180 + (world.reduced ? 0 : time * 0.012 * (9 - g.ring));
      if (g.id === 'rahu') rahuAng = ang;
      const R = RING_R(g.ring);
      end.set(Math.cos(ang) * R, 0, -Math.sin(ang) * R);
      const [x, z] = tileXZ(LOSHU.indexOf(g.n));
      tmp.set(x, slabHeight(g.n) + 0.42, z).lerp(end, born).lerp(centre, fin);
      body.position.copy(tmp);
      const focus = focusId === g.id;
      const sc = g.size * lerp(0.12, 1, born) * (1 - fin) * (P.i === 6 ? 0.75 : 1) * (focus ? 1.25 : 1);
      body.scale.setScalar(Math.max(0.0001, sc));
      const spin = spins.current[g.id];
      if (spin && !world.reduced) spin.rotation.y += dt * (g.kind === 'star' ? 0.03 : 0.12);
      labels.current[g.id]?.position.set(tmp.x, tmp.y + sc * 1.7 + 0.14, tmp.z);
      const el = labelEls.current[g.id];
      if (el) { el.style.opacity = String(P.orbit * (1 - fin) * (P.i === 6 ? 0 : 1) * (focus ? 1 : 0.75)); el.classList.toggle('hot', focus); }
      if (g.id === 'surya') {
        sunLight.current.position.copy(tmp);
        proj.copy(tmp).project(state.camera);
        world.sunScreen.x = (proj.x + 1) / 2;
        world.sunScreen.y = (1 - proj.y) / 2;
      }
    }
    sunLight.current.intensity = 2.6 * Math.max(P.orbit, born * (P.i <= 4 ? 1 : 0)) * (1 - fin);
  });

  return (
    <>
      <group ref={starsRef} rotation={[-0.35, 1.9, 0]}>
        <points geometry={res.field} material={res.fieldMat} />
        <points geometry={res.bright} material={res.brightMat} />
        <lineSegments geometry={res.fig} material={res.figMat} />
      </group>
      <group ref={root}>
        <pointLight ref={sunLight} intensity={0} decay={0} color="#FFE2B0" />
        <group rotation={[0.06, 0, 0]}>
          {Array.from({ length: 8 }, (_, k) => <lineLoop key={k} ref={(el) => { if (el) rings.current[k] = el as THREE.LineLoop; }} geometry={res.circle} material={res.ringLineMats[k]} />)}
        </group>
        {GRAHAS.map((g) => (
          <group key={g.id} ref={(el) => { if (el) bodies.current[g.id] = el; }}>
            <mesh ref={(el) => { if (el) spins.current[g.id] = el; }} geometry={res.sphere} material={res.mats[g.id]} rotation={[0.2, 0, 0.05]} />
            {res.atm[g.id] && <mesh geometry={res.sphere} material={res.atm[g.id]} scale={1.08} />}
            {g.kind === 'star' && <sprite material={res.sunGlow} scale={7} />}
            {g.kind === 'node' && <sprite material={res.corona} scale={g.id === 'rahu' ? 2.8 : 2.2} />}
            {g.id === 'shani' && <mesh geometry={res.ringGeo} material={res.ringMat} rotation={[-Math.PI / 2 + 0.47, 0, 0]} />}
          </group>
        ))}
        {GRAHAS.map((g) => (
          <group key={`l-${g.id}`} ref={(el) => { if (el) labels.current[g.id] = el; }}>
            <Html center zIndexRange={[4, 0]} style={{ pointerEvents: 'none' }}>
              <span ref={(el) => { labelEls.current[g.id] = el; }} className="gl-graha"><b>{g.n}</b> {g.sk}</span>
            </Html>
          </group>
        ))}
      </group>
    </>
  );
}
