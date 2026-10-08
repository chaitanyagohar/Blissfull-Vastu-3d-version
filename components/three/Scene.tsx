'use client';
import { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { sample, S } from './poses';
import Lights from './Lights';
import Tiles from './Tiles';
import { PlanLines, PlanLabels } from './Plan';
import { LoShuPath, Numerals } from './Numbers';
import Navagraha from './Navagraha';
import { Jaali, Ground } from './Jaali';
import Dust from './Dust';
import CameraRig from './CameraRig';
import HeroOrnaments from './HeroOrnaments';

export default function Scene() {
  const { scene } = useThree();
  useEffect(() => { scene.background = S.bg; }, [scene]);
  useFrame(() => { sample(); }, -1);
  return (
    <>
      <Lights /><CameraRig /><Ground /><Tiles /><HeroOrnaments /><PlanLines /><PlanLabels /><LoShuPath /><Numerals /><Navagraha /><Jaali /><Dust />
    </>
  );
}