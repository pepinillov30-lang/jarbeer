import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Thermometer,
  ListChecks,
  FlaskConical,
  Library,
  MessageSquare,
  ArrowRight,
  Bell,
  Volume2,
  VolumeX,
  Cpu,
  FileText,
  Radio,
} from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { MicButton, type MicState } from '../components/MicButton';
import { GlassCard } from '../components/GlassCard';
import { systemStatus, quickActions, type Screen, USER_NAME, type SystemMode } from '../data/mockData';
import { APP_VERSION } from '../lib/config';

interface HomeProps {
  micState: MicState;
  onMic: () => void;
  onNavigate: (s: Screen) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function Home({ micState, onMic, onNavigate, soundEnabled, onToggleSound }: HomeProps) {
  const [time, setTime] = useState(() => fmtTime());
  const [mode, setMode] = useState<SystemMode>('LIVE');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setTime(fmtTime()), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const iconMap: Record<string, typeof FlaskConical> = {
    FlaskConical,
    Library,
    MessageSquare,
  };

  const dateStr = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const isActive = micState !== 'idle';
  const isResponding = micState === 'responding';

  return (
    <div className="flex min-h-full flex-col px-4 pb-32 pt-[max(env(safe-area-inset-top),16px)]">

      {/* ── Top bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between pb-2"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-sm font-bold tracking-[0.18em] text-white">
              J.A.R.B.E.E.R.
            </h1>
            <span
              className="rounded px-1.5 py-0.5 font-mono text-[8px] tracking-widest uppercase"
              style={{
                background: 'rgba(255,170,0,0.12)',
                border: '1px solid rgba(255,170,0,0.25)',
                color: '#FFAA00',
              }}
            >
              {APP_VERSION}
            </span>
          </div>
          <p className="font-mono text-[10px] capitalize text-ink-500">{dateStr}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* LIVE / BUNKER toggle */}
          <motion.button
            onClick={() => setMode((m) => m === 'LIVE' ? 'BUNKER' : 'LIVE')}
            whileTap={{ scale: 0.92 }}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all duration-300"
            style={{
              background: mode === 'LIVE' ? 'rgba(52,211,153,0.08)' : 'rgba(255,170,0,0.08)',
              border: `1px solid ${mode === 'LIVE' ? 'rgba(52,211,153,0.25)' : 'rgba(255,170,0,0.25)'}`,
            }}
            aria-label={`Modo ${mode}`}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: mode === 'LIVE' ? '#34d399' : '#FFAA00',
                boxShadow: `0 0 6px ${mode === 'LIVE' ? 'rgba(52,211,153,0.8)' : 'rgba(255,170,0,0.8)'}`,
                animation: mode === 'LIVE' ? 'live-pulse 2s ease-in-out infinite' : 'none',
              }}
            />
            <span
              className="font-mono text-[9px] tracking-widest uppercase"
              style={{ color: mode === 'LIVE' ? '#34d399' : '#FFAA00' }}
            >
              {mode}
            </span>
          </motion.button>

