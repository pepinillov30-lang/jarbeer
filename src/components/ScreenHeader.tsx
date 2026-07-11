import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onBack?: () => void;
}

export function ScreenHeader({ title, subtitle, right, onBack }: ScreenHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-3 px-4 pb-3 pt-[max(env(safe-area-inset-top),16px)]"
    >
      {onBack && (
        <button
          onClick={onBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
          aria-label="Volver"
        >
          <ChevronLeft size={18} className="text-ink-400" />
        </button>
      )}

      <div className="min-w-0 flex-1">
        <h2 className="truncate font-display text-lg font-bold tracking-wide text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="truncate font-mono text-[11px] text-ink-500">{subtitle}</p>
        )}
      </div>

      {right && <div className="shrink-0">{right}</div>}
    </motion.div>
  );
}
