import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, FileCheck, FlaskConical, Leaf, Receipt, History } from 'lucide-react';
import { ScreenHeader } from '../components/ScreenHeader';
import { documents, type DocCategory } from '../data/mockData';

const categoryMeta: Record<
  DocCategory | 'Todos',
  { color: string; bg: string; border: string; icon: typeof FileText; label: string }
> = {
  Todos: { color: '#7f8899', bg: 'rgba(127,136,153,0.08)', border: 'rgba(127,136,153,0.2)', icon: FileText, label: 'Todos' },
  Receta: { color: '#00e1ff', bg: 'rgba(0,225,255,0.07)', border: 'rgba(0,225,255,0.2)', icon: FlaskConical, label: 'Receta' },
  COA: { color: '#34d399', bg: 'rgba(52,211,153,0.07)', border: 'rgba(52,211,153,0.2)', icon: FileCheck, label: 'COA' },
  Insumo: { color: '#ffb800', bg: 'rgba(255,184,0,0.07)', border: 'rgba(255,184,0,0.2)', icon: Leaf, label: 'Insumo' },
  Levadura: { color: '#0087ff', bg: 'rgba(0,135,255,0.07)', border: 'rgba(0,135,255,0.2)', icon: FlaskConical, label: 'Levadura' },
  Factura: { color: '#FA6A00', bg: 'rgba(250,106,0,0.07)', border: 'rgba(250,106,0,0.2)', icon: Receipt, label: 'Factura' },
  Historial: { color: '#a78bfa', bg: 'rgba(167,139,250,0.07)', border: 'rgba(167,139,250,0.2)', icon: History, label: 'Historial' },
};

const categories = (Object.keys(categoryMeta) as (DocCategory | 'Todos')[]);

export function Documents() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<DocCategory | 'Todos'>('Todos');

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      const matchCat = filter === 'Todos' || doc.category === filter;
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.reference.toLowerCase().includes(q) ||
        doc.excerpt.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, filter]);

  return (
    <div className="flex min-h-full flex-col pb-28">
      <ScreenHeader
        title="Biblioteca"
        subtitle={`Documentación técnica · ${documents.length} archivos`}
      />

      <div className="flex flex-col gap-3 px-4">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <Search size={18} className="shrink-0 text-ink-600" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar documentos, referencias..."
            className="flex-1 bg-transparent font-mono text-sm text-white placeholder:text-ink-700 focus:outline-none"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => setQuery('')}
                className="text-ink-600 hover:text-cyan-300 transition-colors"
              >
                <X size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Filters */}
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {categories.map((cat) => {
            const m = categoryMeta[cat];
            const isActive = filter === cat;
            return (
              <motion.button
                key={cat}
                onClick={() => setFilter(cat)}
                whileTap={{ scale: 0.95 }}
                className="shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all duration-200"
                style={{
                  background: isActive ? m.bg : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? m.border : 'rgba(255,255,255,0.06)'}`,
                  color: isActive ? m.color : '#434952',
                  boxShadow: isActive ? `0 0 12px ${m.bg}` : 'none',
                }}
              >
                <m.icon size={11} />
                {m.label}
              </motion.button>
            );
          })}
        </div>

        {/* Count */}
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((doc, idx) => {
              const m = categoryMeta[doc.category];
              const Icon = m.icon;
              return (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  className="group cursor-pointer rounded-2xl p-4 hud transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.border = `1px solid ${m.border}`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${m.bg}, 0 0 0 1px ${m.bg}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors"
                      style={{ background: m.bg, border: `1px solid ${m.border}` }}
                    >
                      <Icon size={22} style={{ color: m.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="shrink-0 rounded-md px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider"
                          style={{ background: m.bg, border: `1px solid ${m.border}`, color: m.color }}
                        >
                          {doc.category}
                        </span>
                        <span className="font-mono text-[10px] text-ink-600">
                          {doc.pages}p · {doc.size}
                        </span>
                      </div>
                      <h3 className="truncate font-display text-sm font-semibold text-white">
                        {doc.title}
                      </h3>
                      <p className="font-mono text-[10px] text-ink-600">{doc.reference}</p>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink-400">
                    {doc.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="mt-3 flex items-center justify-between border-t border-white/[0.04] pt-3">
                    <span className="font-mono text-[10px] text-ink-700">{doc.date}</span>
                    <span
                      className="font-mono text-[10px] transition-colors group-hover:opacity-100 opacity-0"
                      style={{ color: m.color }}
                    >
                      Abrir documento →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Search size={28} className="text-ink-700" />
            </div>
            <p className="font-display text-base font-semibold text-ink-500">Sin resultados</p>
            <p className="mt-1 font-mono text-xs text-ink-700">Prueba con otro término o categoría</p>
          </motion.div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}
