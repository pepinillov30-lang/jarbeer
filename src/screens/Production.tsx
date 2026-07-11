import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Thermometer,
  Droplets,
  FlaskConical,
  Leaf,
  Dna,
  FileText,
  Check,
  Clock,
  User,
  Pencil,
  X,
  CheckCircle2,
  CircleDot,
  Beaker,
} from 'lucide-react';
import { ScreenHeader } from '../components/ScreenHeader';
import { productionData } from '../data/mockData';

export function Production() {
  const [fields, setFields] = useState({
    batch: productionData.batch,
    brewer: productionData.brewer,
    plato: String(productionData.plato),
    ph: String(productionData.ph),
    currentTemp: String(productionData.currentTemp),
    observations: productionData.observations,
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [pdfState, setPdfState] = useState<'idle' | 'generating' | 'done'>('idle');

  const handleEdit = (field: string, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleGeneratePdf = () => {
    if (pdfState !== 'idle') return;
    setPdfState('generating');
    setTimeout(() => setPdfState('done'), 2400);
    setTimeout(() => setPdfState('idle'), 4200);
  };

  return (
    <div className="flex min-h-full flex-col pb-28">
      <ScreenHeader
        title="Ficha de Producción"
        subtitle={`Lote ${fields.batch} · ${productionData.recipe}`}
        right={
          <span
            className="shrink-0 rounded-lg px-3 py-1 font-mono text-[10px] uppercase tracking-wider"
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

      <div className="flex flex-col gap-3 px-4">
        {/* Stage banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hud rounded-2xl p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(0,135,255,0.08), rgba(0,225,255,0.04))',
            border: '1px solid rgba(0,225,255,0.15)',
            boxShadow: '0 4px 30px rgba(0,135,255,0.1)',
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">
                Fase actual
              </p>
              <p
                className="mt-1 font-display text-2xl font-bold text-cyan-300"
                style={{ textShadow: '0 0 12px rgba(0,225,255,0.5)' }}
              >
                {productionData.stage}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] text-ink-500">Progreso</p>
              <p className="font-display text-3xl font-black text-white">
                {productionData.stageProgress}
                <span className="text-lg text-ink-400">%</span>
              </p>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-800">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #0057a8, #0087ff, #00e1ff)' }}
              initial={{ width: 0 }}
              animate={{ width: `${productionData.stageProgress}%` }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Editable fields — main info */}
        <SectionTitle>Información general</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <EditableField
            icon={<FlaskConical size={14} />}
            label="Lote"
            field="batch"
            value={fields.batch}
            editing={editing === 'batch'}
            onEdit={() => setEditing('batch')}
            onClose={() => setEditing(null)}
            onChange={(v) => handleEdit('batch', v)}
          />
          <EditableField
            icon={<User size={14} />}
            label="Cervecero"
            field="brewer"
            value={fields.brewer}
            editing={editing === 'brewer'}
            onEdit={() => setEditing('brewer')}
            onClose={() => setEditing(null)}
            onChange={(v) => handleEdit('brewer', v)}
          />
        </div>

        {/* Live measurements */}
        <SectionTitle>Métricas en tiempo real</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <EditableField
            icon={<Thermometer size={14} />}
            label="Temp. actual"
            field="currentTemp"
            value={fields.currentTemp}
            unit="°C"
            editing={editing === 'currentTemp'}
            onEdit={() => setEditing('currentTemp')}
            onClose={() => setEditing(null)}
            onChange={(v) => handleEdit('currentTemp', v)}
            accent="amber"
          />
          <EditableField
            icon={<Droplets size={14} />}
            label="°Plato"
            field="plato"
            value={fields.plato}
            editing={editing === 'plato'}
            onEdit={() => setEditing('plato')}
            onClose={() => setEditing(null)}
            onChange={(v) => handleEdit('plato', v)}
            accent="cyan"
          />
          <EditableField
            icon={<Beaker size={14} />}
            label="pH"
            field="ph"
            value={fields.ph}
            editing={editing === 'ph'}
            onEdit={() => setEditing('ph')}
            onClose={() => setEditing(null)}
            onChange={(v) => handleEdit('ph', v)}
            accent="electric"
          />
          <div
            className="hud rounded-xl p-3"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <FlaskConical size={14} className="text-emerald-400" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-500">Vol.</span>
            </div>
            <p className="font-display text-xl font-bold text-emerald-300">{productionData.volume}</p>
            <p className="font-mono text-[10px] text-ink-600">litros</p>
          </div>
        </div>

        {/* Lab specs */}
        <SectionTitle>Especificaciones</SectionTitle>
        <div
          className="grid grid-cols-3 gap-2 rounded-2xl p-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          {[
            { l: 'OG', v: productionData.og.toFixed(3) },
            { l: 'FG', v: productionData.fg.toFixed(3) },
            { l: 'Atenuación', v: `${productionData.attenuation}%` },
            { l: 'IBU', v: `${productionData.ibu}` },
            { l: 'Color', v: `${productionData.ebc} EBC` },
            { l: 'ABV', v: `${productionData.abv}%` },
            { l: 'CO₂', v: `${productionData.carbonation} vol` },
            { l: 'Objetivo pH', v: productionData.targetPh },
            { l: '°Plato obj.', v: `${productionData.targetPlato}` },
          ].map((s) => (
            <SpecCell key={s.l} label={s.l} value={s.v} />
          ))}
        </div>

        {/* Maltas */}
        <SectionTitle icon={<Thermometer size={14} className="text-amber-400" />}>Maltas</SectionTitle>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.05)' }}
        >
          {productionData.maltas.map((m, i) => (
            <IngredientRow
              key={m.name}
              name={m.name}
              meta={`${m.amount}`}
              badge={`${m.ebc} EBC`}
              tag={m.supplier}
              last={i === productionData.maltas.length - 1}
            />
          ))}
        </div>

        {/* Lúpulos */}
        <SectionTitle icon={<Leaf size={14} className="text-emerald-400" />}>Lúpulos</SectionTitle>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.05)' }}
        >
          {productionData.lupulos.map((h, i) => (
            <IngredientRow
              key={`${h.name}-${i}`}
              name={h.name}
              meta={`${h.amount} · α ${h.alpha}`}
              badge={h.addition}
              tag="HOP"
              last={i === productionData.lupulos.length - 1}
            />
          ))}
        </div>

        {/* Levadura */}
        <SectionTitle icon={<Dna size={14} className="text-electric-400" />}>Levadura</SectionTitle>
        <div
          className="rounded-2xl p-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-display text-sm font-bold text-white">{productionData.levadura.name}</p>
              <p className="font-mono text-[11px] text-ink-500">{productionData.levadura.lab} · {productionData.levadura.format}</p>
            </div>
            <span
              className="rounded-lg px-2.5 py-1 font-mono text-[10px] font-bold"
              style={{ background: 'rgba(0,135,255,0.1)', border: '1px solid rgba(0,135,255,0.2)', color: '#339fff' }}
            >
              YEAST
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <SpecCell label="Inoculación" value={productionData.levadura.pitch} />
            <SpecCell label="Atenuación" value={productionData.levadura.attenuation} />
            <SpecCell label="Rango temp." value={productionData.levadura.tempRange} />
          </div>
        </div>

        {/* Observaciones */}
        <SectionTitle>Observaciones</SectionTitle>
        <div className="relative">
          <textarea
            value={fields.observations}
            onChange={(e) => handleEdit('observations', e.target.value)}
            rows={3}
            className="w-full resize-none rounded-2xl px-4 py-3 font-mono text-sm text-white placeholder:text-ink-600 focus:outline-none focus:ring-0"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(0,225,255,0.25)'; }}
            onBlur={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; }}
            placeholder="Notas del cervecero..."
          />
        </div>

        {/* Timeline */}
        <SectionTitle>Proceso de elaboración</SectionTitle>
        <div
          className="rounded-2xl p-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="relative">
            <div
              className="absolute left-[11px] top-3 bottom-3 w-px"
              style={{ background: 'linear-gradient(180deg, rgba(0,225,255,0.5), rgba(0,135,255,0.2), rgba(255,255,255,0.05))' }}
            />
            {productionData.timeline.map((step, i) => (
              <motion.div
                key={step.stage}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="relative flex items-center gap-4 py-2.5"
              >
                <div
                  className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    step.done
                      ? 'border-cyan-400 bg-cyan-500/15'
                      : 'border-ink-700 bg-ink-900'
                  }`}
                >
                  {step.done ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                      <Check size={11} className="text-cyan-300" strokeWidth={3} />
                    </motion.div>
                  ) : (
                    <CircleDot size={9} className="text-ink-700" />
                  )}
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${step.done ? 'text-white' : 'text-ink-500'}`}>
                      {step.stage}
                    </p>
                    <p className="font-mono text-[10px] text-ink-700">{step.duration}</p>
                  </div>
                  {step.temp > 0 && (
                    <span className={`font-mono text-xs ${step.done ? 'text-amber-300/80' : 'text-ink-700'}`}>
                      {step.temp}°C
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PDF button */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={handleGeneratePdf}
          whileHover={pdfState === 'idle' ? { scale: 1.02, y: -2 } : undefined}
          whileTap={pdfState === 'idle' ? { scale: 0.98 } : undefined}
          className="btn-primary mt-2 flex h-14 w-full items-center justify-center gap-3"
          disabled={pdfState !== 'idle'}
        >
          <AnimatePresence mode="wait">
            {pdfState === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <FileText size={20} />
                <span>Generar PDF</span>
              </motion.div>
            )}
            {pdfState === 'generating' && (
              <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
                  <Clock size={20} />
                </motion.div>
                <span>Generando documento...</span>
              </motion.div>
            )}
            {pdfState === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <CheckCircle2 size={20} />
                <span>PDF generado con éxito</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="h-4" />
      </div>
    </div>
  );
}

// ---- Sub-components ----

function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      {icon}
      <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-500">{children}</h2>
      <div className="h-px flex-1 bg-ink-800" />
    </div>
  );
}

