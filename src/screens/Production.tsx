import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Thermometer,
  Droplets,
  FlaskConical,
  Leaf,
  FileText,
  Check,
  Clock,
  User,
  Pencil,
  X,
  CheckCircle2,
  CircleDot,
  Plus,
  Loader2,
  Beaker,
} from 'lucide-react';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { productionData } from '../data/mockData';

type PdfState = 'idle' | 'preparing' | 'generating' | 'done';

const STAGES = [
  'Maceración', 'Filtrado', 'Ebullición',
  'Whirlpool', 'Fermentación', 'Maduración', 'Envasado',
];

export function Production() {
  const [fields, setFields] = useState({
    batch: productionData.batch,
    brewer: productionData.brewer,
    startDate: productionData.startDate,
    plato: String(productionData.plato),
    ph: String(productionData.ph),
    currentTemp: String(productionData.currentTemp),
    observations: productionData.observations,
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [pdfState, setPdfState] = useState<PdfState>('idle');

  const [maltas, setMaltas] = useState(productionData.maltas.map((m, i) => ({ ...m, id: `m${i}` })));
  const [lupulos, setLupulos] = useState(productionData.lupulos.map((l, i) => ({ ...l, id: `l${i}` })));

  const handleGeneratePdf = () => {
    if (pdfState !== 'idle') return;
    setPdfState('preparing');
    setTimeout(() => setPdfState('generating'), 1600);
    setTimeout(() => setPdfState('done'), 3200);
    setTimeout(() => setPdfState('idle'), 5500);
  };

  const addMalta = () => {
    setMaltas((prev) => [...prev, { id: `m${Date.now()}`, name: 'Nueva malta', amount: '0 kg', ebc: 0, supplier: '—' }]);
  };

  const addLupulo = () => {
    setLupulos((prev) => [...prev, { id: `l${Date.now()}`, name: 'Nuevo lúpulo', alpha: '0%', amount: '0 g', addition: '—' }]);
  };

  const stageIndex = STAGES.indexOf(productionData.stage);

  return (
    <div className="flex min-h-full flex-col pb-32">
      <ScreenHeader
        title="Ficha de Producción"
        subtitle={`Lote ${fields.batch} · ${productionData.recipe}`}
        right={
          <span
            className="rounded-lg px-3 py-1 font-mono text-[10px] uppercase tracking-wider"
            style={{
              background: 'rgba(0,225,255,0.08)',
              border: '1px solid rgba(0,225,255,0.2)',
              color: '#00e1ff',
            }}
          >
            {productionData.stage}
          </span>
        }
      />

      <div className="flex flex-col gap-4 px-4">

        {/* ── Timeline ── */}
        <GlassCard className="overflow-hidden px-0 py-0" corners delay={0.08}>
          <div className="flex overflow-x-auto px-4 pb-3 pt-4" style={{ scrollbarWidth: 'none' }}>
            {productionData.timeline.map((item, i) => {
              const isCurrent = STAGES.indexOf(item.stage) === stageIndex;
              const isDone = item.done;
              return (
                <div key={item.stage} className="flex shrink-0 flex-col items-center" style={{ minWidth: 70 }}>
                  <div className="relative flex flex-col items-center">
                    <div
                      className="relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300"
                      style={{
                        background: isDone ? 'rgba(0,225,255,0.12)' : isCurrent ? 'rgba(255,170,0,0.15)' : 'rgba(13,24,36,0.6)',
                        border: isDone ? '1.5px solid rgba(0,225,255,0.4)' : isCurrent ? '1.5px solid rgba(255,170,0,0.6)' : '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {isDone
                        ? <Check size={14} style={{ color: '#00e1ff' }} strokeWidth={2.5} />
                        : isCurrent
                        ? <CircleDot size={14} style={{ color: '#FFAA00' }} />
                        : <Clock size={12} style={{ color: 'rgba(74,96,112,0.5)' }} />
                      }
                      {isCurrent && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ border: '1px solid rgba(255,170,0,0.4)' }}
                          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                        />
                      )}
                    </div>
                    {i < productionData.timeline.length - 1 && (
                      <div
                        className="absolute left-[calc(50%+18px)] top-4 h-px"
                        style={{
                          width: 34,
                          background: isDone ? 'rgba(0,225,255,0.3)' : 'rgba(255,255,255,0.07)',
                        }}
                      />
                    )}
                  </div>
                  <span
                    className="mt-2 text-center font-mono text-[8px] leading-tight"
                    style={{
                      color: isDone ? '#00e1ff' : isCurrent ? '#FFAA00' : 'rgba(74,96,112,0.5)',
                      maxWidth: 60,
                    }}
                  >
                    {item.stage}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mx-4 mb-4 h-1 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #00e1ff, #FFAA00)' }}
              initial={{ width: 0 }}
              animate={{ width: `${productionData.stageProgress}%` }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </GlassCard>

        {/* ── Datos generales ── */}
        <Section title="Datos generales" icon={<FileText size={14} />} delay={0.12}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'batch',     label: 'Nº Lote',          icon: <FileText size={13}/> },
              { key: 'brewer',    label: 'Maestro',           icon: <User size={13}/> },
              { key: 'startDate', label: 'Fecha inicio',      icon: <Clock size={13}/> },
              { key: 'plato',     label: '°Plato',            icon: <Droplets size={13}/> },
              { key: 'ph',        label: 'pH',                icon: <Droplets size={13}/> },
              { key: 'currentTemp', label: 'Temperatura (°C)', icon: <Thermometer size={13}/> },
            ].map(({ key, label, icon }) => (
              <EditableField
                key={key}
                fieldKey={key}
                label={label}
                icon={icon}
                value={fields[key as keyof typeof fields]}
                isEditing={editing === key}
                onEdit={() => setEditing(key)}
                onSave={(v) => { setFields((p) => ({ ...p, [key]: v })); setEditing(null); }}
                onCancel={() => setEditing(null)}
              />
            ))}
          </div>
        </Section>

        {/* ── Métricas técnicas ── */}
        <Section title="Métricas técnicas" icon={<Beaker size={14} />} delay={0.18}>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'OG',  value: productionData.og.toFixed(3),  unit: '' },
              { label: 'FG',  value: productionData.fg.toFixed(3),  unit: '' },
              { label: 'ABV', value: `${productionData.abv}%`,      unit: '' },
              { label: 'IBU', value: String(productionData.ibu),    unit: '' },
              { label: 'EBC', value: String(productionData.ebc),    unit: '' },
              { label: 'CO₂', value: `${productionData.carbonation}`, unit: 'vol' },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(0,135,255,0.06)', border: '1px solid rgba(0,135,255,0.12)' }}
              >
                <p className="font-mono text-[9px] uppercase tracking-wider text-ink-500">{m.label}</p>
                <p className="mt-1 font-display text-lg font-bold text-white">{m.value}</p>
                {m.unit && <p className="font-mono text-[9px] text-ink-600">{m.unit}</p>}
              </div>
            ))}
          </div>
        </Section>

        {/* ── Maltas ── */}
        <Section title="Maltas" icon={<Leaf size={14} />} delay={0.22}
          action={<AddButton onClick={addMalta} />}
        >
          <div className="space-y-2">
            {maltas.map((m) => (
              <IngredientRow
                key={m.id}
                col1={m.name}
                col2={m.amount}
                col3={`EBC ${m.ebc}`}
                badge={m.supplier}
                accent="cyan"
              />
            ))}
          </div>
        </Section>

        {/* ── Lúpulos ── */}
        <Section title="Lúpulos" icon={<FlaskConical size={14} />} delay={0.26}
          action={<AddButton onClick={addLupulo} />}
        >
          <div className="space-y-2">
            {lupulos.map((l) => (
              <IngredientRow
                key={l.id}
                col1={l.name}
                col2={l.amount}
                col3={l.alpha}
                badge={l.addition}
                accent="amber"
              />
            ))}
          </div>
        </Section>

        {/* ── Levadura ── */}
        <Section title="Levadura" icon={<Droplets size={14} />} delay={0.30}>
          <div
            className="rounded-xl p-4"
            style={{ background: 'rgba(52,211,153,0.04)', border: '1px solid rgba(52,211,153,0.1)' }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-base font-bold text-white">{productionData.levadura.name}</p>
                <p className="font-mono text-xs text-ink-500">{productionData.levadura.lab} · {productionData.levadura.format}</p>
              </div>
              <span
                className="rounded-lg px-2 py-1 font-mono text-[10px]"
                style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }}
              >
                {productionData.levadura.attenuation}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-ink-600">Pitching</p>
                <p className="mt-0.5 font-mono text-xs text-ink-300">{productionData.levadura.pitch}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-ink-600">Temp. rango</p>
                <p className="mt-0.5 font-mono text-xs text-ink-300">{productionData.levadura.tempRange}</p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Observaciones ── */}
        <Section title="Observaciones" icon={<Pencil size={14} />} delay={0.34}>
          {editing === 'observations' ? (
            <div className="space-y-2">
              <textarea
                value={fields.observations}
                onChange={(e) => setFields((p) => ({ ...p, observations: e.target.value }))}
                className="field-edit min-h-[80px] w-full resize-none rounded-xl p-3 text-sm"
                style={{
                  background: 'rgba(13,24,36,0.7)',
                  border: '1px solid rgba(0,225,255,0.3)',
                  color: '#e8f0f8',
                  outline: 'none',
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={() => setEditing(null)} className="flex-1 rounded-xl py-2 font-mono text-xs" style={{ background: 'rgba(0,225,255,0.1)', border: '1px solid rgba(0,225,255,0.2)', color: '#00e1ff' }}>
                  Guardar
                </button>
                <button onClick={() => setEditing(null)} className="flex-1 rounded-xl py-2 font-mono text-xs" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(74,96,112,0.8)' }}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setEditing('observations')}
              className="w-full rounded-xl p-3 text-left text-sm transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <p className="font-sans text-sm leading-relaxed text-ink-300">{fields.observations}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <Pencil size={10} style={{ color: 'rgba(0,225,255,0.5)' }} />
                <span className="font-mono text-[9px] text-ink-600">Toca para editar</span>
              </div>
            </button>
          )}
        </Section>

        {/* ── PDF button ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-2 pb-4"
        >
          <button
            onClick={handleGeneratePdf}
            disabled={pdfState !== 'idle'}
            className="relative w-full overflow-hidden rounded-2xl py-4 font-display text-sm font-bold uppercase tracking-widest transition-all duration-300"
            style={{
              background: pdfState === 'done'
                ? 'rgba(52,211,153,0.12)'
                : 'rgba(0,225,255,0.08)',
              border: pdfState === 'done'
                ? '1px solid rgba(52,211,153,0.35)'
                : '1px solid rgba(0,225,255,0.2)',
              color: pdfState === 'done' ? '#34d399' : '#00e1ff',
            }}
          >
            <AnimatePresence mode="wait">
              {pdfState === 'idle' && (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                  <FileText size={15} /> Generar PDF
                </motion.span>
              )}
              {pdfState === 'preparing' && (
                <motion.span key="prep" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                  <Loader2 size={15} className="animate-spin" /> Preparando documento...
                </motion.span>
              )}
              {pdfState === 'generating' && (
                <motion.span key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                  <Loader2 size={15} className="animate-spin" /> Generando PDF...
                </motion.span>
              )}
              {pdfState === 'done' && (
                <motion.span key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                  <CheckCircle2 size={15} /> PDF listo
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Section({
  title, icon, children, delay, action,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay: number;
  action?: React.ReactNode;
}) {
  return (
    <GlassCard className="p-4" corners delay={delay}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ color: '#00e1ff' }}>{icon}</span>
          <span className="font-display text-sm font-bold text-white">{title}</span>
        </div>
        {action}
      </div>
      {children}
    </GlassCard>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors"
      style={{
        background: 'rgba(0,225,255,0.06)',
        border: '1px solid rgba(0,225,255,0.18)',
        color: '#00e1ff',
      }}
    >
      <Plus size={11} /> Añadir
    </button>
  );
}

function IngredientRow({
  col1, col2, col3, badge, accent,
}: {
  col1: string;
  col2: string;
  col3: string;
  badge: string;
  accent: 'cyan' | 'amber';
}) {
  const c = accent === 'cyan'
    ? { border: 'rgba(0,225,255,0.1)', bg: 'rgba(0,225,255,0.04)', badge: 'rgba(0,225,255,0.08)', badgeBorder: 'rgba(0,225,255,0.18)', badgeColor: '#00e1ff' }
    : { border: 'rgba(255,170,0,0.1)', bg: 'rgba(255,170,0,0.04)', badge: 'rgba(255,170,0,0.08)', badgeBorder: 'rgba(255,170,0,0.2)', badgeColor: '#FFAA00' };

  return (
    <div
      className="flex items-center gap-3 rounded-xl px-3 py-3"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-sm font-medium text-white">{col1}</p>
        <p className="font-mono text-[10px] text-ink-500">{col2} · {col3}</p>
      </div>
      <span
        className="shrink-0 rounded-lg px-2 py-0.5 font-mono text-[10px]"
        style={{ background: c.badge, border: `1px solid ${c.badgeBorder}`, color: c.badgeColor }}
      >
        {badge}
      </span>
    </div>
  );
}

function EditableField({
  fieldKey, label, icon, value, isEditing, onEdit, onSave, onCancel,
}: {
  fieldKey: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (v: string) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(value);

  if (isEditing) {
    return (
      <div className="col-span-2 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="flex-1 rounded-xl px-3 py-2 font-mono text-sm"
          style={{
            background: 'rgba(13,24,36,0.8)',
            border: '1px solid rgba(0,225,255,0.35)',
            color: '#e8f0f8',
            outline: 'none',
          }}
          autoFocus
          onKeyDown={(e) => { if (e.key === 'Enter') onSave(draft); if (e.key === 'Escape') onCancel(); }}
        />
        <button onClick={() => onSave(draft)} className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'rgba(0,225,255,0.1)', border: '1px solid rgba(0,225,255,0.2)' }}>
          <Check size={14} style={{ color: '#00e1ff' }} />
        </button>
        <button onClick={onCancel} className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <X size={14} style={{ color: 'rgba(74,96,112,0.7)' }} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onEdit}
      className="group rounded-xl p-3 text-left transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,225,255,0.2)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
    >
      <div className="mb-1 flex items-center gap-1.5">
        <span style={{ color: 'rgba(0,225,255,0.5)' }}>{icon}</span>
        <span className="font-mono text-[9px] uppercase tracking-wider text-ink-600">{label}</span>
      </div>
      <p className="font-display text-sm font-semibold text-white">{value}</p>
    </button>
  );
}
