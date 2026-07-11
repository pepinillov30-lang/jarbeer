import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export function ScreenHeader({ title, subtitle, right }: ScreenHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-30 px-4 pt-[env(safe-area-inset-top)] pb-3"
    >
      <div
        className="flex items-center gap-3 rounded-2xl px-5 py-3.5"
        style={{
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
      >
        {/* Accent line */}
        <div
          className="h-7 w-0.5 shrink-0 rounded-full"
          style={{ background: 'linear-gradient(180deg, #00e1ff, #0087ff)' }}
        />
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-lg font-bold tracking-wide text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate font-mono text-[11px] text-ink-500">{subtitle}</p>
          )}
        </div>
        {right}
      </div>
    </motion.header>
  );
}