          {/* Sound toggle */}
          <motion.button
            onClick={onToggleSound}
            whileTap={{ scale: 0.9 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200"
            style={{
              background: soundEnabled ? 'rgba(0,225,255,0.08)' : 'rgba(255,255,255,0.04)',
              border: soundEnabled ? '1px solid rgba(0,225,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
            }}
            aria-label={soundEnabled ? 'Silenciar' : 'Activar sonido'}
          >
            {soundEnabled
              ? <Volume2 size={14} style={{ color: '#00e1ff' }} />
              : <VolumeX size={14} style={{ color: 'rgba(74,96,112,0.7)' }} />
            }
          </motion.button>

          {/* Alerts */}
          <div className="relative">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              aria-label="Alertas"
            >
              <Bell size={14} style={{ color: 'rgba(74,96,112,0.7)' }} />
            </button>
            {systemStatus.alerts > 0 && (
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full" style={{ background: '#FA6A00', boxShadow: '0 0 6px rgba(250,106,0,0.8)' }} />
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Reactor centerpiece ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center py-4"
      >
        {/* Platform glow under avatar */}
        <div
          className="absolute bottom-0 h-12 w-56 rounded-full"
          style={{
            background: `radial-gradient(ellipse, rgba(${isResponding ? '255,170,0' : '0,135,255'},0.25) 0%, transparent 70%)`,
            filter: 'blur(14px)',
            transition: 'background 0.6s',
          }}
        />

        {/* Live clock */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4 font-display text-5xl font-black tracking-widest text-white"
          style={{ textShadow: '0 0 40px rgba(255,255,255,0.15)' }}
        >
          {time}
        </motion.div>

        <Avatar size={260} active={isActive} responding={isResponding} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-5 text-center"
        >
          <p className="font-display text-xl font-semibold text-white">
            Hola, <span style={{ color: '#FFAA00' }}>{USER_NAME}</span>
          </p>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="live-dot" />
            <span className="font-mono text-xs text-emerald-400">Todos los sistemas operativos</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Metric grid 2×3 ── */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <MetricCard icon={<Thermometer size={15}/>} label="Temperatura" value={`${systemStatus.temperature.toFixed(1)}°C`} sub={`→ ${systemStatus.targetTemp.toFixed(1)}°C`} accent="amber" delay={0.18}/>
        <MetricCard icon={<FlaskConical size={15}/>} label="Lote activo" value="26-017" sub="Golden Ale" accent="cyan" delay={0.22}/>
        <MetricCard icon={<ListChecks size={15}/>} label="Próxima tarea" value={systemStatus.nextTask} sub="Programada · 14:30" accent="orange" delay={0.26}/>
        <MetricCard icon={<Activity size={15}/>} label="Estado planta" value={systemStatus.state} sub={`Uptime ${systemStatus.uptime}`} accent="emerald" delay={0.30}/>
        <MetricCard icon={<FileText size={15}/>} label="Documentos" value={String(systemStatus.docsIndexed)} sub="Indexados" accent="cyan" delay={0.34}/>
        <MetricCard icon={<Cpu size={15}/>} label="Estado IA" value={systemStatus.aiModel} sub={systemStatus.aiStatus} accent="orange" delay={0.38}/>
      </div>

      {/* ── Network / mode pill ── */}
      <GlassCard className="mt-3 flex items-center gap-3 px-4 py-3" delay={0.42}>
        <Radio size={14} style={{ color: '#00e1ff' }} />
        <span className="flex-1 font-mono text-xs text-ink-400">Red · {mode === 'LIVE' ? 'Modo producción' : 'Sin conexión externa'}</span>
        <span className="flex items-center gap-1.5">
          <span className="live-dot" style={{ background: '#34d399' }} />
          <span className="font-mono text-xs text-emerald-300">{systemStatus.network}</span>
        </span>
      </GlassCard>

      {/* ── Mic ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.46 }}
        className="mt-7 flex flex-col items-center"
      >
        <MicButton state={micState} onPress={onMic} size="large" />
      </motion.div>

      {/* ── Quick actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.52 }}
        className="mt-8"
      >
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-600">
          Accesos rápidos
        </p>
        <div className="space-y-2.5">
          {quickActions.map((action, idx) => {
            const Icon = iconMap[action.icon] ?? FlaskConical;
            return (
              <motion.button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.56 + idx * 0.07 }}
                className="group flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.border = '1px solid rgba(0,225,255,0.2)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0,225,255,0.025)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.06)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)';
                }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: 'rgba(0,225,255,0.07)',
                    border: '1px solid rgba(0,225,255,0.14)',
                    color: '#00e1ff',
                  }}
                >
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold text-white">{action.label}</p>
                  <p className="truncate font-mono text-[11px] text-ink-500">{action.description}</p>
                </div>
                {action.value && (
                  <span
                    className="shrink-0 rounded-lg px-2.5 py-1 font-mono text-xs font-bold"
                    style={{
                      background: 'rgba(255,170,0,0.1)',
                      border: '1px solid rgba(255,170,0,0.2)',
                      color: '#FFAA00',
                    }}
                  >
                    {action.value}
                  </span>
                )}
                <ArrowRight
                  size={16}
                  className="shrink-0 transition-colors duration-200 group-hover:text-cyan-400"
                  style={{ color: 'rgba(74,96,112,0.5)' }}
                />
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function fmtTime() {
  return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function MetricCard({
  icon, label, value, sub, accent, delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: 'amber' | 'cyan' | 'orange' | 'emerald';
  delay: number;
}) {
  const colors = {
    amber:   { text: '#FFAA00', glow: 'rgba(255,170,0,0.2)',   border: 'rgba(255,170,0,0.12)',  bg: 'rgba(255,170,0,0.05)' },
    cyan:    { text: '#00e1ff', glow: 'rgba(0,225,255,0.2)',   border: 'rgba(0,225,255,0.12)',  bg: 'rgba(0,225,255,0.04)' },
    orange:  { text: '#FA6A00', glow: 'rgba(250,106,0,0.25)',  border: 'rgba(250,106,0,0.15)',  bg: 'rgba(250,106,0,0.05)' },
    emerald: { text: '#34d399', glow: 'rgba(52,211,153,0.18)', border: 'rgba(52,211,153,0.12)', bg: 'rgba(52,211,153,0.04)' },
  };
  const c = colors[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl p-4"
      style={{ background: c.bg, border: `1px solid ${c.border}`, boxShadow: `0 4px 20px ${c.glow}` }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span style={{ color: c.text }}>{icon}</span>
        <span className="font-mono text-[9px] uppercase tracking-wider text-ink-500">{label}</span>
      </div>
      <p className="font-display text-xl font-bold leading-tight" style={{ color: c.text, textShadow: `0 0 12px ${c.glow}` }}>
        {value}
      </p>
      <p className="mt-0.5 font-mono text-[10px] text-ink-600">{sub}</p>
    </motion.div>
  );
}
