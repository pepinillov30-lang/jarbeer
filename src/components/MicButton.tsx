import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2 } from 'lucide-react';

export type MicState = 'idle' | 'listening' | 'processing' | 'responding';

interface MicButtonProps {
  state: MicState;
  onPress: () => void;
  size?: 'normal' | 'large';
}

export function MicButton({ state, onPress, size = 'normal' }: MicButtonProps) {
  const isActive = state !== 'idle';
  const btnSize = size === 'large' ? 'h-24 w-24' : 'h-20 w-20';
  const iconSize = size === 'large' ? 38 : 32;

  const label: Record<MicState, string> = {
    idle: 'Pulsa para hablar',
    listening: 'Escuchando...',
    processing: 'Procesando...',
    responding: 'Respondiendo...',
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className={`relative flex ${size === 'large' ? 'h-40 w-40' : 'h-32 w-32'} items-center justify-center`}>

        {/* Idle ambient pulse */}
        {state === 'idle' && (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: size === 'large' ? 112 : 96,
              height: size === 'large' ? 112 : 96,
              background: 'radial-gradient(circle, rgba(0,135,255,0.12) 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Listening: expanding rings */}
        <AnimatePresence>
          {state === 'listening' && [0, 0.65, 1.3].map((delay) => (
            <motion.div
              key={delay}
              className="absolute rounded-full border-2 border-cyan-400"
              style={{ width: btnSize === 'h-24 w-24' ? 96 : 80, height: btnSize === 'h-24 w-24' ? 96 : 80 }}
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: size === 'large' ? 3.2 : 2.8, opacity: 0 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay }}
            />
          ))}
        </AnimatePresence>

        {/* Responding: orange rings */}
        <AnimatePresence>
          {state === 'responding' && [0, 0.5, 1].map((delay) => (
            <motion.div
              key={delay}
              className="absolute rounded-full border-2"
              style={{
                width: 80, height: 80,
                borderColor: 'rgba(250,106,0,0.6)',
              }}
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 2.8, opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay }}
            />
          ))}
        </AnimatePresence>

        {/* Processing ring */}
        {state === 'processing' && (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: size === 'large' ? 112 : 96,
              height: size === 'large' ? 112 : 96,
              border: '2px solid transparent',
              borderTopColor: '#0087ff',
              borderRightColor: 'rgba(0,135,255,0.3)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Waveform bars (listening) */}
        <AnimatePresence>
          {state === 'listening' && (
            <div className="absolute flex items-end gap-[3px]">
              {[0, 1, 2, 3, 4, 5, 6, 5, 4].map((_, i) => (
                <motion.span
                  key={i}
                  className="w-1 rounded-full bg-cyan-400"
                  initial={{ height: 5 }}
                  animate={{ height: [5, 6 + i * 4, 5] }}
                  transition={{
                    duration: 0.7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.08,
                  }}
                  style={{ boxShadow: '0 0 6px rgba(0,225,255,0.6)' }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Main button */}
        <motion.button
          onClick={onPress}
          disabled={isActive}
          whileHover={!isActive ? { scale: 1.06 } : undefined}
          whileTap={!isActive ? { scale: 0.93 } : undefined}
          className={`relative z-10 flex ${btnSize} items-center justify-center rounded-full transition-all duration-300`}
          style={{
            background:
              state === 'responding'
                ? 'linear-gradient(135deg, rgba(250,106,0,0.25), rgba(180,50,0,0.2))'
                : state === 'listening'
                ? 'linear-gradient(135deg, rgba(0,225,255,0.2), rgba(0,135,255,0.15))'
                : state === 'processing'
                ? 'linear-gradient(135deg, rgba(0,135,255,0.2), rgba(0,87,168,0.15))'
                : 'linear-gradient(135deg, rgba(0,135,255,0.15), rgba(0,57,124,0.1))',
            border:
              state === 'responding'
                ? '1px solid rgba(250,106,0,0.5)'
                : state === 'listening'
                ? '1px solid rgba(0,225,255,0.55)'
                : '1px solid rgba(0,135,255,0.3)',
            boxShadow:
              state === 'responding'
                ? '0 0 25px rgba(250,106,0,0.4), 0 0 60px rgba(250,106,0,0.15), inset 0 0 20px rgba(250,106,0,0.05)'
                : state === 'listening'
                ? '0 0 25px rgba(0,225,255,0.4), 0 0 60px rgba(0,225,255,0.15), inset 0 0 20px rgba(0,225,255,0.05)'
                : '0 0 15px rgba(0,135,255,0.2)',
          }}
          aria-label="Activar micrófono"
        >
          <AnimatePresence mode="wait">
            {state === 'processing' ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
              >
                <Loader2
                  size={iconSize}
                  className="animate-spin text-electric-300"
                />
              </motion.div>
            ) : (
              <motion.div
                key="mic"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
              >
                <Mic
                  size={iconSize}
                  className={
                    state === 'responding'
                      ? 'text-orange-400'
                      : state === 'listening'
                      ? 'text-cyan-300'
                      : 'text-electric-300'
                  }
                  style={
                    state === 'listening'
                      ? { filter: 'drop-shadow(0 0 8px rgba(0,225,255,0.8))' }
                      : state === 'responding'
                      ? { filter: 'drop-shadow(0 0 8px rgba(250,106,0,0.8))' }
                      : undefined
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Status label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
          exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <p
            className={`font-mono text-xs tracking-[0.25em] uppercase ${
              state === 'listening'
                ? 'text-cyan-300'
                : state === 'processing'
                ? 'text-electric-300'
                : state === 'responding'
                ? 'text-orange-400'
                : 'text-ink-500'
            }`}
            style={
              state !== 'idle'
                ? {
                    textShadow:
                      state === 'responding'
                        ? '0 0 10px rgba(250,106,0,0.7)'
                        : '0 0 10px rgba(0,225,255,0.7)',
                  }
                : undefined
            }
          >
            {label[state]}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
