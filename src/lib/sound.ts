type SoundName = 'boot'|'checkmark'|'navigate'|'listen'|'process'|'confirm'|'powerup';

let ctx: AudioContext | null = null;
function getCtx() { if (!ctx) ctx = new AudioContext(); return ctx; }

function tone(freq: number, dur: number, type: OscillatorType='sine', gain=0.05, fi=0.01, fo=0.08) {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator(), env = ac.createGain();
    osc.connect(env); env.connect(ac.destination);
    osc.type = type; osc.frequency.value = freq;
    const n = ac.currentTime;
    env.gain.setValueAtTime(0, n);
    env.gain.linearRampToValueAtTime(gain, n + fi);
    env.gain.setValueAtTime(gain, n + dur - fo);
    env.gain.linearRampToValueAtTime(0, n + dur);
    osc.start(n); osc.stop(n + dur);
  } catch { /* blocked */ }
}

export function playSound(name: SoundName, enabled: boolean) {
  if (!enabled) return;
  switch (name) {
    case 'powerup':
      tone(110,0.4,'sawtooth',0.04); tone(220,0.5,'sawtooth',0.04);
      setTimeout(()=>tone(440,0.6,'sine',0.06),400);
      setTimeout(()=>tone(880,0.8,'sine',0.05),800);
      break;
    case 'boot':
      tone(220,0.3,'sine',0.06); setTimeout(()=>tone(440,0.35,'sine',0.06),300); break;
    case 'checkmark': tone(880,0.08,'sine',0.04); break;
    case 'navigate':  tone(660,0.1,'sine',0.04); break;
    case 'listen':    tone(440,0.15,'sine',0.05); setTimeout(()=>tone(550,0.12,'sine',0.04),100); break;
    case 'process':   tone(330,0.2,'triangle',0.04); break;
    case 'confirm':   tone(660,0.12,'sine',0.05); setTimeout(()=>tone(880,0.18,'sine',0.04),80); break;
  }
}
