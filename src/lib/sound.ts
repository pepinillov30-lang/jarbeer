type SoundName = 'boot' | 'checkmark' | 'navigate' | 'listen' | 'process' | 'confirm' | 'click';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.06,
  fadeIn = 0.01,
  fadeOut = 0.08,
) {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const env = ac.createGain();
    osc.connect(env);
    env.connect(ac.destination);
    osc.type = type;
    osc.frequency.value = freq;
    const now = ac.currentTime;
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(gain, now + fadeIn);
    env.gain.setValueAtTime(gain, now + duration - fadeOut);
    env.gain.linearRampToValueAtTime(0, now + duration);
    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // AudioContext blocked — silent fail
  }
}

export function playSound(name: SoundName, enabled: boolean) {
  if (!enabled) return;
  switch (name) {
    case 'boot':
      tone(220, 0.3, 'sine', 0.07);
      setTimeout(() => tone(330, 0.2, 'sine', 0.05), 200);
      setTimeout(() => tone(440, 0.4, 'sine', 0.07), 350);
      break;
    case 'checkmark':
      tone(880, 0.08, 'sine', 0.04);
      break;
    case 'navigate':
      tone(660, 0.1, 'sine', 0.04);
      break;
    case 'listen':
      tone(440, 0.15, 'sine', 0.05);
      setTimeout(() => tone(550, 0.15, 'sine', 0.04), 100);
      break;
    case 'process':
      tone(330, 0.2, 'triangle', 0.04);
      break;
    case 'confirm':
      tone(660, 0.12, 'sine', 0.05);
      setTimeout(() => tone(880, 0.18, 'sine', 0.04), 80);
      break;
    case 'click':
      tone(1200, 0.05, 'sine', 0.03);
      break;
  }
}
