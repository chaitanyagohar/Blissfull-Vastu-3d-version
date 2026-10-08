import { world } from './world';
let anchors: number[] = [];
export function measure() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]')).sort((a, b) => Number(a.dataset.chapter) - Number(b.dataset.chapter));
  anchors = els.map((el) => el.getBoundingClientRect().top + window.scrollY);
  const last = els[els.length - 1];
  if (last) anchors.push(last.getBoundingClientRect().top + window.scrollY + last.offsetHeight - window.innerHeight);
}
export function update(y: number) {
  if (anchors.length < 2) return;
  let i = 0;
  while (i < anchors.length - 2 && y >= anchors[i + 1]) i++;
  const a = anchors[i], b = anchors[i + 1];
  world.t = i + Math.min(1, Math.max(0, (y - a) / Math.max(1, b - a)));
}