interface EditableFieldProps {
  icon: React.ReactNode;
  label: string;
  field: string;
  value: string;
  unit?: string;
  editing: boolean;
  onEdit: () => void;
  onClose: () => void;
  onChange: (v: string) => void;
  accent?: 'amber' | 'cyan' | 'electric';
}

function EditableField({ icon, label, value, unit, editing, onEdit, onClose, onChange, accent }: Omit<EditableFieldProps, 'field'> & { field: string }) {
  const accentColor = accent === 'amber' ? '#ffb800' : accent === 'electric' ? '#0087ff' : '#00e1ff';
  const accentBg = accent === 'amber' ? 'rgba(255,184,0,0.06)' : accent === 'electric' ? 'rgba(0,135,255,0.06)' : 'rgba(0,225,255,0.05)';
  const accentBorder = accent === 'amber' ? 'rgba(255,184,0,0.2)' : accent === 'electric' ? 'rgba(0,135,255,0.2)' : 'rgba(0,225,255,0.15)';

  return (
    <div
      className="hud relative rounded-xl p-3.5"
      style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span style={{ color: accentColor }}>{icon}</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-500">{label}</span>
        {!editing && (
          <button onClick={onEdit} className="ml-auto text-ink-700 hover:text-cyan-400 transition-colors">
            <Pencil size={11} />
          </button>
        )}
        {editing && (
          <button onClick={onClose} className="ml-auto text-ink-600 hover:text-red-400 transition-colors">
            <X size={11} />
          </button>
        )}
      </div>
      <AnimatePresence mode="wait">
        {editing ? (
          <motion.input
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onClose()}
            className="w-full bg-transparent font-display text-xl font-bold focus:outline-none"
            style={{ color: accentColor }}
          />
        ) : (
          <motion.p
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-display text-xl font-bold"
            style={{ color: accentColor, textShadow: `0 0 10px ${accentColor}50` }}
          >
            {value}{unit && <span className="text-sm ml-1 font-mono font-normal text-ink-500">{unit}</span>}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpecCell({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl px-3 py-2"
      style={{ background: 'rgba(0,0,0,0.2)' }}
    >
      <p className="font-mono text-[9px] uppercase tracking-wider text-ink-600">{label}</p>
      <p className="mt-0.5 font-mono text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function IngredientRow({
  name,
  meta,
  badge,
  tag,
  last,
}: {
  name: string;
  meta: string;
  badge: string;
  tag: string;
  last: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 ${!last ? 'border-b' : ''}`}
      style={{
        background: 'rgba(255,255,255,0.015)',
        borderBottomColor: 'rgba(255,255,255,0.04)',
      }}
    >
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-white">{name}</p>
        <p className="font-mono text-[11px] text-ink-500">{meta}</p>
      </div>
      <span
        className="shrink-0 rounded-md px-2 py-0.5 font-mono text-[10px]"
        style={{ background: 'rgba(0,225,255,0.07)', color: 'rgba(0,225,255,0.7)', border: '1px solid rgba(0,225,255,0.12)' }}
      >
        {badge}
      </span>
      <span
        className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold"
        style={{ background: 'rgba(255,255,255,0.04)', color: '#5e6673' }}
      >
        {tag}
      </span>
    </div>
  );
}
