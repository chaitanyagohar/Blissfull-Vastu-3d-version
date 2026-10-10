'use client';
import { Component, Suspense, useEffect, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import Fallback from '@/components/ui/Fallback';
import { world, detectEnv } from '@/lib/world';

class Boundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}
const ready = () => requestAnimationFrame(() => requestAnimationFrame(() => window.dispatchEvent(new Event('world:ready'))));

export default function WorldCanvas() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [dpr, setDpr] = useState(1);
  const [lite, setLite] = useState(false);
  const [loop, setLoop] = useState<'always' | 'never'>('always');

  useEffect(() => {
    detectEnv();
    let gl = false;
    try { const c = document.createElement('canvas'); gl = !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { gl = false; }
    /* one fixed resolution — never changes mid-scroll (no flicker) */
    setDpr(Math.min(window.devicePixelRatio || 1, world.lite ? 1.25 : 1.5));
    setLite(world.lite);
    setOk(gl);
    const vis = () => setLoop(document.hidden ? 'never' : 'always');
    document.addEventListener('visibilitychange', vis);
    return () => document.removeEventListener('visibilitychange', vis);
  }, []);

  useEffect(() => { if (ok === false) { document.documentElement.classList.add('no-webgl'); ready(); } }, [ok]);
  if (ok === null) return null;
  if (!ok) return <Fallback />;

  return (
    <div className="world" aria-hidden="true">
      <Boundary onError={() => setOk(false)}>
        <Canvas
          flat shadows={!lite} frameloop={loop} dpr={dpr}
          gl={{ antialias: !lite, powerPreference: 'high-performance', stencil: false }}
          camera={{ fov: 38, near: 0.1, far: 120, position: [0, 2.1, 2.5] }}
          onCreated={ready}
        >
          <Suspense fallback={null}><Scene /></Suspense>
        </Canvas>
      </Boundary>
    </div>
  );
}