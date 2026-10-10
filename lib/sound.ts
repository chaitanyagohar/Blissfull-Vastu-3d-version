/* Site sound: a music file played as a seamless loop (Web Audio), soft chimes on chapter change.
   Falls back to the generated drone if the file is missing. Only loads when the visitor turns sound on. */

const TRACK = '/audio/ambient.mp3';  // your music file in public/audio/
const VOLUME = 0.5;                  // 0 = silent … 1 = full
const CHIMES = true;                 // soft chime on each chapter change (set false to disable)

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let started = false;
let on = false;

function ensure() {
  if (ctx) return;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
}

/* seamless loop: decoded into memory, so there is no gap at the loop point */
async function startMusic() {
  try {
    const res = await fetch(TRACK);
    if (!res.ok) throw new Error('missing');
    const buffer = await ctx!.decodeAudioData(await res.arrayBuffer());
    const src = ctx!.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    src.connect(master!);
    src.start();
  } catch {
    startDrone();
  }
}

/* backup: the original generated drone */
function startDrone() {
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

export function soundOn() {
  ensure();
  void ctx!.resume();
  if (!started) { started = true; void startMusic(); }
  master!.gain.cancelScheduledValues(ctx!.currentTime);
  master!.gain.setTargetAtTime(VOLUME, ctx!.currentTime, 3);   // gentle fade-in
  on = true;
}

export function soundOff() {
  if (ctx && master) master.gain.setTargetAtTime(0, ctx.currentTime, 0.4);  // quick fade-out
  on = false;
}

export function chime(freq: number) {
  if (!CHIMES || !on || !ctx || !master) return;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.6);
  o.connect(g).connect(master); o.start(); o.stop(ctx.currentTime + 2.7);
}