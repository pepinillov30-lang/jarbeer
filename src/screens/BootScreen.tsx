import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Check } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { bootSequence } from '../data/mockData';
import { playSound } from '../lib/sound';
import { APP_VERSION, USER_NAME } from '../lib/config';

interface BootScreenProps {
  onComplete: () => void;
  soundEnabled: boolean;
}

type Phase = 'logo' | 'init' | 'greeting';

// ─────────────────────────────────────────────────────────────────────────────
// BREWERY / LABORATORY BACKGROUND  (rich SVG blueprint + atmosphere)
// ─────────────────────────────────────────────────────────────────────────────
function FactoryBg({ phase }: { phase: Phase }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base dark gradient — factory ambience */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, #020509 0%, #030c14 35%, #050e18 60%, #030810 80%, #020508 100%)',
        }}
      />

      {/* ── Blueprint SVG ── */}
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 390 844"
        preserveAspectRatio="xMidYMid slice"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'logo' ? 0.07 : 0.045 }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
      >
        {/* ── STRUCTURAL ELEMENTS ── */}
        {/* Ceiling */}
        <line x1="0" y1="0" x2="390" y2="0" stroke="#5a90b0" strokeWidth="2" />
        <rect x="0" y="0" width="390" height="20" fill="rgba(0,100,180,0.04)" />
        {/* Ceiling beam grid */}
        {[0, 78, 156, 234, 312, 390].map((x, i) => (
          <line key={i} x1={x} y1="0" x2={x} y2="844" stroke="#5a90b0" strokeWidth="0.5" strokeDasharray="2 18" opacity="0.4" />
        ))}
        {/* Floor */}
        <line x1="0" y1="720" x2="390" y2="720" stroke="#5a90b0" strokeWidth="2" />
        <line x1="0" y1="724" x2="390" y2="724" stroke="#5a90b0" strokeWidth="0.5" opacity="0.4" />
        {/* Walls */}
        <line x1="0" y1="0" x2="0" y2="844" stroke="#5a90b0" strokeWidth="1.5" />
        <line x1="389" y1="0" x2="389" y2="844" stroke="#5a90b0" strokeWidth="1.5" />

        {/* ── OVERHEAD PIPE MAINS ── */}
        <rect x="18" y="22" width="354" height="10" rx="5" fill="none" stroke="#5a90b0" strokeWidth="1.5" />
        <rect x="22" y="24" width="346" height="6" rx="3" fill="rgba(0,160,220,0.05)" />
        {/* Drop legs */}
        {[52, 118, 195, 272, 338].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="32" x2={x} y2="90" stroke="#5a90b0" strokeWidth="1.2" />
            <circle cx={x} cy="95" r="7" fill="none" stroke="#5a90b0" strokeWidth="1" />
            <circle cx={x} cy="95" r="3" fill="rgba(0,160,220,0.18)" />
          </g>
        ))}
        {/* Secondary pipe mid-height */}
        <rect x="30" y="380" width="330" height="7" rx="3.5" fill="none" stroke="#5a90b0" strokeWidth="1" opacity="0.6" />

        {/* ── LEFT MAIN FERMENTATION VESSEL ── */}
        {/* Body */}
        <rect x="22" y="160" width="100" height="350" rx="14" fill="none" stroke="#5a90b0" strokeWidth="2" />
        {/* Domed top */}
        <path d="M22 174 Q22 156 72 156 Q122 156 122 174" fill="none" stroke="#5a90b0" strokeWidth="2" />
        {/* Conical bottom */}
        <path d="M22 510 Q22 530 72 534 Q122 530 122 510" fill="none" stroke="#5a90b0" strokeWidth="1.5" />
        {/* Equatorial ring */}
        <ellipse cx="72" cy="160" rx="50" ry="9" fill="none" stroke="#5a90b0" strokeWidth="1.5" />
        {/* Liquid level highlight */}
        <rect x="23" y="300" width="98" height="210" rx="0" fill="rgba(0,160,220,0.045)" clipPath="url(#fv1-clip)" />
        <clipPath id="fv1-clip"><rect x="22" y="160" width="100" height="350" rx="14" /></clipPath>
        {/* Level gauge */}
        <rect x="124" y="230" width="6" height="230" rx="3" fill="none" stroke="#5a90b0" strokeWidth="0.8" />
        <rect x="125" y="300" width="4" height="160" rx="2" fill="rgba(0,200,255,0.22)" />
        {[230, 272, 314, 356, 396, 438].map((y, i) => (
          <line key={i} x1="130" y1={y} x2="136" y2={y} stroke="#5a90b0" strokeWidth="0.7" />
        ))}
        {/* Manway */}
        <ellipse cx="72" cy="240" rx="22" ry="10" fill="none" stroke="#5a90b0" strokeWidth="1" />
        <ellipse cx="72" cy="240" rx="16" ry="7" fill="none" stroke="#5a90b0" strokeWidth="0.6" opacity="0.5" />
        {/* CIP spray ball */}
        <circle cx="72" cy="185" r="7" fill="none" stroke="#5a90b0" strokeWidth="0.8" />
        {[0, 72, 144, 216, 288].map((a, i) => {
          const r = (a * Math.PI) / 180;
          return <line key={i} x1={72 + Math.cos(r) * 7} y1={185 + Math.sin(r) * 7} x2={72 + Math.cos(r) * 12} y2={185 + Math.sin(r) * 12} stroke="#5a90b0" strokeWidth="0.7" />;
        })}
        {/* Temperature probe */}
        <line x1="22" y1="350" x2="6" y2="350" stroke="#5a90b0" strokeWidth="1" />
        <rect x="1" y="344" width="8" height="12" rx="2" fill="none" stroke="#FFAA00" strokeWidth="0.9" opacity="0.7" />
        {/* Outlet nozzle */}
        <line x1="72" y1="534" x2="72" y2="570" stroke="#5a90b0" strokeWidth="2" />
        {/* Outlet valve */}
        <circle cx="72" cy="586" r="18" fill="none" stroke="#5a90b0" strokeWidth="1.2" />
        <line x1="54" y1="586" x2="90" y2="586" stroke="#5a90b0" strokeWidth="1.2" />
        <line x1="72" y1="568" x2="72" y2="604" stroke="#5a90b0" strokeWidth="1.2" />
        {/* Label plate */}
        <rect x="38" y="270" width="68" height="22" rx="3" fill="rgba(0,100,180,0.06)" stroke="#5a90b0" strokeWidth="0.6" opacity="0.6" />
        <text x="72" y="285" textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#8ab4cc" opacity="0.9">FV-01 · 2000 L</text>
        {/* Pressure gauge */}
        <circle cx="105" cy="200" r="14" fill="none" stroke="#5a90b0" strokeWidth="0.9" />
        <path d="M96 209 A14 14 0 0 1 114 209" fill="none" stroke="#5a90b0" strokeWidth="0.5" />
        <line x1="105" y1="200" x2="113" y2="195" stroke="#00e1ff" strokeWidth="1" opacity="0.6" />
        <circle cx="105" cy="200" r="2" fill="#5a90b0" opacity="0.7" />

        {/* ── RIGHT FERMENTATION VESSEL ── */}
        <rect x="268" y="200" width="100" height="320" rx="14" fill="none" stroke="#5a90b0" strokeWidth="2" />
        <path d="M268 214 Q268 196 318 196 Q368 196 368 214" fill="none" stroke="#5a90b0" strokeWidth="2" />
        <path d="M268 520 Q268 538 318 542 Q368 538 368 520" fill="none" stroke="#5a90b0" strokeWidth="1.5" />
        <ellipse cx="318" cy="200" rx="50" ry="9" fill="none" stroke="#5a90b0" strokeWidth="1.5" />
        <rect x="269" y="340" width="98" height="180" rx="0" fill="rgba(0,160,220,0.035)" clipPath="url(#fv2-clip)" />
        <clipPath id="fv2-clip"><rect x="268" y="200" width="100" height="320" rx="14" /></clipPath>
        <rect x="256" y="260" width="6" height="220" rx="3" fill="none" stroke="#5a90b0" strokeWidth="0.8" />
        <rect x="257" y="340" width="4" height="140" rx="2" fill="rgba(0,200,255,0.18)" />
        <ellipse cx="318" cy="280" rx="22" ry="10" fill="none" stroke="#5a90b0" strokeWidth="1" />
        <circle cx="318" cy="225" r="7" fill="none" stroke="#5a90b0" strokeWidth="0.8" />
        <line x1="368" y1="380" x2="384" y2="380" stroke="#5a90b0" strokeWidth="1" />
        <rect x="381" y="374" width="8" height="12" rx="2" fill="none" stroke="#FFAA00" strokeWidth="0.9" opacity="0.7" />
        <line x1="318" y1="542" x2="318" y2="578" stroke="#5a90b0" strokeWidth="2" />
        <circle cx="318" cy="594" r="18" fill="none" stroke="#5a90b0" strokeWidth="1.2" />
        <line x1="300" y1="594" x2="336" y2="594" stroke="#5a90b0" strokeWidth="1.2" />
        <line x1="318" y1="576" x2="318" y2="612" stroke="#5a90b0" strokeWidth="1.2" />
        <rect x="284" y="308" width="68" height="22" rx="3" fill="rgba(0,100,180,0.06)" stroke="#5a90b0" strokeWidth="0.6" opacity="0.6" />
        <text x="318" y="323" textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#8ab4cc" opacity="0.9">FV-02 · 1500 L</text>
        <circle cx="351" cy="238" r="14" fill="none" stroke="#5a90b0" strokeWidth="0.9" />
        <line x1="351" y1="238" x2="344" y2="231" stroke="#FFAA00" strokeWidth="1" opacity="0.6" />
        <circle cx="351" cy="238" r="2" fill="#5a90b0" opacity="0.7" />

        {/* ── CONNECTING TRANSFER PIPES ── */}
        {/* Main transfer manifold */}
        <path d="M122 400 L165 400 L165 160 L225 160 L225 400 L268 400" fill="none" stroke="#5a90b0" strokeWidth="1.6" />
        {/* Inline valve on manifold */}
        <circle cx="195" cy="160" r="11" fill="none" stroke="#5a90b0" strokeWidth="1.1" />
        <line x1="184" y1="160" x2="206" y2="160" stroke="#5a90b0" strokeWidth="1.1" />
        {/* Bottom drain manifold */}
        <path d="M72 604 L72 650 Q72 665 87 665 L303 665 Q318 665 318 650 L318 612" fill="none" stroke="#5a90b0" strokeWidth="1.6" />
        {/* Drain valve */}
        <circle cx="195" cy="665" r="11" fill="none" stroke="#5a90b0" strokeWidth="1.1" />
        <line x1="184" y1="665" x2="206" y2="665" stroke="#5a90b0" strokeWidth="1.1" />
        {/* Wall supply lines */}
        <path d="M22 290 Q4 290 4 310 L4 450 Q4 470 16 470" fill="none" stroke="#5a90b0" strokeWidth="1" opacity="0.6" />
        <path d="M368 310 Q386 310 386 330 L386 450 Q386 465 374 465" fill="none" stroke="#5a90b0" strokeWidth="1" opacity="0.6" />
        {/* Insulation rings */}
        {[200, 230, 260, 290].map((y, i) => (
          <ellipse key={i} cx="165" cy={y} rx="4" ry="1.5" fill="none" stroke="#5a90b0" strokeWidth="0.6" opacity="0.4" />
        ))}

        {/* ── SMALL BRIGHT VESSEL (left foreground) ── */}
        <rect x="160" y="560" width="70" height="120" rx="8" fill="none" stroke="#5a90b0" strokeWidth="1.4" />
        <ellipse cx="195" cy="560" rx="35" ry="7" fill="none" stroke="#5a90b0" strokeWidth="1.4" />
        <text x="195" y="615" textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono, monospace" fill="#8ab4cc" opacity="0.7">BT-01 · 500L</text>
        <line x1="195" y1="680" x2="195" y2="720" stroke="#5a90b0" strokeWidth="1.2" />
        <circle cx="195" cy="694" r="8" fill="none" stroke="#5a90b0" strokeWidth="0.9" />
        <line x1="187" y1="694" x2="203" y2="694" stroke="#5a90b0" strokeWidth="0.9" />

        {/* ── CONTROL PANEL / PLC ── */}
        <rect x="148" y="100" width="94" height="52" rx="5" fill="rgba(0,80,160,0.06)" stroke="#00e1ff" strokeWidth="1.1" opacity="0.55" />
        <rect x="153" y="104" width="84" height="22" rx="2" fill="rgba(0,200,255,0.04)" stroke="#00e1ff" strokeWidth="0.7" opacity="0.5" />
        <text x="195" y="119" textAnchor="middle" fontSize="7.5" fontFamily="JetBrains Mono, monospace" fill="#00e1ff" opacity="0.7">PLC-MASTER</text>
        {[163, 178, 193, 208, 223].map((x, i) => (
          <circle key={i} cx={x} cy="138" r="4.5" fill="none" stroke="#5a90b0" strokeWidth="0.7" opacity="0.6" />
        ))}

        {/* ── LAB BENCH (bottom right) ── */}
        <rect x="290" y="640" width="90" height="60" rx="4" fill="none" stroke="#5a90b0" strokeWidth="1" opacity="0.7" />
        {/* Erlenmeyer flask */}
        <path d="M302 658 L296 692 Q302 700 312 700 Q322 700 318 692 L312 658 Z" fill="none" stroke="#5a90b0" strokeWidth="1" />
        <line x1="300" y1="662" x2="324" y2="662" stroke="#5a90b0" strokeWidth="1" />
        {/* Round bottom flask */}
        <circle cx="345" cy="686" r="12" fill="none" stroke="#5a90b0" strokeWidth="1" />
        <line x1="345" y1="674" x2="345" y2="660" stroke="#5a90b0" strokeWidth="1" />
        <line x1="340" y1="657" x2="350" y2="657" stroke="#5a90b0" strokeWidth="1" />
        {/* Bunsen burner */}
        <rect x="364" y="672" width="10" height="28" rx="2" fill="none" stroke="#5a90b0" strokeWidth="0.9" />
        <ellipse cx="369" cy="671" rx="5" ry="2" fill="none" stroke="#5a90b0" strokeWidth="0.9" />
        <path d="M369 668 Q366 660 369 655 Q372 660 369 668" fill="none" stroke="#FFAA00" strokeWidth="0.8" opacity="0.6" />

        {/* ── HEAT EXCHANGER ── */}
        <rect x="10" y="600" width="50" height="80" rx="5" fill="none" stroke="#5a90b0" strokeWidth="1.2" opacity="0.7" />
        {[610, 622, 634, 646, 658, 670].map((y, i) => (
          <line key={i} x1="10" y1={y} x2="60" y2={y} stroke="#5a90b0" strokeWidth="0.6" opacity="0.4" />
        ))}
        <text x="35" y="698" textAnchor="middle" fontSize="6.5" fontFamily="JetBrains Mono, monospace" fill="#8ab4cc" opacity="0.6">HEX-01</text>

        {/* ── DIMENSION / ANNOTATION LINES ── */}
        <line x1="22" y1="148" x2="122" y2="148" stroke="#5a90b0" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.5" />
        <line x1="22" y1="144" x2="22" y2="152" stroke="#5a90b0" strokeWidth="0.5" />
        <line x1="122" y1="144" x2="122" y2="152" stroke="#5a90b0" strokeWidth="0.5" />
        <text x="72" y="144" textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono, monospace" fill="#8ab4cc" opacity="0.55">Ø 2000mm</text>
        <line x1="140" y1="160" x2="140" y2="510" stroke="#5a90b0" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.4" />
        <text x="144" y="345" fontSize="5.5" fontFamily="JetBrains Mono, monospace" fill="#8ab4cc" opacity="0.45" transform="rotate(90,144,345)">H = 4200mm</text>

        {/* Title annotation */}
        <text x="195" y="740" textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono, monospace" fill="#5a90b0" opacity="0.5" letterSpacing="2">SALA DE FERMENTACIÓN — PLANTA BAJA — ESC 1:50</text>
        <line x1="20" y1="745" x2="370" y2="745" stroke="#5a90b0" strokeWidth="0.5" opacity="0.3" />

        {/* ── TITLE BLOCK (bottom) ── */}
        <rect x="20" y="755" width="350" height="55" rx="3" fill="none" stroke="#5a90b0" strokeWidth="0.7" opacity="0.35" />
        <line x1="20" y1="770" x2="370" y2="770" stroke="#5a90b0" strokeWidth="0.5" opacity="0.25" />
        <line x1="195" y1="755" x2="195" y2="810" stroke="#5a90b0" strokeWidth="0.5" opacity="0.25" />
        <text x="107" y="764" textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono, monospace" fill="#5a90b0" opacity="0.5">PROYECTO: J.A.R.B.E.E.R. OS</text>
        <text x="283" y="764" textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono, monospace" fill="#5a90b0" opacity="0.5">REV: BETA-1.0 · 2026-07</text>
        <text x="107" y="792" textAnchor="middle" fontSize="5.5" fontFamily="JetBrains Mono, monospace" fill="#8ab4cc" opacity="0.35">Golden Ale 26-017 · Fermentación activa</text>
        <text x="283" y="792" textAnchor="middle" fontSize="5.5" fontFamily="JetBrains Mono, monospace" fill="#8ab4cc" opacity="0.35">Temp: 64.5°C · pH: 5.2 · °P: 12.4</text>
      </motion.svg>

      {/* ── ATMOSPHERE LAYERS ── */}

      {/* Warm factory amber from below (floor reflection) */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '45%',
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(200,100,20,0.055) 0%, transparent 65%)',
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Cool blue from overhead pipes */}
      <motion.div
        className="absolute left-0 right-0 top-0"
        style={{
          height: '30%',
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,90,200,0.045) 0%, transparent 70%)',
        }}
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Reactor/avatar ambient — dynamic center glow */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: '15%',
          width: 480,
          height: 480,
          background: 'radial-gradient(circle, rgba(0,100,220,0.06) 0%, rgba(0,200,255,0.025) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(24px)',
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── ANIMATED STEAM / VAPOR WISPS from vessel tops ── */}
      {([
        { x: '19%', delay: 0,   dur: 4.2 },
        { x: '50%', delay: 1.6, dur: 5.0 },
        { x: '82%', delay: 0.8, dur: 3.8 },
        { x: '35%', delay: 2.4, dur: 4.6 },
        { x: '66%', delay: 3.2, dur: 4.0 },
      ] as { x: string; delay: number; dur: number }[]).map(({ x, delay, dur }, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: x,
            bottom: '38%',
            width: 3 + (i % 2),
            height: 60,
            background: 'linear-gradient(to top, transparent, rgba(200,230,255,0.07), transparent)',
            borderRadius: 6,
            filter: 'blur(4px)',
          }}
          animate={{ y: [0, -80, -140], opacity: [0, 0.65, 0], scaleX: [1, 2.2, 4.5] }}
          transition={{ duration: dur, repeat: Infinity, ease: 'easeOut', delay, repeatDelay: 1.5 + i * 0.4 }}
        />
      ))}

      {/* ── BLINKING INDICATOR LIGHTS on vessels / panel ── */}
      {([
        { x: '18.5%', y: '66%', color: '#00e1ff', delay: 0 },
        { x: '81.5%', y: '70%', color: '#34d399', delay: 0.7 },
        { x: '38%',   y: '44%', color: '#FFAA00', delay: 1.4 },
        { x: '62%',   y: '50%', color: '#00e1ff', delay: 0.3 },
        { x: '50%',   y: '17%', color: '#34d399', delay: 1.8 },
        { x: '50%',   y: '20%', color: '#FFAA00', delay: 2.2 },
        { x: '50%',   y: '23%', color: '#00e1ff', delay: 0.9 },
      ] as { x: string; y: string; color: string; delay: number }[]).map(({ x, y, color, delay }, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ left: x, top: y, width: 4, height: 4, background: color, boxShadow: `0 0 8px ${color}, 0 0 16px ${color}44` }}
          animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.4, 0.7] }}
          transition={{ duration: 1.8 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay }}
        />
      ))}

      {/* ── ANIMATED DATA READOUT GHOST TEXT ── */}
      {([
        { x: '4%',  y: '42%', text: '64.5°C', color: '#FFAA00' },
        { x: '85%', y: '47%', text: '62.8°C', color: '#FFAA00' },
        { x: '43%', y: '20%', text: 'RUN',    color: '#34d399' },
        { x: '18%', y: '88%', text: '0.8 bar',color: '#00e1ff' },
        { x: '75%', y: '88%', text: '0.6 bar',color: '#00e1ff' },
      ] as { x: string; y: string; text: string; color: string }[]).map(({ x, y, text, color }, i) => (
        <motion.div
          key={i}
          className="absolute font-mono"
          style={{ left: x, top: y, fontSize: 8, color, opacity: 0.45, letterSpacing: '0.08em', fontFamily: 'JetBrains Mono, monospace' }}
          animate={{ opacity: [0.15, 0.55, 0.15] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
        >
          {text}
        </motion.div>
      ))}

      {/* ── SCANLINES ── */}
      <div className="absolute inset-0 scanlines opacity-25" />

      {/* Moving horizontal scan sweep */}
      <motion.div
        className="absolute left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,200,255,0.055) 30%, rgba(0,200,255,0.1) 50%, rgba(0,200,255,0.055) 70%, transparent 100%)' }}
        animate={{ top: ['-2%', '102%'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear', repeatDelay: 6 }}
      />

      {/* ── VIGNETTES ── */}
      {/* Top */}
      <div className="absolute left-0 right-0 top-0 h-40" style={{ background: 'linear-gradient(to bottom, rgba(2,4,8,0.96) 0%, rgba(2,4,8,0.5) 50%, transparent 100%)' }} />
      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-72" style={{ background: 'linear-gradient(to top, rgba(2,5,10,0.98) 0%, rgba(2,5,10,0.75) 40%, transparent 100%)' }} />
      {/* Sides */}
      <div className="absolute bottom-0 left-0 top-0 w-20"  style={{ background: 'linear-gradient(to right, rgba(2,4,8,0.7) 0%, transparent 100%)' }} />
      <div className="absolute bottom-0 right-0 top-0 w-20" style={{ background: 'linear-gradient(to left,  rgba(2,4,8,0.7) 0%, transparent 100%)' }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HUD CORNER BRACKET
// ─────────────────────────────────────────────────────────────────────────────
function HudCorner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const top    = pos.includes('t') ? 'top-5'    : 'bottom-5';
  const side   = pos.includes('l') ? 'left-5'   : 'right-5';
  const horDir = pos.includes('l') ? 'left'     : 'right';
  const verDir = pos.includes('t') ? 'top'      : 'bottom';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-none absolute z-20 ${top} ${side}`}
      style={{ width: 22, height: 22 }}
    >
      <div
        className="absolute"
        style={{
          [verDir]: 0, [horDir]: 0,
          width: 22, height: 22,
          borderStyle: 'solid',
          borderColor: 'rgba(0,225,255,0.4)',
          borderWidth: 0,
          [`border${verDir.charAt(0).toUpperCase() + verDir.slice(1)}Width`]: '1.5px',
          [`border${horDir.charAt(0).toUpperCase() + horDir.slice(1)}Width`]: '1.5px',
        }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOT SCREEN — TOP-LEVEL
// ─────────────────────────────────────────────────────────────────────────────
export function BootScreen({ onComplete, soundEnabled }: BootScreenProps) {
  const [phase, setPhase] = useState<Phase>('logo');
  const [step,  setStep]  = useState(0);
  const [exit,  setExit]  = useState(false);

  // Mouse parallax for the reactor
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px   = useSpring(rawX, { stiffness: 60, damping: 18 });
  const py   = useSpring(rawY, { stiffness: 60, damping: 18 });
  const pxOuter = useSpring(rawX, { stiffness: 30, damping: 14 });
  const pyOuter = useSpring(rawY, { stiffness: 30, damping: 14 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width  - 0.5) * 18);
    rawY.set(((e.clientY - r.top)  / r.height - 0.5) * 12);
  };

  // Phase transitions
  useEffect(() => {
    const t = setTimeout(() => { playSound('boot', soundEnabled); setPhase('init'); }, 3400);
    return () => clearTimeout(t);
  }, [soundEnabled]);

  useEffect(() => {
    if (phase !== 'init') return;
    let i = 0;
    const run = () => {
      if (i >= bootSequence.length) { setTimeout(() => setPhase('greeting'), 600); return; }
      setTimeout(() => { playSound('checkmark', soundEnabled); setStep(i + 1); i++; run(); }, bootSequence[i].delay);
    };
    const t = setTimeout(run, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase !== 'greeting') return;
    const t = setTimeout(() => { setExit(true); setTimeout(onComplete, 1000); }, 3800);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';
  const now      = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      animate={exit ? { opacity: 0, scale: 1.06, filter: 'blur(18px)' } : {}}
      transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* ── BACKGROUND ── */}
      <FactoryBg phase={phase} />

      {/* ── HUD CORNERS ── */}
      {(['tl', 'tr', 'bl', 'br'] as const).map(p => <HudCorner key={p} pos={p} />)}

      {/* ── TOP STATUS BAR ── */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.55 }}
        className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-9 py-4"
        style={{ background: 'linear-gradient(to bottom, rgba(2,4,8,0.85), transparent)' }}
      >
        <div className="flex items-center gap-2.5">
          <motion.div
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.8)' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em]" style={{ color: 'rgba(0,225,255,0.45)' }}>
            J.A.R.B.E.E.R. OS
          </span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.25em]" style={{ color: 'rgba(74,96,112,0.55)' }}>
          {APP_VERSION}
        </span>
        <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: 'rgba(74,96,112,0.55)' }}>
          {now}
        </span>
      </motion.div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 w-full max-w-sm px-6">
        <AnimatePresence mode="wait">

          {/* ══════════════════════════════════
              FASE 1 — LOGO
          ══════════════════════════════════ */}
          {phase === 'logo' && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, scale: 0.75, filter: 'blur(24px)' }}
              animate={{ opacity: 1, scale: 1,   filter: 'blur(0px)' }}
              exit={{    opacity: 0, scale: 1.12, filter: 'blur(16px)', transition: { duration: 0.55 } }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-7"
            >
              {/* Reactor with parallax layers */}
              <div className="relative flex items-center justify-center">
                {/* Outermost parallax ambient ring */}
                <motion.div
                  className="pointer-events-none absolute rounded-full"
                  style={{
                    width: 420, height: 420,
                    background: 'radial-gradient(circle, rgba(0,80,200,0.07) 0%, rgba(0,200,255,0.03) 40%, transparent 68%)',
                    filter: 'blur(36px)',
                    x: pxOuter, y: pyOuter,
                  }}
                  animate={{ scale: [1, 1.08, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Warm factory glow */}
                <motion.div
                  className="pointer-events-none absolute rounded-full"
                  style={{
                    width: 340, height: 340,
                    background: 'radial-gradient(circle, rgba(200,100,0,0.065) 0%, transparent 65%)',
                    filter: 'blur(30px)',
                    x: pxOuter, y: pyOuter,
                  }}
                  animate={{ scale: [1, 1.14, 1], opacity: [0.3, 0.75, 0.3] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
                />
                {/* Avatar with close parallax */}
                <motion.div style={{ x: px, y: py }}>
                  <Avatar size={310} active={false} responding={false} />
                </motion.div>
              </div>

              {/* Title */}
              <motion.div
                className="flex flex-col items-center gap-2.5"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Glowing separator */}
                <motion.div
                  className="h-px w-36"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(0,225,255,0.5), transparent)' }}
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ delay: 1.0, duration: 0.7 }}
                />

                <h1 className="font-display text-[2.85rem] font-black leading-none tracking-[0.22em] text-white glow-white">
                  J.A.R.B.E.E.R.
                </h1>

                <p className="font-mono text-[11px] tracking-[0.44em] uppercase" style={{ color: 'rgba(0,225,255,0.52)' }}>
                  Intelligent Brewery OS
                </p>

                {/* Version pill */}
                <motion.div
                  className="mt-1 flex items-center gap-3"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 1.35 }}
                >
                  <div className="h-px w-8" style={{ background: 'rgba(255,170,0,0.22)' }} />
                  <span
                    className="rounded-full px-4 py-1 font-mono text-[9px] uppercase tracking-[0.32em]"
                    style={{ background: 'rgba(255,170,0,0.07)', border: '1px solid rgba(255,170,0,0.22)', color: '#FFAA00' }}
                  >
                    {APP_VERSION} · PROTOTYPE ONE
                  </span>
                  <div className="h-px w-8" style={{ background: 'rgba(255,170,0,0.22)' }} />
                </motion.div>
              </motion.div>

              {/* Breathing init hint */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 2.0 }}
                className="flex items-center gap-2.5"
              >
                <motion.div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: 'rgba(0,225,255,0.55)', boxShadow: '0 0 8px rgba(0,225,255,0.6)' }}
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.3, 0.7] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <span className="font-mono text-[9px] uppercase tracking-[0.38em]" style={{ color: 'rgba(74,96,112,0.6)' }}>
                  Iniciando sistema...
                </span>
              </motion.div>
            </motion.div>
          )}

          {/* ══════════════════════════════════
              FASE 2 — INIT CHECKLIST
          ══════════════════════════════════ */}
          {phase === 'init' && (
            <motion.div
              key="init"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24, filter: 'blur(8px)', transition: { duration: 0.4 } }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              {/* Small pulsing avatar */}
              <motion.div
                className="relative mb-5"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="pointer-events-none absolute -inset-10 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(0,135,255,0.2) 0%, transparent 70%)', filter: 'blur(20px)' }}
                  animate={{ scale: [1, 1.22, 1], opacity: [0.35, 0.85, 0.35] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <Avatar size={116} active />
              </motion.div>

              <p className="mb-0.5 font-display text-xl font-black tracking-[0.16em] text-white glow-white">J.A.R.B.E.E.R.</p>
              <p className="mb-6 font-mono text-[9px] uppercase tracking-[0.4em]" style={{ color: 'rgba(74,96,112,0.6)' }}>
                Iniciando sistema
              </p>

              {/* Checklist rows */}
              <div className="w-full space-y-2.5">
                {bootSequence.map((item, idx) => {
                  const checked = step > idx;
                  const active  = step === idx;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: step >= idx ? 1 : 0.14, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.035 }}
                      className="flex items-center gap-3"
                    >
                      {/* Icon cell */}
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300"
                        style={{
                          background: checked ? 'rgba(0,225,255,0.07)' : active ? 'rgba(255,170,0,0.1)' : 'rgba(10,20,32,0.7)',
                          border: checked ? '1px solid rgba(0,225,255,0.25)' : active ? '1px solid rgba(255,170,0,0.45)' : '1px solid rgba(255,255,255,0.055)',
                          boxShadow: checked ? '0 0 10px rgba(0,225,255,0.1)' : active ? '0 0 14px rgba(255,170,0,0.2)' : 'none',
                        }}
                      >
                        {checked ? (
                          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 520, damping: 22 }}>
                            <Check size={13} style={{ color: '#00e1ff' }} strokeWidth={3} />
                          </motion.div>
                        ) : active ? (
                          <motion.div
                            className="h-3.5 w-3.5 rounded-full border-2"
                            style={{ borderColor: '#FFAA00', borderTopColor: 'transparent' }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.65, repeat: Infinity, ease: 'linear' }}
                          />
                        ) : (
                          <span className="font-mono text-sm" style={{ color: 'rgba(74,96,112,0.4)' }}>{item.icon}</span>
                        )}
                      </div>

                      {/* Label + OK badge */}
                      <div className="flex flex-1 items-center justify-between">
                        <span
                          className="font-mono text-sm tracking-wide transition-colors duration-300"
                          style={{ color: checked ? '#d8eaf4' : active ? '#ffffff' : 'rgba(74,96,112,0.42)' }}
                        >
                          {item.label}
                        </span>
                        {checked && (
                          <motion.span
                            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                            className="font-mono text-[9px] uppercase tracking-[0.32em]"
                            style={{ color: item.color, textShadow: `0 0 10px ${item.color}60` }}
                          >
                            OK
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="mt-6 w-full">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'rgba(74,96,112,0.5)' }}>Cargando</span>
                  <span className="font-mono text-[10px] tabular-nums" style={{ color: 'rgba(0,225,255,0.6)' }}>
                    {Math.round((step / bootSequence.length) * 100)}%
                  </span>
                </div>
                <div className="relative h-1 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #0055cc 0%, #00e1ff 100%)', boxShadow: '0 0 12px rgba(0,225,255,0.45)' }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${(step / bootSequence.length) * 100}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-y-0 w-8 rounded-full"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
                    animate={{ x: ['-100%', '600%'] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════
              FASE 3 — GREETING
          ══════════════════════════════════ */}
          {phase === 'greeting' && (
            <motion.div
              key="greeting"
              initial={{ opacity: 0, scale: 0.88, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1,    filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-5 text-center"
            >
              {/* Large responding avatar */}
              <div className="relative">
                {/* Dual-tone halo (amber + cyan) */}
                <motion.div
                  className="pointer-events-none absolute -inset-16 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,140,0,0.13) 0%, rgba(0,135,255,0.09) 45%, transparent 70%)',
                    filter: 'blur(32px)',
                  }}
                  animate={{ scale: [1, 1.14, 1], opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Pulse rings */}
                {[0, 0.55, 1.1].map(delay => (
                  <motion.div
                    key={delay}
                    className="pointer-events-none absolute inset-0 rounded-full"
                    style={{ border: '1px solid rgba(255,170,0,0.28)' }}
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.75, opacity: 0 }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay }}
                  />
                ))}
                <Avatar size={230} active responding />
              </div>

              {/* Text block */}
              <div className="flex flex-col items-center gap-1.5">
                {/* Online badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="flex items-center gap-2 rounded-full px-4 py-1.5"
                  style={{ background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.22)' }}
                >
                  <span className="live-dot" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.38em]" style={{ color: '#34d399' }}>
                    Sistema preparado · {APP_VERSION}
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-[3.2rem] font-black leading-tight text-white glow-white"
                >
                  {greeting},
                </motion.h2>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-[3.2rem] font-black leading-tight glow-amber"
                  style={{ color: '#FFAA00' }}
                >
                  {USER_NAME}.
                </motion.h2>

                {/* Separator */}
                <motion.div
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ delay: 0.62, duration: 0.65 }}
                  className="my-1.5 h-px w-32"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(0,225,255,0.45), transparent)' }}
                />

                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.76 }}
                  className="font-mono text-sm"
                  style={{ color: 'rgba(0,225,255,0.82)' }}
                >
                  Lote activo:{' '}
                  <span style={{ color: '#00e1ff', fontWeight: 600 }}>Golden Ale 26-017</span>
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="font-mono text-xs"
                  style={{ color: 'rgba(74,96,112,0.65)' }}
                >
                  Fermentación · 68% · 64.5 °C
                </motion.p>
              </div>

              {/* Entering hint */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex items-center gap-2.5"
              >
                <motion.div className="h-px w-7" style={{ background: 'rgba(0,225,255,0.28)' }} animate={{ scaleX: [1, 1.6, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
                <span className="font-mono text-[9px] uppercase tracking-[0.42em]" style={{ color: 'rgba(74,96,112,0.5)' }}>Entrando al sistema</span>
                <motion.div className="h-px w-7" style={{ background: 'rgba(0,225,255,0.28)' }} animate={{ scaleX: [1, 1.6, 1] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.7 }} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── BOTTOM VERSION BAR ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
        className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3"
      >
        <div className="h-px w-14" style={{ background: 'rgba(42,61,82,0.5)' }} />
        <span className="font-mono text-[8px] uppercase tracking-[0.38em]" style={{ color: 'rgba(42,61,82,0.75)' }}>
          {APP_VERSION} · Intelligent Brewery OS
        </span>
        <div className="h-px w-14" style={{ background: 'rgba(42,61,82,0.5)' }} />
      </motion.div>
    </motion.div>
  );
}
