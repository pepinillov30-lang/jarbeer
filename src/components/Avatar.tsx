import { useId } from 'react';
import { motion } from 'framer-motion';

interface AvatarProps {
  size?: number;
  active?: boolean;
  responding?: boolean;
}

export function Avatar({ size = 260, active = false, responding = false }: AvatarProps) {
  const id = useId().replace(/:/g, '');
  const cx = size / 2;
  const cy = size / 2;

  const coreRadius = size * 0.32;
  const r1 = size * 0.45;
  const r2 = size * 0.38;
  const r3 = size * 0.52;

  const baseHue = responding ? '#FFAA00' : active ? '#00e1ff' : '#0087ff';
  const glowRgb = responding ? '255,170,0' : active ? '0,225,255' : '0,135,255';
  const glowIntensity = responding ? 0.8 : active ? 0.65 : 0.35;
  const breathDuration = responding ? 1.2 : active ? 2.0 : 5.5;

  return (
    <div
      className="relative select-none"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* ── Outer ambient halo ── */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(${glowRgb},${glowIntensity * 0.25}) 0%, rgba(${glowRgb},0.05) 50%, transparent 75%)`,
          filter: `blur(${size * 0.12}px)`,
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: breathDuration, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── SVG: rings, equator, particles ── */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Core radial gradient */}
          <radialGradient id={`${id}-core`} cx="50%" cy="50%">
            <stop offset="0%"   stopColor={baseHue} stopOpacity="0.18" />
            <stop offset="60%"  stopColor={baseHue} stopOpacity="0.06" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Image clip */}
          <clipPath id={`${id}-clip`}>
            <circle cx={cx} cy={cy} r={coreRadius} />
          </clipPath>

          {/* Glow filter */}
          <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Subtle inner border gradient */}
          <radialGradient id={`${id}-border`} cx="50%" cy="50%">
            <stop offset="80%"  stopColor="transparent" />
            <stop offset="100%" stopColor={`rgba(${glowRgb},0.6)`} />
          </radialGradient>
        </defs>

        {/* Background corona */}
        <motion.circle
          cx={cx} cy={cy} r={coreRadius + 4}
          fill={`url(#${id}-core)`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: breathDuration, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Ring 3 — outermost, very slow */}
        <motion.circle
          cx={cx} cy={cy} r={r3}
          fill="none"
          stroke={`rgba(${glowRgb},0.1)`}
          strokeWidth="1"
          strokeDasharray="6 14"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Ring 1 — mid outer, slow */}
        <motion.circle
          cx={cx} cy={cy} r={r1}
          fill="none"
          stroke={`rgba(${glowRgb},0.22)`}
          strokeWidth="1.2"
          strokeDasharray="5 10"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        {/* Ring 1 orbiting dot */}
        <motion.circle
          cx={cx} cy={cy - r1} r={4}
          fill={baseHue}
          style={{ filter: `drop-shadow(0 0 8px ${baseHue})`, transformOrigin: `${cx}px ${cy}px` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        />

        {/* Ring 2 — reverse, mid */}
        <motion.circle
          cx={cx} cy={cy} r={r2}
          fill="none"
          stroke={`rgba(${glowRgb},0.15)`}
          strokeWidth="1"
          strokeDasharray="3 8"
          animate={{ rotate: -360 }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        {/* Ring 2 orbiting dot */}
        <motion.circle
          cx={cx} cy={cy + r2} r={3}
          fill={`rgba(${glowRgb},0.85)`}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          animate={{ rotate: -360 }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        />

        {/* Equator belt */}
        <motion.ellipse
          cx={cx} cy={cy} rx={coreRadius} ry={coreRadius * 0.22}
          fill="none"
          stroke={`rgba(${glowRgb},0.2)`}
          strokeWidth="1"
          strokeDasharray="4 6"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Core face image */}
        <motion.image
          href="/avatar.png"
          x={cx - coreRadius}
          y={cy - coreRadius}
          width={coreRadius * 2}
          height={coreRadius * 2}
          clipPath={`url(#${id}-clip)`}
          preserveAspectRatio="xMidYMid slice"
          animate={{ opacity: [0.88, 1, 0.88] }}
          transition={{ duration: breathDuration, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: `drop-shadow(0 0 12px rgba(${glowRgb},0.5))` }}
        />

        {/* Inner border glow ring */}
        <motion.circle
          cx={cx} cy={cy} r={coreRadius}
          fill="none"
          stroke={`rgba(${glowRgb},${responding ? 0.7 : active ? 0.55 : 0.3})`}
          strokeWidth="1.5"
          filter={`url(#${id}-glow)`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: breathDuration * 0.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Scan line inside core */}
        <motion.line
          x1={cx - coreRadius * 0.85} y1={cy}
          x2={cx + coreRadius * 0.85} y2={cy}
          stroke={`rgba(${glowRgb},0.45)`}
          strokeWidth="0.8"
          animate={{
            y: [cy - coreRadius * 0.75, cy + coreRadius * 0.75, cy - coreRadius * 0.75],
            opacity: [0, 0.8, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          clipPath={`url(#${id}-clip)`}
        />

        {/* Data readout ticks around core */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = cx + Math.cos(rad) * (coreRadius + 1);
          const y1 = cy + Math.sin(rad) * (coreRadius + 1);
          const x2 = cx + Math.cos(rad) * (coreRadius + 8);
          const y2 = cy + Math.sin(rad) * (coreRadius + 8);
          return (
            <motion.line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={`rgba(${glowRgb},0.5)`}
              strokeWidth="1.5"
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
            />
          );
        })}
      </svg>

      {/* ── Floating particles ── */}
      {[...Array(8)].map((_, i) => (
        <AvatarParticle key={i} index={i} size={size} glowRgb={glowRgb} baseHue={baseHue} />
      ))}

      {/* ── Active pulse rings ── */}
      {(active || responding) &&
        [0, 0.6, 1.2].map((delay) => (
          <motion.div
            key={delay}
            className="absolute inset-0 rounded-full"
            style={{
              border: `1px solid rgba(${glowRgb},0.4)`,
            }}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay }}
          />
        ))}
    </div>
  );
}

function AvatarParticle({
  index,
  size,
  glowRgb,
  baseHue,
}: {
  index: number;
  size: number;
  glowRgb: string;
  baseHue: string;
}) {
  const angle = (index / 8) * Math.PI * 2;
  const orbitRadius = size * (0.38 + (index % 3) * 0.06);
  const px = size / 2 + Math.cos(angle) * orbitRadius - 3;
  const py = size / 2 + Math.sin(angle) * orbitRadius - 3;
  const dur = 2.8 + index * 0.55;
  const pSize = index % 2 === 0 ? 5 : 3;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: px,
        top: py,
        width: pSize,
        height: pSize,
        background: baseHue,
        boxShadow: `0 0 ${pSize * 2}px rgba(${glowRgb},0.9)`,
      }}
      animate={{
        opacity: [0.05, 0.95, 0.05],
        scale: [0.4, 1.3, 0.4],
        x: [0, Math.cos(angle + 1.2) * 10, 0],
        y: [0, Math.sin(angle + 1.2) * 8, 0],
      }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay: index * 0.35 }}
    />
  );
}
