'use client';
import { Component, Suspense, useEffect, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
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
  const [maxDpr, setMaxDpr] = useState(2);
  const [lite, setLite] = useState(false);
  const [loop, setLoop] = useState<'always' | 'never'>('always');
  useEffect(() => {
    detectEnv();
    let gl = false;
    try { const c = document.createElement('canvas'); gl = !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { gl = false; }
    const max = Math.min(window.devicePixelRatio || 1, world.lite ? 1.5 : 2);
    setMaxDpr(max); setDpr(max); setLite(world.lite); setOk(gl);
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
        <Canvas flat shadows={!lite} frameloop={loop} dpr={dpr} gl={{ antialias: true, powerPreference: 'high-performance' }} camera={{ fov: 38, near: 0.1, far: 120, position: [0, 2.1, 2.5] }} onCreated={ready}>
          <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(1, +(d - 0.5).toFixed(2)))} onIncline={() => setDpr((d) => Math.min(maxDpr, +(d + 0.25).toFixed(2)))} />
          <Suspense fallback={null}><Scene /></Suspense>
        </Canvas>
      </Boundary>
    </div>
  );
}
