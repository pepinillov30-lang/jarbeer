import { motion } from 'framer-motion';
import { FlaskConical, Library, MessageSquare, Home } from 'lucide-react';
import type { Screen } from '../data/mockData';
import { playSound } from '../lib/sound';

const NAV_ITEMS: { id: Screen; label: string; Icon: typeof Home }[] = [
  { id: 'home',       label: 'Sistema',     Icon: Home },
  { id: 'production', label: 'Producción',  Icon: FlaskConical },
  { id: 'documents',  label: 'Documentos',  Icon: Library },
  { id: 'assistant',  label: 'Asistente',   Icon: MessageSquare },
];

interface BottomNavProps {
  active: Screen;
  onNavigate: (s: Screen) => void;
  soundEnabled?: boolean;
}

export function BottomNav({ active, onNavigate, soundEnabled = false }: BottomNavProps) {
  return (
    <div
      className="relative z-20 shrink-0"
      style={{
        background: 'rgba(4, 8, 14, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-1/4 right-1/4 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,225,255,0.3), transparent)' }}
      />

      <div className="flex items-stretch">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => {
                if (id !== active) {
                  playSound('navigate', soundEnabled);
                  onNavigate(id);
                }
              }}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 py-3 transition-all duration-200"
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 left-2 right-2 h-0.5 rounded-b-full"
                  style={{ background: 'linear-gradient(90deg, transparent, #00e1ff, transparent)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2 : 1.5}
                  style={{
                    color: isActive ? '#00e1ff' : 'rgba(100,128,150,0.7)',
                    filter: isActive ? 'drop-shadow(0 0 6px rgba(0,225,255,0.6))' : 'none',
                    transition: 'color 0.2s, filter 0.2s',
                  }}
                />
              </motion.div>

              <span
                className="font-mono text-[9px] tracking-widest uppercase"
                style={{
                  color: isActive ? '#00e1ff' : 'rgba(74,96,112,0.8)',
                  transition: 'color 0.2s',
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
