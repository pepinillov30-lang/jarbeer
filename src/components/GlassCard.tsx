import { motion } from 'framer-motion';
import type { ReactNode, CSSProperties } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  delay?: number;
  style?: CSSProperties;
  orange?: boolean;
}

export function GlassCard({
  children,
  className = '',
  hover = false,
  onClick,
  delay = 0,
  style,
  orange = false,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
      className={`${orange ? 'glass-orange' : 'glass'} hud ${orange ? 'hud-orange' : ''} rounded-2xl shadow-panel ${hover ? 'cursor-pointer' : ''} ${className}`}
      style={style}
    >
      {children}
    </motion.div>
  );
}
