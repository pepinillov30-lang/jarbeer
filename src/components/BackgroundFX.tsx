import { motion } from 'framer-motion';

export function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0" style={{ background:'#020408' }}/>
      {/* Brewery/lab blueprint SVG */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity:0.045, filter:'blur(0.5px)' }}>
        {/* Fermentation tanks */}
        <rect x="60"  y="180" width="80"  height="240" rx="8" fill="none" stroke="#8ab4cc" strokeWidth="2"/>
        <ellipse cx="100" cy="180" rx="40" ry="10" fill="none" stroke="#8ab4cc" strokeWidth="2"/>
        <rect x="180" y="150" width="90"  height="280" rx="8" fill="none" stroke="#8ab4cc" strokeWidth="2"/>
        <ellipse cx="225" cy="150" rx="45" ry="11" fill="none" stroke="#8ab4cc" strokeWidth="2"/>
        <rect x="310" y="200" width="70"  height="200" rx="8" fill="none" stroke="#8ab4cc" strokeWidth="1.5"/>
        <ellipse cx="345" cy="200" rx="35" ry="9" fill="none" stroke="#8ab4cc" strokeWidth="1.5"/>
        {/* Pipes */}
        <path d="M140 300 Q160 280 180 260" fill="none" stroke="#8ab4cc" strokeWidth="1.5"/>
        <path d="M270 300 Q340 260 340 200 Q340 180 360 180 L800 180" fill="none" stroke="#8ab4cc" strokeWidth="1.5"/>
        <path d="M380 280 Q420 260 450 260 L800 260" fill="none" stroke="#8ab4cc" strokeWidth="1.2"/>
        <path d="M100 420 L100 480 Q100 500 120 500 L700 500" fill="none" stroke="#8ab4cc" strokeWidth="1.5"/>
        <path d="M225 430 L225 500" fill="none" stroke="#8ab4cc" strokeWidth="1.2"/>
        <path d="M345 400 L345 500" fill="none" stroke="#8ab4cc" strokeWidth="1"/>
        {/* Valves */}
        <circle cx="100" cy="260" r="12" fill="none" stroke="#8ab4cc" strokeWidth="1.5"/>
        <line x1="88" y1="260" x2="112" y2="260" stroke="#8ab4cc" strokeWidth="1.5"/>
        <circle cx="225" cy="240" r="14" fill="none" stroke="#8ab4cc" strokeWidth="1.5"/>
        <line x1="211" y1="240" x2="239" y2="240" stroke="#8ab4cc" strokeWidth="1.5"/>
        <circle cx="345" cy="300" r="10" fill="none" stroke="#8ab4cc" strokeWidth="1.2"/>
        {/* Control panel */}
        <rect x="580" y="160" width="180" height="240" rx="6" fill="none" stroke="#8ab4cc" strokeWidth="1.5"/>
        <rect x="590" y="170" width="70"  height="40"  rx="3" fill="none" stroke="#00e1ff" strokeWidth="1"/>
        <rect x="590" y="220" width="50"  height="40"  rx="3" fill="none" stroke="#8ab4cc" strokeWidth="0.8"/>
        <rect x="650" y="220" width="50"  height="40"  rx="3" fill="none" stroke="#8ab4cc" strokeWidth="0.8"/>
        <circle cx="610" cy="300" r="18" fill="none" stroke="#8ab4cc" strokeWidth="1.2"/>
        <circle cx="650" cy="300" r="18" fill="none" stroke="#8ab4cc" strokeWidth="1.2"/>
        <circle cx="690" cy="300" r="18" fill="none" stroke="#8ab4cc" strokeWidth="1.2"/>
        {/* Flask / lab bench */}
        <path d="M470 350 L480 420 Q490 440 500 440 Q510 440 520 420 L530 350 Z" fill="none" stroke="#8ab4cc" strokeWidth="1.2"/>
        <line x1="465" y1="355" x2="535" y2="355" stroke="#8ab4cc" strokeWidth="1.2"/>
        {/* Heat coil */}
        <path d="M560 360 Q580 340 600 360 Q620 380 640 360 Q660 340 680 360" fill="none" stroke="#8ab4cc" strokeWidth="1.2"/>
        <path d="M560 375 Q580 355 600 375 Q620 395 640 375 Q660 355 680 375" fill="none" stroke="#8ab4cc" strokeWidth="1"/>
        {/* Floor line */}
        <line x1="0" y1="520" x2="800" y2="520" stroke="#8ab4cc" strokeWidth="1.2" opacity="0.6"/>
        <line x1="0" y1="525" x2="800" y2="525" stroke="#8ab4cc" strokeWidth="0.4" opacity="0.3"/>
        {/* Dimension lines */}
        <line x1="60" y1="140" x2="270" y2="140" stroke="#8ab4cc" strokeWidth="0.7" strokeDasharray="4 4"/>
        <line x1="60" y1="136" x2="60" y2="144" stroke="#8ab4cc" strokeWidth="0.7"/>
        <line x1="270" y1="136" x2="270" y2="144" stroke="#8ab4cc" strokeWidth="0.7"/>
        {/* Labels */}
        <text x="165" y="133" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono,monospace" fill="#8ab4cc" opacity="0.7">SALA DE FERMENTACIÓN</text>
        <text x="669" y="155" textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono,monospace" fill="#00e1ff" opacity="0.6">CONTROL</text>
      </svg>

      {/* Ambient radial glows */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
        style={{ width:700, height:700, background:'radial-gradient(circle, rgba(0,135,255,0.06) 0%, transparent 60%)', borderRadius:'50%' }}/>
      <motion.div className="absolute rounded-full"
        style={{ width:350, height:350, top:'5%', left:'3%', background:'radial-gradient(circle, rgba(0,225,255,0.03) 0%, transparent 70%)' }}
        animate={{x:[0,20,0],y:[0,-14,0],opacity:[0.5,1,0.5]}} transition={{duration:22,repeat:Infinity,ease:'easeInOut'}}/>
      <motion.div className="absolute rounded-full"
        style={{ width:280, height:280, bottom:'12%', right:'4%', background:'radial-gradient(circle, rgba(255,170,0,0.025) 0%, transparent 70%)' }}
        animate={{x:[0,-14,0],y:[0,12,0],opacity:[0.4,0.8,0.4]}} transition={{duration:28,repeat:Infinity,ease:'easeInOut',delay:5}}/>

      {/* Vignettes */}
      <div className="absolute bottom-0 left-0 right-0 h-52" style={{background:'linear-gradient(to top, rgba(2,4,8,0.95) 0%, transparent 100%)'}}/>
      <div className="absolute top-0 left-0 right-0 h-28"  style={{background:'linear-gradient(to bottom, rgba(2,4,8,0.8) 0%, transparent 100%)'}}/>
      <div className="absolute bottom-0 left-0 right-0 top-0 scanlines opacity-30"/>

      {/* Moving scan line */}
      <motion.div className="absolute left-0 right-0 h-px"
        style={{ background:'linear-gradient(90deg,transparent,rgba(0,225,255,0.04),transparent)' }}
        animate={{top:['0%','100%']}} transition={{duration:10,repeat:Infinity,ease:'linear',repeatDelay:8}}/>
    </div>
  );
}
