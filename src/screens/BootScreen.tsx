import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { bootSequence } from '../data/mockData';
import { playSound } from '../lib/sound';
import { APP_VERSION, USER_NAME } from '../lib/config';

interface BootScreenProps { onComplete: () => void; soundEnabled: boolean; }
type Phase = 'logo' | 'init' | 'greeting';

export function BootScreen({ onComplete, soundEnabled }: BootScreenProps) {
  const [phase, setPhase] = useState<Phase>('logo');
  const [step, setStep]   = useState(0);
  const [exit, setExit]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => { playSound('boot', soundEnabled); setPhase('init'); }, 2800);
    return () => clearTimeout(t);
  }, [soundEnabled]);

  useEffect(() => {
    if (phase !== 'init') return;
    let i = 0;
    const run = () => {
      if (i >= bootSequence.length) { setTimeout(() => setPhase('greeting'), 500); return; }
      setTimeout(() => { playSound('checkmark', soundEnabled); setStep(i + 1); i++; run(); }, bootSequence[i].delay);
    };
    const t = setTimeout(run, 350);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase !== 'greeting') return;
    const t = setTimeout(() => { setExit(true); setTimeout(onComplete, 900); }, 3200);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <motion.div
      animate={exit ? { opacity: 0, scale: 1.06, filter: 'blur(14px)' } : {}}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: '#020408' }}
    >
      {/* Fondo radial reactivo */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 48%, rgba(0,135,255,0.10) 0%, transparent 65%)' }} />

      {/* Esquinas HUD */}
      {(['tl','tr','bl','br'] as const).map(c => (
        <motion.div key={c} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className={`pointer-events-none absolute ${c.includes('t') ? 'top-5' : 'bottom-5'} ${c.includes('l') ? 'left-5' : 'right-5'}`}>
          <svg width="22" height="22" fill="none">
            {c==='tl'&&<><line x1="0" y1="0" x2="0" y2="22" stroke="rgba(0,225,255,0.22)" strokeWidth="1.5"/><line x1="0" y1="0" x2="22" y2="0" stroke="rgba(0,225,255,0.22)" strokeWidth="1.5"/></>}
            {c==='tr'&&<><line x1="22" y1="0" x2="22" y2="22" stroke="rgba(0,225,255,0.22)" strokeWidth="1.5"/><line x1="0" y1="0" x2="22" y2="0" stroke="rgba(0,225,255,0.22)" strokeWidth="1.5"/></>}
            {c==='bl'&&<><line x1="0" y1="0" x2="0" y2="22" stroke="rgba(0,225,255,0.22)" strokeWidth="1.5"/><line x1="0" y1="22" x2="22" y2="22" stroke="rgba(0,225,255,0.22)" strokeWidth="1.5"/></>}
            {c==='br'&&<><line x1="22" y1="0" x2="22" y2="22" stroke="rgba(0,225,255,0.22)" strokeWidth="1.5"/><line x1="0" y1="22" x2="22" y2="22" stroke="rgba(0,225,255,0.22)" strokeWidth="1.5"/></>}
          </svg>
        </motion.div>
      ))}

      {/* Línea de scan horizontal ambiental */}
      <motion.div className="pointer-events-none absolute left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,225,255,0.04), transparent)' }}
        animate={{ top: ['5%', '95%'] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'linear', repeatDelay: 5 }} />

      <AnimatePresence mode="wait">

        {/* ── FASE LOGO: Reactor holográfico a tamaño completo ── */}
        {phase === 'logo' && (
          <motion.div key="logo"
            initial={{ opacity: 0, scale: 0.82, filter: 'blur(18px)' }}
            animate={{ opacity: 1, scale: 1,    filter: 'blur(0px)' }}
            exit={{    opacity: 0, scale: 1.08,  filter: 'blur(12px)' }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-8"
          >
            {/* Reactor */}
            <div className="relative flex items-center justify-center">
              {/* Resplandor ambiental detrás del reactor */}
              <motion.div className="pointer-events-none absolute rounded-full"
                style={{ width: 360, height: 360,
                  background: 'radial-gradient(circle, rgba(0,135,255,0.14) 0%, rgba(0,225,255,0.06) 45%, transparent 70%)',
                  filter: 'blur(28px)' }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />

              <Avatar size={300} active={false} responding={false} />
            </div>

            {/* Texto */}
            <motion.div className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <h1 className="font-display text-4xl font-black tracking-[0.2em] text-white glow-white">
                J.A.R.B.E.E.R.
              </h1>
              <p className="font-mono text-[10px] tracking-[0.45em] uppercase"
                style={{ color: 'rgba(0,225,255,0.55)' }}>
                Intelligent Brewery OS
              </p>
              {/* Badge versión */}
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
                className="mt-1 rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-widest"
                style={{ background: 'rgba(255,170,0,0.08)', border: '1px solid rgba(255,170,0,0.2)', color: '#FFAA00' }}>
                {APP_VERSION}
              </motion.span>
            </motion.div>
          </motion.div>
        )}

        {/* ── FASE INIT: Secuencia de arranque ── */}
        {phase === 'init' && (
          <motion.div key="init"
            initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18, filter: 'blur(5px)' }} transition={{ duration: 0.45 }}
            className="flex w-full max-w-xs flex-col items-center px-6"
          >
            {/* Avatar pequeño persistente durante la carga */}
            <motion.div className="mb-5" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <Avatar size={100} active />
            </motion.div>

            <div className="mb-1 font-display text-lg font-bold tracking-[0.15em] text-white">J.A.R.B.E.E.R.</div>
            <p className="mb-6 font-mono text-[9px] tracking-[0.35em] uppercase" style={{ color: 'rgba(74,96,112,0.6)' }}>
              Inicializando sistema
            </p>

            <div className="w-full space-y-3">
              {bootSequence.map((item, idx) => {
                const checked = step > idx;
                const active  = step === idx;
                return (
                  <motion.div key={item.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: step >= idx ? 1 : 0.18, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300"
                      style={{
                        background: checked ? 'rgba(0,225,255,0.09)' : active ? 'rgba(255,170,0,0.09)' : 'rgba(13,24,36,0.6)',
                        border: checked ? '1px solid rgba(0,225,255,0.28)' : active ? '1px solid rgba(255,170,0,0.38)' : '1px solid rgba(255,255,255,0.06)',
                      }}>
                      {checked
                        ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                            <Check size={12} style={{ color: '#00e1ff' }} strokeWidth={3} />
                          </motion.div>
                        : active
                        ? <motion.div className="h-3 w-3 rounded-full border-2"
                            style={{ borderColor: '#FFAA00', borderTopColor: 'transparent' }}
                            animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }} />
                        : <span className="font-mono text-xs" style={{ color: 'rgba(74,96,112,0.45)' }}>{item.icon}</span>
                      }
                    </div>
                    <span className="flex-1 font-mono text-sm tracking-wider transition-colors duration-300"
                      style={{ color: checked ? '#e8f0f8' : active ? '#ffffff' : 'rgba(74,96,112,0.55)' }}>
                      {item.label}
                    </span>
                    {checked && (
                      <span className="font-mono text-[9px] tracking-widest" style={{ color: item.color, opacity: 0.7 }}>OK</span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 h-px w-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div className="h-full" style={{ background: 'linear-gradient(90deg, #0087ff, #00e1ff)' }}
                initial={{ width: '0%' }}
                animate={{ width: `${(step / bootSequence.length) * 100}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }} />
            </div>
          </motion.div>
        )}

        {/* ── FASE GREETING ── */}
        {phase === 'greeting' && (
          <motion.div key="greeting"
            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-6 px-8 text-center"
          >
            {/* Avatar mediano con estado activo */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <Avatar size={200} active responding />
            </motion.div>

            <div className="flex flex-col items-center gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.38em]" style={{ color: '#34d399' }}>
                Sistema preparado · {APP_VERSION}
              </p>
              <motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="font-display text-5xl font-black text-white glow-white">
                {greeting},
              </motion.h2>
              <motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
                className="font-display text-5xl font-black glow-amber" style={{ color: '#FFAA00' }}>
                {USER_NAME}.
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.72 }}
                className="mt-2 font-mono text-sm" style={{ color: 'rgba(0,225,255,0.75)' }}>
                Lote activo: <span style={{ color: '#00e1ff', fontWeight: 500 }}>Golden Ale 26-017</span>
              </motion.p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.3em] uppercase"
        style={{ color: 'rgba(42,61,82,0.7)' }}>
        {APP_VERSION} · PROTOTYPE ONE
      </div>
    </motion.div>
  );
}
