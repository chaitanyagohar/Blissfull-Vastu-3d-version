export const LOSHU = [4, 9, 2, 3, 5, 7, 8, 1, 6];
export const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
export const reduce = (n: number): number => { while (n > 9) n = String(n).split('').reduce((a, d) => a + Number(d), 0); return n; };
export function readDate(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const year = Number(m[1]), month = Number(m[2]), day = Number(m[3]);
  if (year < 1900 || year > new Date().getFullYear() || month < 1 || month > 12 || day < 1 || day > 31) return null;
  if (new Date(Date.UTC(year, month - 1, day)).getUTCDate() !== day) return null;
  const digits = (m[3] + m[2] + m[1]).split('').map(Number);
  const counts = Array(10).fill(0) as number[];
  digits.forEach((d) => { if (d) counts[d]++; });
  return { counts, root: reduce(day), destiny: reduce(digits.reduce((a, b) => a + b, 0)) };
}
