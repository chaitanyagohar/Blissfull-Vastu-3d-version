let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let on = false;
export function soundOn() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    const sa = 130.81;
    const voices: [number, number, OscillatorType][] = [[sa / 2, 0.32, 'sine'], [sa, 0.4, 'triangle'], [sa * 1.5, 0.18, 'sine'], [sa * 2, 0.22, 'triangle']];
    voices.forEach(([f, g, type], i) => {
      const o = ctx!.createOscillator(); o.type = type; o.frequency.value = f;
      const og = ctx!.createGain(); og.gain.value = g * 0.22;
      const lfo = ctx!.createOscillator(); lfo.frequency.value = 0.04 + i * 0.027;
      const lg = ctx!.createGain(); lg.gain.value = g * 0.1;
      lfo.connect(lg).connect(og.gain); o.connect(og).connect(master!); o.start(); lfo.start();
    });
  }
  void ctx.resume();
  master!.gain.setTargetAtTime(0.45, ctx.currentTime, 1.4);
  on = true;
}
export function soundOff() { if (ctx && master) master.gain.setTargetAtTime(0, ctx.currentTime, 0.4); on = false; }
export function chime(freq: number) {
  if (!on || !ctx || !master) return;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime); g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.6);
  o.connect(g).connect(master); o.start(); o.stop(ctx.currentTime + 2.7);
}
