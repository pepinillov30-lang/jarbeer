type SoundName = 'boot' | 'checkmark' | 'navigate' | 'listen' | 'process' | 'confirm';

let ctx: AudioContext | null = null;
function getCtx() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}
function tone(freq: number, dur: number, type: OscillatorType = 'sine', gain = 0.05, fi = 0.01, fo = 0.08) {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const env = ac.createGain();
    osc.connect(env); env.connect(ac.destination);
    osc.type = type; osc.frequency.value = freq;
    const now = ac.currentTime;
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(gain, now + fi);
    env.gain.setValueAtTime(gain, now + dur - fo);
    env.gain.linearRampToValueAtTime(0, now + dur);
    osc.start(now); osc.stop(now + dur);
  } catch { /* blocked */ }
}

export function playSound(name: SoundName, enabled: boolean) {
  if (!enabled) return;
  switch (name) {
    case 'boot':      tone(220,0.3,'sine',0.06); setTimeout(()=>tone(440,0.35,'sine',0.06),300); break;
    case 'checkmark': tone(880,0.08,'sine',0.04); break;
    case 'navigate':  tone(660,0.1,'sine',0.04); break;
    case 'listen':    tone(440,0.15,'sine',0.05); setTimeout(()=>tone(550,0.12,'sine',0.04),100); break;
    case 'process':   tone(330,0.2,'triangle',0.04); break;
    case 'confirm':   tone(660,0.12,'sine',0.05); setTimeout(()=>tone(880,0.18,'sine',0.04),80); break;
  }
}
