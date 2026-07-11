// Synthetic audio cues generated with the Web Audio API — no files needed.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function tone(
  freq: number,
  gainVal: number,
  duration: number,
  type: OscillatorType = 'sine',
  delay = 0,
) {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
  gain.gain.setValueAtTime(0, ac.currentTime + delay);
  gain.gain.linearRampToValueAtTime(gainVal, ac.currentTime + delay + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + delay + duration);
  osc.start(ac.currentTime + delay);
  osc.stop(ac.currentTime + delay + duration + 0.05);
}

export const sounds = {
  boot: () => {
    tone(220, 0.15, 0.3, 'sine', 0);
    tone(440, 0.12, 0.3, 'sine', 0.35);
    tone(660, 0.1, 0.5, 'sine', 0.7);
    tone(880, 0.08, 0.8, 'sine', 1.1);
  },
  checkmark: () => {
    tone(440, 0.1, 0.15, 'sine', 0);
    tone(660, 0.08, 0.2, 'sine', 0.1);
  },
  listen: () => {
    tone(500, 0.08, 0.2, 'sine', 0);
    tone(600, 0.06, 0.2, 'sine', 0.15);
    tone(700, 0.05, 0.3, 'sine', 0.3);
  },
  process: () => {
    for (let i = 0; i < 4; i++) {
      tone(300 + i * 80, 0.05, 0.15, 'square', i * 0.12);
    }
  },
  confirm: () => {
    tone(523, 0.1, 0.15, 'sine', 0);
    tone(659, 0.1, 0.15, 'sine', 0.12);
    tone(784, 0.12, 0.35, 'sine', 0.24);
  },
  alert: () => {
    tone(660, 0.1, 0.1, 'square', 0);
    tone(440, 0.1, 0.15, 'square', 0.15);
    tone(330, 0.08, 0.25, 'square', 0.32);
  },
  navigate: () => {
    tone(440, 0.06, 0.12, 'sine', 0);
    tone(550, 0.05, 0.15, 'sine', 0.08);
  },
};

export type SoundKey = keyof typeof sounds;

export function playSound(key: SoundKey, enabled: boolean) {
  if (!enabled) return;
  try {
    sounds[key]();
  } catch {
    // AudioContext may be blocked before user interaction
  }
}
