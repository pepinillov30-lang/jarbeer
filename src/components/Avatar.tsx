import { useId } from 'react';
import { motion } from 'framer-motion';

interface AvatarProps {
  size?: number;
  active?: boolean;
  responding?: boolean;
}

export function Avatar({ size = 180, active = false, responding = false }: AvatarProps) {
  const id = useId().replace(/:/g, '');
  const center = size / 2;
  const r1 = size * 0.47;
  const r2 = size * 0.40;
  const r3 = size * 0.33;

  const glowColor = responding
    ? 'rgba(250,106,0,'
    : active
    ? 'rgba(0,225,255,'
    : 'rgba(0,135,255,';

  return (
    <div
      className="relative select-none"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* ---- Outer ambient glow ---- */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${glowColor}0.18) 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: responding ? 1.5 : 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ---- SVG ring system ---- */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id={`${id}-grd`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={responding ? '#FA6A00' : active ? '#00e1ff' : '#0087ff'} stopOpacity="0.25" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id={`${id}-blur`}>
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Base circle fill */}
        <motion.circle
          cx={center} cy={center} r={r3 * 0.85}
          fill={`url(#${id}-grd)`}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Ring 1 — outer, slow */}
        <motion.circle
          cx={center} cy={center} r={r1}
          fill="none"
          stroke={responding ? 'rgba(250,106,0,0.35)' : 'rgba(0,225,255,0.22)'}
          strokeWidth="1"
          strokeDasharray="4 8"
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />
        {/* Ring 1 dot */}
        <motion.circle
          cx={center} cy={center - r1} r="3.5"
          fill={responding ? '#FA6A00' : '#00e1ff'}
          style={{
            filter: `drop-shadow(0 0 6px ${responding ? '#FA6A00' : '#00e1ff'})`,
            transformOrigin: `${center}px ${center}px`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        />

        {/* Ring 2 — mid, opposite */}
        <motion.circle
          cx={center} cy={center} r={r2}
          fill="none"
          stroke={responding ? 'rgba(250,106,0,0.25)' : 'rgba(0,135,255,0.18)'}
          strokeWidth="1"
          strokeDasharray="2 6"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />
        {/* Ring 2 dot */}
        <motion.circle
          cx={center} cy={center + r2} r="2.5"
          fill={responding ? 'rgba(250,106,0,0.9)' : 'rgba(0,135,255,0.9)'}
          style={{ transformOrigin: `${center}px ${center}px` }}
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />

        {/* Ring 3 — inner glow ring */}
        <motion.circle
          cx={center} cy={center} r={r3}
          fill="none"
          stroke={responding ? 'rgba(250,106,0,0.4)' : active ? 'rgba(0,225,255,0.35)' : 'rgba(0,135,255,0.18)'}
          strokeWidth="1.5"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Equator line — holographic belt */}
        <motion.ellipse
          cx={center} cy={center} rx={r3} ry={r3 * 0.25}
          fill="none"
          stroke={responding ? 'rgba(250,106,0,0.3)' : 'rgba(0,225,255,0.18)'}
          strokeWidth="1"
          strokeDasharray="3 5"
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Scan line inside */}
        <motion.line
          x1={center - r3 * 0.8} y1={center}
          x2={center + r3 * 0.8} y2={center}
          stroke={responding ? 'rgba(250,106,0,0.5)' : 'rgba(0,225,255,0.4)'}
          strokeWidth="0.8"
          animate={{ y: [center - r3 * 0.8, center + r3 * 0.8, center - r3 * 0.8], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />
      </svg>

      {/* ---- Floating bottle ---- */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <HolographicBottle size={size * 0.48} active={active} responding={responding} />
      </motion.div>

      {/* ---- Active pulse rings ---- */}
      {(active || responding) &&
        [0, 0.55, 1.1].map((d) => (
          <motion.div
            key={d}
            className="absolute inset-0 rounded-full"
            style={{
              border: `1px solid ${responding ? 'rgba(250,106,0,0.5)' : 'rgba(0,225,255,0.4)'}`,
            }}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.7, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: d }}
          />
        ))}

      {/* ---- Floating particles ---- */}
      {[...Array(6)].map((_, i) => (
        <Particle key={i} index={i} size={size} responding={responding} />
      ))}
    </div>
  );
}

