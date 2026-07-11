import { motion } from 'framer-motion';
import {
  Activity,
  Thermometer,
  ListChecks,
  FlaskConical,
  Library,
  MessageSquare,
  ArrowRight,
  Wifi,
  Bell,
  Settings,
} from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { MicButton, type MicState } from '../components/MicButton';
import { GlassCard } from '../components/GlassCard';
import { systemStatus, quickActions, type Screen, USER_NAME } from '../data/mockData';

interface HomeProps {
  micState: MicState;
  onMic: () => void;
  onNavigate: (s: Screen) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function Home({ micState, onMic, onNavigate, soundEnabled, onToggleSound }: HomeProps) {
  const iconMap: Record<string, typeof FlaskConical> = {
    FlaskConical,
    Library,
    MessageSquare,
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div
      className="flex min-h-full flex-col px-4 pb-32 pt-[env(safe-area-inset-top)]"
    >
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between py-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-base font-bold tracking-[0.15em] text-white">
              J.A.R.B.E.E.R.
            </h1>
            <span
              className="rounded-sm px-1.5 py-0.5 font-mono text-[8px] tracking-widest uppercase"
              style={{
                background: 'rgba(250,106,0,0.15)',
                border: '1px solid rgba(250,106,0,0.3)',
                color: '#FA6A00',
              }}
            >
              v2.0
            </span>
          </div>
          <p className="font-mono text-[11px] capitalize text-ink-500">{dateStr}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound toggle */}
          <motion.button
            onClick={onToggleSound}
            whileTap={{ scale: 0.9 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            style={{
              background: soundEnabled ? 'rgba(0,225,255,0.08)' : 'rgba(255,255,255,0.04)',
              border: soundEnabled ? '1px solid rgba(0,225,255,0.25)' : '1px solid rgba(255,255,255,0.06)',
            }}
            aria-label={soundEnabled ? 'Desactivar sonido' : 'Activar sonido'}
            title={soundEnabled ? 'Sonido: activo' : 'Sonido: silenciado'}
          >
            <span
              className="font-mono text-[10px]"
              style={{ color: soundEnabled ? '#00e1ff' : '#434952' }}
            >
              {soundEnabled ? '♪' : '♩'}
            </span>
          </motion.button>

          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            aria-label="Alertas"
          >
            <Bell size={15} className="text-ink-500" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            aria-label="Configuración"
          >
            <Settings size={15} className="text-ink-500" />
          </button>
        </div>
      </motion.div>

      {/* Reactor holográfico — centerpiece */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center py-4"
      >
        {/* Reactor platform glow */}
        <div
          className="absolute bottom-0 h-10 w-48 rounded-full blur-2xl"
          style={{ background: 'radial-gradient(ellipse, rgba(0,135,255,0.3) 0%, transparent 70%)' }}
        />

        {/* Clock */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-3 font-display text-4xl font-bold tracking-widest text-white"
          style={{ textShadow: '0 0 30px rgba(255,255,255,0.2)' }}
        >
          {timeStr}
        </motion.div>

        <Avatar size={200} active={micState !== 'idle'} responding={micState === 'responding'} />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
          <p className="font-display text-xl font-semibold text-white">
            Hola, <span style={{ color: '#FA6A00' }}>{USER_NAME}</span>
          </p>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="live-dot" />
            <span className="font-mono text-xs text-emerald-400">Sistema operativo</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Status metrics */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <MetricCard
          icon={<Thermometer size={16} />}
          label="Temperatura"
          value={`${systemStatus.temperature.toFixed(1)}°C`}
          sub={`→ ${systemStatus.targetTemp.toFixed(1)}°C`}
          accent="amber"
          delay={0.2}
        />
        <MetricCard
          icon={<FlaskConical size={16} />}
          label="Lote activo"
          value="26-017"
          sub={systemStatus.activeBatch.split(' ').slice(0, 2).join(' ')}
          accent="cyan"
          delay={0.25}
        />
        <MetricCard
          icon={<ListChecks size={16} />}
          label="Próxima tarea"
          value={systemStatus.nextTask}
          sub="Programada · 14:30"
          accent="orange"
          delay={0.3}
        />
        <MetricCard
          icon={<Activity size={16} />}
          label="Estado"
          value={systemStatus.state}
          sub={`Uptime ${systemStatus.uptime.split(' ')[0]}`}
          accent="emerald"
          delay={0.35}
        />
      </div>

      {/* Network status pill */}
      <GlassCard className="mt-3 flex items-center gap-3 px-4 py-3" delay={0.4}>
        <Wifi size={16} className="text-cyan-400" />
        <span className="font-mono text-xs text-ink-400 flex-1">Red</span>
        <span className="flex items-center gap-1.5">
          <span className="live-dot" style={{ background: '#34d399' }} />
          <span className="font-mono text-xs text-emerald-300">{systemStatus.network}</span>
        </span>
      </GlassCard>

      {/* Mic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mt-6 flex flex-col items-center"
      >
        <MicButton state={micState} onPress={onMic} size="large" />
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-7"
      >
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-600">
          Accesos rápidos
        </p>
        <div className="space-y-2.5">
          {quickActions.map((action, idx) => {
            const Icon = iconMap[action.icon] ?? FlaskConical;
            return (
              <motion.button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + idx * 0.07 }}
                className="group hud flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.border = '1px solid rgba(0,225,255,0.2)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0,225,255,0.03)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.06)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)';
                }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors"
                  style={{
                    background: 'rgba(0,225,255,0.08)',
                    border: '1px solid rgba(0,225,255,0.15)',
                    color: '#00e1ff',
                  }}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-semibold text-white">
                    {action.label}
                  </p>
                  <p className="font-mono text-[11px] text-ink-500 truncate">
                    {action.description}
                  </p>
                </div>
                {action.value && (
                  <span
                    className="shrink-0 rounded-lg px-2.5 py-1 font-mono text-xs font-bold"
                    style={{
                      background: 'rgba(250,106,0,0.12)',
                      border: '1px solid rgba(250,106,0,0.2)',
                      color: '#FA6A00',
                    }}
                  >
                    {action.value}
                  </span>
                )}
                <ArrowRight size={18} className="shrink-0 text-ink-700 transition-colors group-hover:text-cyan-400" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  accent,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: 'amber' | 'cyan' | 'orange' | 'emerald';
  delay: number;
}) {
  const colors = {
    amber: { text: '#ffb800', glow: 'rgba(255,184,0,0.25)', border: 'rgba(255,184,0,0.15)', bg: 'rgba(255,184,0,0.06)' },
    cyan: { text: '#00e1ff', glow: 'rgba(0,225,255,0.25)', border: 'rgba(0,225,255,0.15)', bg: 'rgba(0,225,255,0.05)' },
    orange: { text: '#FA6A00', glow: 'rgba(250,106,0,0.3)', border: 'rgba(250,106,0,0.2)', bg: 'rgba(250,106,0,0.06)' },
    emerald: { text: '#34d399', glow: 'rgba(52,211,153,0.2)', border: 'rgba(52,211,153,0.15)', bg: 'rgba(52,211,153,0.05)' },
  };
  const c = colors[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="hud rounded-2xl p-4"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        boxShadow: `0 4px 20px ${c.glow}`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color: c.text }}>{icon}</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-500">{label}</span>
      </div>
      <p
        className="font-display text-xl font-bold leading-tight"
        style={{ color: c.text, textShadow: `0 0 10px ${c.glow}` }}
      >
        {value}
      </p>
      <p className="mt-0.5 font-mono text-[10px] text-ink-600">{sub}</p>
    </motion.div>
  );
}
