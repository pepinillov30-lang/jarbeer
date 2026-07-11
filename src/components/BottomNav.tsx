import { motion } from 'framer-motion';
import { Home, FlaskConical, Library, MessageSquare } from 'lucide-react';
import type { Screen } from '../data/mockData';

interface BottomNavProps {
  active: Screen;
  onNavigate: (screen: Screen) => void;
}

const items: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Operaciones', icon: Home },
  { id: 'production', label: 'Producción', icon: FlaskConical },
  { id: 'documents', label: 'Documentos', icon: Library },
  { id: 'assistant', label: 'Asistente', icon: MessageSquare },
];

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),12px)]">
      <div
        className="w-full max-w-lg rounded-2xl px-1.5 py-1.5"
        style={{
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 -4px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <div className="flex items-center">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="relative flex flex-1 flex-col items-center gap-1 py-2.5"
                aria-label={item.label}
              >
                {/* Active background pill */}
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-x-1 inset-y-0 rounded-xl"
                    style={{
                      background: 'rgba(0,225,255,0.06)',
                      border: '1px solid rgba(0,225,255,0.18)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <motion.div
                  animate={{ scale: isActive ? 1.12 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                  style={{
                    color: isActive ? '#00e1ff' : '#434952',
                    filter: isActive ? 'drop-shadow(0 0 6px rgba(0,225,255,0.6))' : 'none',
                  }}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                </motion.div>

                <span
                  className="relative z-10 text-[10px] font-medium tracking-wide"
                  style={{ color: isActive ? 'rgba(0,225,255,0.85)' : '#434952' }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
