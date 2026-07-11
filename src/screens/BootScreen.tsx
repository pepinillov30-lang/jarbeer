import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { bootSequence, USER_NAME } from '../data/mockData';
import { playSound } from '../lib/sound';
import { APP_VERSION } from '../lib/config';

interface BootScreenProps {
  onComplete: () => void;
  soundEnabled: boolean;
}

type Phase = 'logo' | 'init' | 'greeting' | 'done';

export function BootScreen({ onComplete, soundEnabled }: BootScreenProps) {
  const [phase, setPhase] = useState<Phase>('logo');
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  // Phase 1: logo → init
  useEffect(() => {
    let mounted = true;
    const t = setTimeout(() => {
      if (!mounted) return;
      playSound('boot', soundEnabled);
      setPhase('init');
    }, 1800);
    return () => { mounted = false; clearTimeout(t); };
  }, [soundEnabled]);

  // Phase 2: init steps
  useEffect(() => {
    if (phase !== 'init') return;
    let mounted = true;
    let i = 0;
    const run = () => {
      if (i >= bootSequence.length) {
        setTimeout(() => mounted && setPhase('greeting'), 600);
        return;
      }
      setTimeout(() => {
        if (!mounted) return;
        playSound('checkmark', soundEnabled);
        setStep(i + 1);
        i++;
        run();
      }, bootSequence[i].delay);
    };
    const t = setTimeout(run, 400);
    return () => { mounted = false; clearTimeout(t); };
  }, [phase, soundEnabled]);

  // Phase 3: greeting → complete
  useEffect(() => {
    if (phase !== 'greeting') return;
    const t = setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 1000);
    }, 3200);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <motion.div
      animate={exiting ? { opacity: 0, scale: 1.04, filter: 'blur(14px)' } : {}}
      transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-ink-950"
    >
      {/* Deep ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,135,255,0.09) 0%, transparent 70%)',
        }}
      />

      {/* HUD corners */}
      {(['tl','tr','bl','br'] as const).map((c) => (
        <motion.div
          key={c}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`pointer-events-none absolute
            ${c.includes('t') ? 'top-5' : 'bottom-5'}
            ${c.includes('l') ? 'left-5' : 'right-5'}
          `}
        >
          <svg width="24" height="24" fill="none" overflow="visible">
            {c === 'tl' && <><line x1="0" y1="0" x2="0" y2="24" stroke="rgba(0,225,255,0.25)" strokeWidth="1.5"/><line x1="0" y1="0" x2="24" y2="0" stroke="rgba(0,225,255,0.25)" strokeWidth="1.5"/></>}
            {c === 'tr' && <><line x1="24" y1="0" x2="24" y2="24" stroke="rgba(0,225,255,0.25)" strokeWidth="1.5"/><line x1="0" y1="0" x2="24" y2="0" stroke="rgba(0,225,255,0.25)" strokeWidth="1.5"/></>}
            {c === 'bl' && <><line x1="0" y1="0" x2="0" y2="24" stroke="rgba(0,225,255,0.25)" strokeWidth="1.5"/><line x1="0" y1="24" x2="24" y2="24" stroke="rgba(0,225,255,0.25)" strokeWidth="1.5"/></>}
            {c === 'br' && <><line x1="24" y1="0" x2="24" y2="24" stroke="rgba(0,225,255,0.25)" strokeWidth="1.5"/><line x1="0" y1="24" x2="24" y2="24" stroke="rgba(0,225,255,0.25)" strokeWidth="1.5"/></>}
          </svg>
        </motion.div>
      ))}

      <AnimatePresence mode="wait">
        {/* ── LOGO PHASE ── */}
        {phase === 'logo' && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            {/* Emblem */}
            <div className="relative mb-10 flex h-32 w-32 items-center justify-center">
              {/* Outer slow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '1px solid rgba(0,225,255,0.2)', borderRadius: '50%' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-electric-400" style={{ boxShadow: '0 0 12px #00e1ff' }} />
              </motion.div>
              {/* Inner reverse ring */}
              <motion.div
                className="absolute inset-5 rounded-full"
                style={{ border: '1px solid rgba(255,170,0,0.2)', borderRadius: '50%' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full" style={{ background: '#FFAA00', boxShadow: '0 0 10px #FFAA00' }} />
              </motion.div>
              {/* Core glow */}
              <motion.div
                className="absolute inset-10 rounded-full"
                style={{ background: 'rgba(0,135,255,0.15)', filter: 'blur(12px)' }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Beer mug icon */}
              <BeerGlassIcon />
            </div>

            <h1 className="font-display text-5xl font-black tracking-[0.2em] text-white glow-white">
              J.A.R.B.E.E.R.
            </h1>
            <p className="mt-3 font-mono text-xs tracking-[0.45em] uppercase" style={{ color: 'rgba(0,225,255,0.6)' }}>
              Intelligent Brewery OS
            </p>
          </motion.div>
        )}

        {/* ── INIT PHASE ── */}
        {phase === 'init' && (
          <motion.div
            key="init"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18, filter: 'blur(6px)' }}
            transition={{ duration: 0.5 }}
            className="flex w-full max-w-xs flex-col items-center px-6"
          >
            <div className="mb-2 font-display text-xl font-bold tracking-[0.18em] text-white">
              J.A.R.B.E.E.R.
            </div>
            <p className="mb-8 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: 'rgba(100,128,150,0.6)' }}>
              Inicializando sistema
            </p>

            <div className="w-full space-y-3.5">
              {bootSequence.map((item, idx) => {
                const checked = step > idx;
                const active = step === idx;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: step >= idx ? 1 : 0.18, x: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.03 }}
                    className="flex items-center gap-4"
                  >
                    {/* Status icon */}
                    <div
                      className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300"
                      style={{
                        background: checked
                          ? `rgba(0,225,255,0.1)`
                          : active
                          ? `rgba(255,170,0,0.1)`
                          : 'rgba(13,24,36,0.6)',
                        border: checked
                          ? '1px solid rgba(0,225,255,0.3)'
                          : active
                          ? '1px solid rgba(255,170,0,0.4)'
                          : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {checked ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        >
                          <Check size={13} style={{ color: '#00e1ff' }} strokeWidth={3} />
                        </motion.div>
                      ) : active ? (
                        <motion.div
                          className="h-3 w-3 rounded-full border-2"
                          style={{ borderColor: '#FFAA00', borderTopColor: 'transparent' }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.65, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <span className="font-mono text-xs" style={{ color: 'rgba(74,96,112,0.5)' }}>
                          {item.icon}
                        </span>
                      )}
                    </div>

                    {/* Label */}
                    <div className="flex-1">
                      <span
                        className="font-mono text-sm tracking-wider transition-colors duration-300"
                        style={{
                          color: checked ? '#e8f0f8' : active ? '#ffffff' : 'rgba(74,96,112,0.6)',
                        }}
                      >
                        {item.label}
                      </span>
                    </div>

                    {/* OK badge */}
                    {checked && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="font-mono text-[10px] tracking-widest"
                        style={{ color: item.color ?? '#00e1ff', opacity: 0.7 }}
                      >
                        OK
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-8 h-px w-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
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

        {/* ── GREETING PHASE ── */}
        {phase === 'greeting' && (
          <motion.div
            key="greeting"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center px-8 text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em]"
              style={{ color: '#34d399' }}
            >
              Sistema preparado · {APP_VERSION}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-display text-4xl font-bold text-white glow-white sm:text-5xl"
            >
              {greeting},
            </motion.h2>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.6 }}
              className="font-display text-4xl font-bold sm:text-5xl glow-orange"
              style={{ color: '#FFAA00' }}
            >
              {USER_NAME}.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-7 space-y-2"
            >
              <p className="font-mono text-sm" style={{ color: 'rgba(144,168,184,0.7)' }}>
                Todos los sistemas están operativos.
              </p>
              <p className="font-mono text-sm" style={{ color: 'rgba(0,225,255,0.8)' }}>
                Lote activo:{' '}
                <span style={{ color: '#00e1ff', fontWeight: 500 }}>Golden Ale 26-017</span>
              </p>
            </motion.div>

            {/* Expanding rings */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {[100, 160, 220].map((r, i) => (
                <motion.div
                  key={r}
                  className="absolute rounded-full"
                  style={{ width: r, height: r, border: '1px solid rgba(0,225,255,0.1)' }}
                  animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.1, 0.4] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Version stamp */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(42,61,82,0.8)' }}>
        {APP_VERSION} · PROTOTYPE ONE
      </div>
    </motion.div>
  );
}

function BeerGlassIcon() {
  return (
    <svg width="34" height="44" viewBox="0 0 34 44" fill="none">
      <defs>
        <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(0,225,255,0.9)" />
          <stop offset="100%" stopColor="rgba(0,135,255,0.5)" />
        </linearGradient>
      </defs>
      {/* Glass body */}
      <path
        d="M6 8 L4 40 Q4 43 17 43 Q30 43 30 40 L28 8 Z"
        fill="rgba(0,225,255,0.1)"
        stroke="url(#bg1)"
        strokeWidth="1.5"
      />
      {/* Foam */}
      <path
        d="M6 8 Q17 4 28 8"
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse cx="17" cy="8" rx="11" ry="4" fill="rgba(255,255,255,0.15)" />
      {/* Handle */}
      <path
        d="M28 14 Q36 14 36 22 Q36 30 28 30"
        fill="none"
        stroke="url(#bg1)"
        strokeWidth="1.5"
      />
      {/* Bubbles */}
      <circle cx="13" cy="28" r="1.5" fill="rgba(0,225,255,0.5)" />
      <circle cx="18" cy="34" r="1" fill="rgba(0,225,255,0.4)" />
      <circle cx="22" cy="22" r="1.5" fill="rgba(0,225,255,0.4)" />
    </svg>
  );
}