function Particle({ index, size, responding }: { index: number; size: number; responding: boolean }) {
  const angle = (index / 6) * Math.PI * 2;
  const radius = size * (0.28 + (index % 3) * 0.07);
  const x = size / 2 + Math.cos(angle) * radius - 3;
  const y = size / 2 + Math.sin(angle) * radius - 3;
  const dur = 3 + index * 0.7;

  return (
    <motion.div
      className="absolute h-1.5 w-1.5 rounded-full"
      style={{
        left: x,
        top: y,
        background: responding ? '#FA6A00' : '#00e1ff',
        boxShadow: responding
          ? '0 0 6px rgba(250,106,0,0.8)'
          : '0 0 6px rgba(0,225,255,0.8)',
      }}
      animate={{
        opacity: [0.1, 0.9, 0.1],
        scale: [0.5, 1.2, 0.5],
        x: [0, Math.cos(angle + 1) * 8, 0],
        y: [0, Math.sin(angle + 1) * 6, 0],
      }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function HolographicBottle({
  size,
  active,
  responding,
}: {
  size: number;
  active: boolean;
  responding: boolean;
}) {
  const w = size;
  const h = size * 1.6;
  const capColor = responding ? '#FA6A00' : active ? '#00e1ff' : '#0087ff';
  const glassOpacity = responding ? 0.35 : active ? 0.3 : 0.18;
  const strokeOpacity = responding ? 0.9 : active ? 0.8 : 0.55;
  const liquidColor = responding ? 'rgba(250,106,0,' : 'rgba(255,184,0,';

  return (
    <svg width={w} height={h} viewBox="0 0 100 160" fill="none">
      <defs>
        <linearGradient id="hb-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`rgba(0,225,255,${glassOpacity + 0.1})`} />
          <stop offset="50%" stopColor={`rgba(0,135,255,${glassOpacity})`} />
          <stop offset="100%" stopColor={`rgba(0,30,60,${glassOpacity + 0.1})`} />
        </linearGradient>
        <linearGradient id="hb-cap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={capColor} />
          <stop offset="100%" stopColor={capColor} stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="hb-liq" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`${liquidColor}0.45)`} />
          <stop offset="100%" stopColor={`${liquidColor}0.75)`} />
        </linearGradient>
        <filter id="hb-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Cap */}
      <rect x="38" y="4" width="24" height="15" rx="4"
        fill="url(#hb-cap)"
        filter="url(#hb-glow)" />
      <rect x="35" y="16" width="30" height="8" rx="3"
        fill="url(#hb-cap)" opacity="0.8" />

      {/* Bottle body */}
      <path
        d="M40 24 L40 42 Q40 48 37 52 L32 64 Q30 70 30 78 L30 130 Q30 146 50 146 Q70 146 70 130 L70 78 Q70 70 68 64 L63 52 Q60 48 60 42 L60 24 Z"
        fill="url(#hb-body)"
        stroke={`rgba(0,225,255,${strokeOpacity})`}
        strokeWidth="1.5"
        filter="url(#hb-glow)"
      />

      {/* Liquid */}
      <motion.path
        d="M33 80 Q50 75 67 80 L67 130 Q67 143 50 143 Q33 143 33 130 Z"
        fill="url(#hb-liq)"
        animate={{ opacity: [0.65, 0.95, 0.65] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Liquid surface shimmer */}
      <motion.ellipse
        cx="50" cy="80" rx="17" ry="3.5"
        fill={`${liquidColor}0.4)`}
        animate={{ scaleX: [1, 1.05, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />

      {/* Highlight streak */}
      <rect x="36" y="65" width="4" height="60" rx="2"
        fill="rgba(255,255,255,0.12)" />
      <rect x="42" y="42" width="3" height="22" rx="1.5"
        fill="rgba(255,255,255,0.08)" />

      {/* Label panel */}
      <rect x="34" y="90" width="32" height="32" rx="3"
        fill="rgba(5,6,8,0.7)"
        stroke={`rgba(0,225,255,${strokeOpacity * 0.6})`}
        strokeWidth="0.8" />
      <text
        x="50" y="107"
        textAnchor="middle"
        fontSize="8.5"
        fontFamily="Orbitron, sans-serif"
        fontWeight="700"
        fill={active || responding ? capColor : 'rgba(0,225,255,0.7)'}
      >
        JAR
      </text>
      <text
        x="50" y="117"
        textAnchor="middle"
        fontSize="5"
        fontFamily="JetBrains Mono, monospace"
        fill="rgba(255,255,255,0.35)"
      >
        BEER OS
      </text>

      {/* Data dots */}
      {(active || responding) && (
        <>
          <motion.circle cx="26" cy="75" r="2"
            fill={responding ? '#FA6A00' : '#00e1ff'}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <motion.circle cx="74" cy="100" r="1.5"
            fill={responding ? '#FA6A00' : '#00e1ff'}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
          />
          <motion.circle cx="26" cy="120" r="1.5"
            fill={responding ? '#FA6A00' : '#00e1ff'}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 1.2 }}
          />
        </>
      )}
    </svg>
  );
}
