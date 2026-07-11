import { motion, AnimatePresence } from 'framer-motion';
import { Mic } from 'lucide-react';

export type MicState = 'idle' | 'listening' | 'processing' | 'responding';

interface MicButtonProps {
  state: MicState;
  onPress: () => void;
  size?: 'normal' | 'large';
}

const LABELS: Record<MicState, string> = {
  idle: 'Pulsar para hablar',
  listening: 'Escuchando...',
  processing: 'Procesando...',
  responding: 'Respondiendo...',
};

export function MicButton({ state, onPress, size = 'normal' }: MicButtonProps) {
  const isActive = state !== 'idle';
  const isListening = state === 'listening';
  const isResponding = state === 'responding';

  const btnSize = size === 'large' ? 72 : 56;
  const iconSize = size === 'large' ? 28 : 22;

  const color = isResponding ? '#FFAA00' : isActive ? '#00e1ff' : 'rgba(100,128,150,0.8)';
  const bgColor = isResponding
    ? 'rgba(255,170,0,0.12)'
    : isActive
    ? 'rgba(0,225,255,0.1)'
    : 'rgba(13,24,36,0.8)';
  const borderColor = isResponding
    ? 'rgba(255,170,0,0.5)'
    : isActive
    ? 'rgba(0,225,255,0.4)'
    : 'rgba(255,255,255,0.1)';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center">
        {/* Pulse rings when active */}
        <AnimatePresence>
          {isActive && [0, 0.5, 1.0].map((delay) => (
            <motion.div
              key={delay}
              className="absolute rounded-full"
              style={{
                width: btnSize + 20,
                height: btnSize + 20,
                border: `1px solid ${isResponding ? 'rgba(255,170,0,0.4)' : 'rgba(0,225,255,0.35)'}`,
              }}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay }}
            />
          ))}
        </AnimatePresence>

        {/* Button */}
        <motion.button
          onClick={onPress}
          disabled={isActive}
          whileTap={{ scale: 0.93 }}
          animate={{ scale: isListening ? [1, 1.04, 1] : 1 }}
          transition={isListening ? { duration: 0.8, repeat: Infinity } : { duration: 0.15 }}
          style={{
            width: btnSize,
            height: btnSize,
            background: bgColor,
            border: `1px solid ${borderColor}`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isActive ? 'default' : 'pointer',
            boxShadow: isActive
              ? `0 0 30px ${isResponding ? 'rgba(255,170,0,0.3)' : 'rgba(0,225,255,0.25)'}`
              : 'none',
            transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
          }}
          aria-label={LABELS[state]}
        >
          {state === 'processing' ? (
            <motion.div
              className="h-5 w-5 rounded-full border-2"
              style={{ borderColor: '#00e1ff', borderTopColor: 'transparent' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <Mic
              size={iconSize}
              strokeWidth={1.8}
              style={{
                color,
                filter: isActive ? `drop-shadow(0 0 8px ${color})` : 'none',
                transition: 'color 0.3s, filter 0.3s',
              }}
            />
          )}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.span
          key={state}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: isActive ? color : 'rgba(74,96,112,0.6)' }}
        >
          {LABELS[state]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
