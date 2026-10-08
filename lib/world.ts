export const world = {
  t: 0, pointer: { x: 0, y: 0 }, hoverZone: -1, hoverNumber: 0, sumRow: -1, hoverService: '' as string, focusGraha: '' as string,
  dob: null as null | { counts: number[]; root: number; destiny: number },
  heading: null as number | null, sky: null as null | Record<string, number>, camYaw: 0,
  lite: false, reduced: false
};
export function detectEnv() {
  if (typeof window === 'undefined') return;
  world.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  world.lite = window.matchMedia('(max-width: 820px), (pointer: coarse)').matches;
}
