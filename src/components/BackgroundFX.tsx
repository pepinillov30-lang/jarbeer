import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Spawn particles
    for (let i = 0; i < 55; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.update(canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: '#090a0d' }}>
      {/* Brewery scene: SVG layered illustration */}
      <BreweryScene />

      {/* Fine grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,225,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,225,255,0.025) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Coarse grid */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,135,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,135,255,0.04) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
        }}
      />

      {/* Radial depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,135,255,0.1) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 50% 100%, rgba(0,225,255,0.07) 0%, transparent 70%), radial-gradient(ellipse 100% 60% at 50% 50%, rgba(9,10,13,0.65) 30%, transparent 100%)',
        }}
      />

      {/* Floating light orbs */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          top: '-10%',
          left: '-10%',
          background: 'radial-gradient(circle, rgba(0,135,255,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 700,
          height: 700,
          bottom: '-15%',
          right: '-15%',
          background: 'radial-gradient(circle, rgba(0,225,255,0.09) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          top: '40%',
          left: '30%',
          background: 'radial-gradient(circle, rgba(250,106,0,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Particles canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />

      {/* Horizontal scan line */}
      <motion.div
        className="absolute inset-x-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,225,255,0.5) 40%, rgba(0,225,255,0.8) 50%, rgba(0,225,255,0.5) 60%, transparent)',
        }}
        animate={{ y: ['0vh', '100vh'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
      />
    </div>
  );
}

class Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: string;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.r = Math.random() * 1.4 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.25;
    const palette = [
      `rgba(0,225,255,${(Math.random() * 0.4 + 0.1).toFixed(2)})`,
      `rgba(0,135,255,${(Math.random() * 0.3 + 0.1).toFixed(2)})`,
      `rgba(255,255,255,${(Math.random() * 0.15 + 0.05).toFixed(2)})`,
    ];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }

  update(w: number, h: number) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = w;
    if (this.x > w) this.x = 0;
    if (this.y < 0) this.y = h;
    if (this.y > h) this.y = 0;
  }
}

function BreweryScene() {
  return (
    <div className="absolute inset-0 opacity-[0.07]" aria-hidden>
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMax slice"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fermentation tank left */}
        <ellipse cx="160" cy="420" rx="70" ry="25" fill="rgba(180,200,220,0.6)" />
        <rect x="90" y="200" width="140" height="220" rx="70" fill="rgba(160,190,215,0.4)" />
        <ellipse cx="160" cy="200" rx="70" ry="25" fill="rgba(200,220,235,0.6)" />
        <line x1="160" y1="175" x2="160" y2="140" stroke="rgba(200,220,235,0.5)" strokeWidth="8" />
        <ellipse cx="160" cy="135" rx="22" ry="8" fill="rgba(200,220,235,0.5)" />
        {/* Pipes */}
        <path d="M230 380 Q330 380 330 300 Q330 220 430 220" stroke="rgba(180,200,215,0.4)" strokeWidth="10" fill="none" />

        {/* Brew kettle center-left */}
        <ellipse cx="430" cy="460" rx="90" ry="30" fill="rgba(170,195,215,0.5)" />
        <rect x="340" y="220" width="180" height="240" rx="90" fill="rgba(150,180,210,0.35)" />
        <ellipse cx="430" cy="220" rx="90" ry="30" fill="rgba(190,210,230,0.5)" />
        {/* Ladder */}
        <line x1="340" y1="250" x2="310" y2="460" stroke="rgba(180,200,215,0.3)" strokeWidth="6" />
        <line x1="310" y1="320" x2="340" y2="320" stroke="rgba(180,200,215,0.3)" strokeWidth="4" />
        <line x1="310" y1="380" x2="340" y2="380" stroke="rgba(180,200,215,0.3)" strokeWidth="4" />
        <line x1="310" y1="430" x2="340" y2="430" stroke="rgba(180,200,215,0.3)" strokeWidth="4" />

        {/* Large tank center-right */}
        <ellipse cx="720" cy="480" rx="110" ry="38" fill="rgba(170,195,215,0.5)" />
        <rect x="610" y="160" width="220" height="320" rx="110" fill="rgba(140,175,210,0.32)" />
        <ellipse cx="720" cy="160" rx="110" ry="38" fill="rgba(190,210,230,0.55)" />
        {/* Dome */}
        <path d="M610 160 Q720 80 830 160" fill="rgba(190,210,230,0.4)" />
        {/* Gauge */}
        <circle cx="780" cy="280" r="18" fill="rgba(200,220,235,0.35)" stroke="rgba(200,220,235,0.4)" strokeWidth="3" />
        {/* Valve */}
        <circle cx="610" cy="380" r="12" fill="rgba(180,200,215,0.4)" />

        {/* Right fermenter */}
        <ellipse cx="1050" cy="430" rx="80" ry="28" fill="rgba(170,195,215,0.5)" />
        <rect x="970" y="200" width="160" height="230" rx="80" fill="rgba(155,185,210,0.35)" />
        <ellipse cx="1050" cy="200" rx="80" ry="28" fill="rgba(190,210,230,0.5)" />
        <line x1="1050" y1="172" x2="1050" y2="130" stroke="rgba(200,220,235,0.4)" strokeWidth="8" />

        {/* Floor pipes */}
        <path d="M90 520 L1150 520" stroke="rgba(160,185,210,0.25)" strokeWidth="12" />
        <path d="M90 540 L1150 540" stroke="rgba(160,185,210,0.15)" strokeWidth="6" />

        {/* Steam wisps */}
        <path d="M160 170 Q175 130 160 90 Q145 50 160 20" stroke="rgba(200,220,235,0.2)" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M430 190 Q450 140 430 100 Q410 60 435 30" stroke="rgba(200,220,235,0.2)" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M700 130 Q720 80 710 40" stroke="rgba(200,220,235,0.15)" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M740 120 Q760 70 750 30" stroke="rgba(200,220,235,0.1)" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* Control panel right */}
        <rect x="930" y="280" width="30" height="120" rx="4" fill="rgba(160,185,210,0.3)" />
        <circle cx="945" cy="300" r="6" fill="rgba(200,220,235,0.5)" />
        <circle cx="945" cy="325" r="6" fill="rgba(200,220,235,0.4)" />
        <rect x="935" y="345" width="20" height="40" rx="3" fill="rgba(180,200,215,0.3)" />

        {/* Instrument rack */}
        <rect x="480" y="490" width="220" height="50" rx="6" fill="rgba(150,180,210,0.25)" />
        <circle cx="510" cy="515" r="12" fill="rgba(180,200,215,0.4)" />
        <circle cx="545" cy="515" r="12" fill="rgba(180,200,215,0.4)" />
        <rect x="575" y="502" width="110" height="26" rx="4" fill="rgba(160,185,210,0.3)" />
      </svg>

      {/* Blur overlay to defocus the scene */}
      <div
        className="absolute inset-0"
        style={{ backdropFilter: 'blur(2px)', background: 'rgba(9,10,13,0.5)' }}
      />
    </div>
  );
}
