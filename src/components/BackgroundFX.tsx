import { motion } from 'framer-motion';

export function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Deep space base */}
      <div className="absolute inset-0 bg-ink-950" />

      {/* Brewery laboratory SVG — desenfocado, muy sutil */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.055, filter: 'blur(1.5px)' }}
      >
        {/* Fermentadores cilíndricos */}
        <rect x="60" y="180" width="80" height="240" rx="8" fill="none" stroke="#8ab4cc" strokeWidth="2" />
        <rect x="68" y="210" width="64" height="180" rx="4" fill="rgba(138,180,204,0.12)" />
        <ellipse cx="100" cy="180" rx="40" ry="10" fill="none" stroke="#8ab4cc" strokeWidth="2" />
        <ellipse cx="100" cy="420" rx="40" ry="10" fill="none" stroke="#8ab4cc" strokeWidth="2" />
        <rect x="96" y="420" width="8" height="30" fill="#8ab4cc" />
        <rect x="86" y="448" width="28" height="6" rx="2" fill="#8ab4cc" />

        <rect x="180" y="150" width="90" height="280" rx="8" fill="none" stroke="#8ab4cc" strokeWidth="2" />
        <rect x="188" y="180" width="74" height="220" rx="4" fill="rgba(138,180,204,0.10)" />
        <ellipse cx="225" cy="150" rx="45" ry="11" fill="none" stroke="#8ab4cc" strokeWidth="2" />
        <ellipse cx="225" cy="430" rx="45" ry="11" fill="none" stroke="#8ab4cc" strokeWidth="2" />
        <rect x="221" y="430" width="8" height="35" fill="#8ab4cc" />

        {/* Tuberías */}
        <path d="M140 300 Q160 300 160 280 Q160 260 180 260" fill="none" stroke="#8ab4cc" strokeWidth="1.5" />
        <path d="M270 300 Q310 300 310 280" fill="none" stroke="#8ab4cc" strokeWidth="1.5" />
        <path d="M310 280 Q340 280 340 260 L340 200 Q340 180 360 180 L800 180" fill="none" stroke="#8ab4cc" strokeWidth="1.5" />

        {/* Manómetros */}
        <circle cx="100" cy="260" r="12" fill="none" stroke="#8ab4cc" strokeWidth="1.5" />
        <line x1="100" y1="260" x2="108" y2="255" stroke="#8ab4cc" strokeWidth="1.5" />
        <circle cx="225" cy="240" r="14" fill="none" stroke="#8ab4cc" strokeWidth="1.5" />
        <line x1="225" y1="240" x2="234" y2="234" stroke="#8ab4cc" strokeWidth="1.5" />

        {/* Panel de control derecha */}
        <rect x="620" y="200" width="140" height="180" rx="6" fill="none" stroke="#8ab4cc" strokeWidth="1.5" />
        <rect x="630" y="210" width="50" height="30" rx="3" fill="rgba(0,225,255,0.08)" stroke="#00e1ff" strokeWidth="1" />
        <rect x="630" y="250" width="50" height="30" rx="3" fill="rgba(0,225,255,0.06)" stroke="#8ab4cc" strokeWidth="1" />
        <rect x="690" y="210" width="60" height="70" rx="3" fill="rgba(138,180,204,0.08)" stroke="#8ab4cc" strokeWidth="1" />
        {[0,1,2,3,4,5].map(i => (
          <circle key={i} cx={640 + i * 10} cy={295} r="4" fill="rgba(0,225,255,0.15)" stroke="#8ab4cc" strokeWidth="1" />
        ))}

        {/* Vapor / steam */}
        <path d="M100 178 Q95 160 102 145 Q109 130 104 115" fill="none" stroke="#8ab4cc" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
        <path d="M225 148 Q218 128 226 112 Q234 96 228 80" fill="none" stroke="#8ab4cc" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />

        {/* Acero reflejos horizontales */}
        <line x1="0" y1="500" x2="800" y2="500" stroke="#8ab4cc" strokeWidth="1" opacity="0.4" />
        <line x1="0" y1="520" x2="800" y2="520" stroke="#8ab4cc" strokeWidth="0.5" opacity="0.2" />
      </svg>

      {/* Central reactor glow — azul eléctrico */}
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(0,135,255,0.07) 0%, transparent 65%)',
          borderRadius: '50%',
        }}
      />

      {/* Bottom fade para vignette */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48"
        style={{ background: 'linear-gradient(to top, rgba(2,4,8,0.9) 0%, transparent 100%)' }}
      />

      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-24"
        style={{ background: 'linear-gradient(to bottom, rgba(2,4,8,0.7) 0%, transparent 100%)' }}
      />

      {/* Floating ambient orbs */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          top: '15%',
          left: '5%',
          background: 'radial-gradient(circle, rgba(0,225,255,0.04) 0%, transparent 70%)',
        }}
        animate={{ x: [0, 20, 0], y: [0, -15, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 250,
          height: 250,
          bottom: '20%',
          right: '8%',
          background: 'radial-gradient(circle, rgba(255,170,0,0.03) 0%, transparent 70%)',
        }}
        animate={{ x: [0, -15, 0], y: [0, 12, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Scan line subtle */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,225,255,0.04), transparent)' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 6 }}
      />
    </div>
  );
}
