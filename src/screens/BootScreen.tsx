import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { bootSequence, USER_NAME } from '../data/mockData';
import { playSound } from '../lib/sound';

interface BootScreenProps {
  onComplete: () => void;
  soundEnabled: boolean;
}

type Phase = 'logo' | 'init' | 'greeting' | 'done';

export function BootScreen({ onComplete, soundEnabled }: BootScreenProps) {
  const [phase, setPhase] = useState<Phase>('logo');
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Phase 1: show logo
    const t1 = setTimeout(() => {
      if (!mounted) return;
      playSound('boot', soundEnabled);
      setPhase('init');
    }, 1400);

    return () => {
      mounted = false;
      clearTimeout(t1);
    };
  }, [soundEnabled]);

  useEffect(() => {
    if (phase !== 'init') return;
    let mounted = true;
    let i = 0;

    const run = () => {
      if (i >= bootSequence.length) {
        setTimeout(() => mounted && setPhase('greeting'), 500);
        return;
      }
      const { delay } = bootSequence[i];
      setTimeout(() => {
        if (!mounted) return;
        playSound('checkmark', soundEnabled);
        setStep(i + 1);
        i++;
        run();
      }, delay);
    };
    const t = setTimeout(run, 300);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [phase, soundEnabled]);

  useEffect(() => {
    if (phase !== 'greeting') return;
    const t = setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 900);
    }, 2800);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <motion.div
      animate={exiting ? { opacity: 0, scale: 1.06, filter: 'blur(12px)' } : {}}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-ink-950"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,135,255,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Corner markers */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
        <motion.div
          key={c}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`pointer-events-none absolute ${c.includes('t') ? 'top-6' : 'bottom-6'} ${c.includes('l') ? 'left-6' : 'right-6'}`}
        >
          <svg width="28" height="28" fill="none">
            {c === 'tl' && <><line x1="0" y1="0" x2="0" y2="28" stroke="rgba(0,225,255,0.3)" strokeWidth="1.5"/><line x1="0" y1="0" x2="28" y2="0" stroke="rgba(0,225,255,0.3)" strokeWidth="1.5"/></>}
            {c === 'tr' && <><line x1="28" y1="0" x2="28" y2="28" stroke="rgba(0,225,255,0.3)" strokeWidth="1.5"/><line x1="0" y1="0" x2="28" y2="0" stroke="rgba(0,225,255,0.3)" strokeWidth="1.5"/></>}
            {c === 'bl' && <><line x1="0" y1="0" x2="0" y2="28" stroke="rgba(0,225,255,0.3)" strokeWidth="1.5"/><line x1="0" y1="28" x2="28" y2="28" stroke="rgba(0,225,255,0.3)" strokeWidth="1.5"/></>}
            {c === 'br' && <><line x1="28" y1="0" x2="28" y2="28" stroke="rgba(0,225,255,0.3)" strokeWidth="1.5"/><line x1="0" y1="28" x2="28" y2="28" stroke="rgba(0,225,255,0.3)" strokeWidth="1.5"/></>}
          </svg>
        </motion.div>
      ))}

      <AnimatePresence mode="wait">
        {phase === 'logo' && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(8px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            {/* Holographic emblem */}
            <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '1px solid rgba(0,225,255,0.3)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(0,225,255,0.8)]" />
              </motion.div>
              <motion.div
                className="absolute inset-4 rounded-full"
                style={{ border: '1px solid rgba(0,135,255,0.25)' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-electric-400" />
              </motion.div>
              <motion.div
                className="absolute inset-8 rounded-full bg-cyan-500/10 blur-lg"
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <BrewBottleIcon />
            </div>

            <h1 className="font-display text-5xl font-black tracking-[0.18em] text-white glow-white sm:text-6xl">
              J.A.R.B.E.E.R.
            </h1>
            <p className="mt-3 font-mono text-sm tracking-[0.4em] text-cyan-400/70 uppercase">
              Intelligent Brewery OS
            </p>
          </motion.div>
        )}

        {phase === 'init' && (
          <motion.div
            key="init"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex w-full max-w-sm flex-col items-center px-8"
          >
            <h2 className="mb-2 font-display text-2xl font-bold tracking-widest text-white">
              J.A.R.B.E.E.R.
            </h2>
            <p className="mb-8 font-mono text-xs tracking-widest text-ink-500 uppercase">
              Inicializando sistema...
            </p>

            <div className="w-full space-y-3">
              {bootSequence.map((item, idx) => {
                const checked = step > idx;
                const active = step === idx;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: step >= idx ? 1 : 0.2, x: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    className="flex items-center gap-4"
                  >
                    {/* Icon */}
                    <div
                      className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all duration-400 ${
                        checked
                          ? 'border-cyan-400/40 bg-cyan-500/15'
                          : active
                          ? 'border-orange-DEFAULT/60 bg-orange-500/10'
                          : 'border-ink-700 bg-ink-900'
                      }`}
                    >
                      {checked ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 450, damping: 18 }}
                        >
                          <Check size={14} className="text-cyan-300" strokeWidth={3} />
                        </motion.div>
                      ) : active ? (
                        <motion.div
                          className="h-3 w-3 rounded-full border border-t-transparent"
                          style={{ borderColor: '#FA6A00', borderTopColor: 'transparent' }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : null}
                    </div>

                    {/* Label */}
                    <span
                      className={`flex-1 font-mono text-sm transition-colors duration-300 ${
                        checked
                          ? 'text-cyan-200'
                          : active
                          ? 'text-white'
                          : 'text-ink-600'
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Status */}
                    {checked && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-mono text-[10px] text-cyan-500/60"
                      >
                        OK
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-8 h-px w-full overflow-hidden bg-ink-800">
              <motion.div
                className="h-full"
                style={{ background: 'linear-gradient(90deg, #0087ff, #00e1ff)' }}
                initial={{ width: '0%' }}
                animate={{ width: `${(step / bootSequence.length) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        {phase === 'greeting' && (
          <motion.div
            key="greeting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center px-8 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-3 font-mono text-xs tracking-[0.35em] text-emerald-400/80 uppercase"
            >
              Sistema preparado
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-display text-4xl font-bold text-white glow-white sm:text-5xl"
            >
              {greeting},
            </motion.h2>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="font-display text-4xl font-bold sm:text-5xl"
              style={{ color: '#FA6A00', textShadow: '0 0 20px rgba(250,106,0,0.6)' }}
            >
              {USER_NAME}.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mt-6 space-y-2"
            >
              <p className="font-mono text-sm text-ink-400">
                Todos los sistemas están operativos.
              </p>
              <p className="font-mono text-sm text-cyan-300/80">
                Lote activo: <span className="text-cyan-200">Golden Ale 26-017</span>
              </p>
            </motion.div>

            {/* Pulse ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {[1, 1.5, 2].map((s, i) => (
                <motion.div
                  key={s}
                  className="absolute h-48 w-48 rounded-full border border-cyan-400/10"
                  animate={{ scale: [s, s * 1.15, s], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom version */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-ink-700">
        v2.0 · PROTOTYPE ONE
      </div>
    </motion.div>
  );
}

function BrewBottleIcon() {
  return (
    <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
      <defs>
        <linearGradient id="bb1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(0,225,255,0.8)" />
          <stop offset="100%" stopColor="rgba(0,135,255,0.4)" />
        </linearGradient>
      </defs>
      <rect x="15" y="2" width="10" height="7" rx="2" fill="url(#bb1)" />
      <path d="M16 9 L16 17 Q16 20 14 22 L12 28 Q11 31 11 34 L11 52 Q11 58 20 58 Q29 58 29 52 L29 34 Q29 31 28 28 L26 22 Q24 20 24 17 L24 9 Z"
        fill="rgba(0,225,255,0.15)" stroke="rgba(0,225,255,0.6)" strokeWidth="1.5" />
      <path d="M14 36 Q20 33 26 36 L26 52 Q26 56 20 56 Q14 56 14 52 Z"
        fill="rgba(0,225,255,0.25)" />
    </svg>
  );
}
