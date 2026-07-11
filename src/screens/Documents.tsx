import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, TestTube, Leaf, FlaskConical, History, Receipt, Library } from 'lucide-react';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { documents, type DocCategory, type DocItem } from '../data/mockData';

const CATEGORIES: { id: DocCategory | 'Todos'; label: string; icon: React.ReactNode }[] = [
  { id: 'Todos',    label: 'Todos',    icon: <Library size={13}/> },
  { id: 'Receta',   label: 'Receta',   icon: <FileText size={13}/> },
  { id: 'COA',      label: 'COA',      icon: <TestTube size={13}/> },
  { id: 'Insumo',   label: 'Insumo',   icon: <Leaf size={13}/> },
  { id: 'Levadura', label: 'Levadura', icon: <FlaskConical size={13}/> },
  { id: 'Historial',label: 'Historial',icon: <History size={13}/> },
  { id: 'Factura',  label: 'Factura',  icon: <Receipt size={13}/> },
];

const CATEGORY_COLORS: Record<DocCategory, { text: string; border: string; bg: string }> = {
  Receta:    { text: '#00e1ff', border: 'rgba(0,225,255,0.25)', bg: 'rgba(0,225,255,0.08)' },
  COA:       { text: '#FFAA00', border: 'rgba(255,170,0,0.25)', bg: 'rgba(255,170,0,0.08)' },
  Insumo:    { text: '#34d399', border: 'rgba(52,211,153,0.25)', bg: 'rgba(52,211,153,0.08)' },
  Levadura:  { text: '#a78bfa', border: 'rgba(167,139,250,0.25)', bg: 'rgba(167,139,250,0.08)' },
  Historial: { text: '#60a5fa', border: 'rgba(96,165,250,0.25)', bg: 'rgba(96,165,250,0.08)' },
  Factura:   { text: '#fb923c', border: 'rgba(251,146,60,0.25)', bg: 'rgba(251,146,60,0.08)' },
};

export function Documents() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<DocCategory | 'Todos'>('Todos');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return documents.filter((d) => {
      const matchCat = activeCategory === 'Todos' || d.category === activeCategory;
      const matchQ = !q || d.title.toLowerCase().includes(q) || d.reference.toLowerCase().includes(q) || d.excerpt.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, activeCategory]);

  const openDoc = openId ? documents.find((d) => d.id === openId) : null;

  return (
    <div className="flex min-h-full flex-col pb-32">
      <ScreenHeader
        title="Biblioteca"
        subtitle={`${documents.length} documentos indexados`}
        right={
          <span className="font-mono text-xs text-ink-500">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </span>
        }
      />

      <div className="flex flex-col gap-4 px-4">

        {/* ── Search ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <Search
            size={15}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: 'rgba(74,96,112,0.7)' }}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, referencia o contenido..."
            className="w-full rounded-2xl py-3.5 pl-11 pr-10 font-mono text-sm placeholder:text-ink-600 focus:outline-none"
            style={{
              background: 'rgba(13,24,36,0.7)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#e8f0f8',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(0,225,255,0.3)'; }}
            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <X size={14} style={{ color: 'rgba(74,96,112,0.7)' }} />
            </button>
          )}
        </motion.div>

        {/* ── Category pills ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {CATEGORIES.map(({ id, label, icon }) => {
            const isActive = activeCategory === id;
            return (
              <motion.button
                key={id}
                onClick={() => setActiveCategory(id)}
                whileTap={{ scale: 0.94 }}
                className="flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 font-mono text-[11px] font-medium uppercase tracking-wider transition-all duration-200"
                style={{
                  background: isActive ? 'rgba(0,225,255,0.1)' : 'rgba(13,24,36,0.7)',
                  border: isActive ? '1px solid rgba(0,225,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  color: isActive ? '#00e1ff' : 'rgba(74,96,112,0.8)',
                }}
              >
                <span style={{ color: isActive ? '#00e1ff' : 'rgba(74,96,112,0.6)' }}>{icon}</span>
                {label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── Document cards ── */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center"
              >
                <Library size={36} className="mx-auto mb-3 opacity-20" style={{ color: '#00e1ff' }} />
                <p className="font-mono text-sm text-ink-600">Sin resultados</p>
              </motion.div>
            ) : (
              filtered.map((doc, idx) => (
                <DocCard
                  key={doc.id}
                  doc={doc}
                  delay={idx * 0.05}
                  onOpen={() => setOpenId(doc.id)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Document detail overlay ── */}
      <AnimatePresence>
        {openDoc && (
          <DocDetailOverlay doc={openDoc} onClose={() => setOpenId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function DocCard({ doc, delay, onOpen }: { doc: DocItem; delay: number; onOpen: () => void }) {
  const c = CATEGORY_COLORS[doc.category];
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, delay }}
      onClick={onOpen}
      className="group w-full rounded-2xl p-4 text-left transition-all duration-200"
      style={{ background: 'rgba(13,24,36,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,225,255,0.18)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Icon */}
        <div
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
        >
          <FileText size={18} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-display text-sm font-semibold text-white">{doc.title}</p>
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <span
              className="rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide"
              style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
            >
              {doc.category}
            </span>
            <span className="font-mono text-[10px] text-ink-600">{doc.reference}</span>
          </div>
          <p className="mt-1.5 line-clamp-2 font-sans text-xs leading-relaxed text-ink-500">
            {doc.excerpt}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t pt-2.5" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <span className="font-mono text-[9px] text-ink-600">{doc.date}</span>
        <div className="flex items-center gap-3">
          {doc.size && <span className="font-mono text-[9px] text-ink-600">{doc.size}</span>}
          <span className="font-mono text-[9px] text-ink-600">{doc.pages} pág.</span>
          <span
            className="font-mono text-[10px] transition-colors group-hover:text-cyan-400"
            style={{ color: 'rgba(0,225,255,0.4)' }}
          >
            Ver →
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function DocDetailOverlay({ doc, onClose }: { doc: DocItem; onClose: () => void }) {
  const c = CATEGORY_COLORS[doc.category];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-end justify-center p-4"
      style={{ background: 'rgba(2,4,8,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="hud w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
            >
              <FileText size={22} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">{doc.title}</h3>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className="rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide"
                  style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                >
                  {doc.category}
                </span>
                <span className="font-mono text-[10px] text-ink-600">{doc.reference}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <X size={16} style={{ color: 'rgba(74,96,112,0.8)' }} />
          </button>
        </div>

        {/* Excerpt */}
        <div
          className="mb-5 rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="font-sans text-sm leading-relaxed text-ink-300">{doc.excerpt}</p>
        </div>

        {/* Meta */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          {[
            { label: 'Fecha',   value: doc.date },
            { label: 'Páginas', value: `${doc.pages} pág.` },
            { label: 'Tamaño', value: doc.size ?? '—' },
          ].map((m) => (
            <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="font-mono text-[9px] uppercase tracking-wider text-ink-600">{m.label}</p>
              <p className="mt-1 font-mono text-xs text-white">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Future action notice */}
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,225,255,0.04)', border: '1px solid rgba(0,225,255,0.1)' }}>
          <p className="font-mono text-[10px] text-ink-600">
            Apertura de PDF real disponible tras integración con backend.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
