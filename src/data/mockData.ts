export type Screen = 'home' | 'production' | 'documents' | 'assistant';

export const bootSequence = [
  { label: 'AI CORE',           icon: '◈', delay: 480, color: '#FFAA00' },
  { label: 'VOICE ENGINE',      icon: '◉', delay: 460, color: '#00e1ff' },
  { label: 'DOCUMENT VAULT',    icon: '▣', delay: 500, color: '#0087ff' },
  { label: 'PRODUCTION MODULE', icon: '⬡', delay: 520, color: '#00e1ff' },
  { label: 'MEMORY',            icon: '◎', delay: 440, color: '#34d399' },
  { label: 'LOCAL MODE',        icon: '⬢', delay: 480, color: '#FFAA00' },
];

export const systemStatus = {
  state: 'Operativo',
  uptime: '14d 06:42',
  activeBatch: 'Golden Ale 26-017',
  temperature: 64.5,
  targetTemp: 66.0,
  nextTask: 'Medir °Plato',
  network: 'Conectado',
  alerts: 0,
  docsIndexed: 6,
  aiModel: 'JAR-1.0',
  aiStatus: 'Activo',
};

export type RecipeStage = 'Maceración'|'Filtrado'|'Ebullición'|'Whirlpool'|'Fermentación'|'Maduración'|'Envasado';

export const productionData = {
  batch: '26-017', recipe: 'Golden Ale', brewer: 'Juanfran',
  startDate: '2026-07-09', stage: 'Fermentación' as RecipeStage,
  stageProgress: 68, volume: 500,
  currentTemp: 64.5, targetTemp: 66.0,
  plato: 12.4, ph: 5.2,
  og: 1.052, fg: 1.012, abv: 5.2, ibu: 28, ebc: 8, carbonation: 2.6,
  observations: 'Fermentación activa. Sin anomalías. Aroma a frutas tropicales notable en burbujeo.',
  maltas: [
    { name: 'Malta Pilsner',  amount: '90 kg',  ebc: 3,  supplier: 'Weyermann' },
    { name: 'Malta Caramelo', amount: '15 kg',  ebc: 60, supplier: 'Weyermann' },
    { name: 'Copos de avena', amount: '10 kg',  ebc: 2,  supplier: 'Simpsons' },
  ],
  lupulos: [
    { name: 'Cascade',    alpha: '6.8%',  amount: '500 g', addition: '60 min' },
    { name: 'Cascade',    alpha: '6.8%',  amount: '300 g', addition: '15 min' },
    { name: 'Centennial', alpha: '10.2%', amount: '200 g', addition: 'Whirlpool' },
  ],
  levadura: { name: 'Nottingham', lab: 'Lallemand', format: 'Seca · 11 g', pitch: '11 g', attenuation: '75–80%', tempRange: '14–21 °C' },
  timeline: [
    { stage: 'Maceración',  done: true,  temp: 67,   duration: '60 min' },
    { stage: 'Filtrado',    done: true,  temp: 78,   duration: '15 min' },
    { stage: 'Ebullición',  done: true,  temp: 100,  duration: '60 min' },
    { stage: 'Whirlpool',   done: true,  temp: 85,   duration: '10 min' },
    { stage: 'Fermentación',done: false, temp: 64.5, duration: '7 días' },
    { stage: 'Maduración',  done: false, temp: 0,    duration: '14 días' },
    { stage: 'Envasado',    done: false, temp: 0,    duration: '2 h' },
  ],
};

export type DocCategory = 'Receta'|'COA'|'Insumo'|'Levadura'|'Factura'|'Historial';

export interface DocItem {
  id: string; title: string; category: DocCategory;
  reference: string; date: string; pages: number; excerpt: string; size?: string;
}

export const documents: DocItem[] = [
  { id:'doc-1', title:'Receta Golden Ale',          category:'Receta',    reference:'REC-GA-001',   date:'2026-07-01', pages:4,  size:'840 KB', excerpt:'Ficha técnica completa. Perfil sensorial, maltas, lúpulos y curva de temperaturas.' },
  { id:'doc-2', title:'COA Cascade 2026',           category:'COA',       reference:'COA-CSC-2026', date:'2026-06-22', pages:2,  size:'320 KB', excerpt:'Certificado de análisis del lote Cascade. Alfa-ácidos 6.8%, aceites y trazabilidad.' },
  { id:'doc-3', title:'Malta Pilsner — Ficha Técnica', category:'Insumo', reference:'INS-PLS-014',  date:'2026-06-15', pages:3,  size:'620 KB', excerpt:'Especificación técnica malta Pilsner. Color EBC, humedad, extracto y poder diastásico.' },
  { id:'doc-4', title:'Levadura Nottingham',        category:'Levadura',  reference:'LEV-NOT-007',  date:'2026-06-10', pages:2,  size:'290 KB', excerpt:'Hoja técnica cepa Nottingham. Rango fermentación, atenuación y recomendaciones.' },
  { id:'doc-5', title:'Historial de lotes 2026',    category:'Historial', reference:'HIS-ALL-2026', date:'2026-07-09', pages:12, size:'1.8 MB', excerpt:'Registro completo de lotes 2026. Métricas, desviaciones y notas de cata.' },
  { id:'doc-6', title:'Factura Weyermann Julio',    category:'Factura',   reference:'FAC-WEY-0726', date:'2026-07-05', pages:1,  size:'180 KB', excerpt:'Factura insumos malteros julio 2026. Malta Pilsner 90 kg, Caramelo 15 kg.' },
];

export interface ChatMessage {
  id: string; role: 'user'|'assistant'; content: string; timestamp: string; navigateTo?: Screen;
}

export const initialChat: ChatMessage[] = [
  { id:'m1', role:'assistant', timestamp:'09:41',
    content:'Sistema en línea. Soy J.A.R.B.E.E.R., tu asistente de producción. Puedo abrir lotes, consultar recetas, registrar métricas y guiarte en cada etapa. ¿Cómo puedo ayudarte?' },
];

export interface VoiceCommand {
  triggers: string[]; userText: string; response: string;
  action?: 'navigate'; target?: Screen;
}

export const voiceCommands: VoiceCommand[] = [
  { triggers:['golden','producción','lote','abre'], userText:'JarBeer, abre la Golden.',
    response:'Abriendo ficha de producción. Lote 26-017 — Golden Ale — activo, fermentación al 68%.',
    action:'navigate', target:'production' },
  { triggers:['temperatura','temp'],    userText:'¿Cuál es la temperatura actual?', response:'Temperatura actual: 64.5 °C. Objetivo: 66.0 °C. Dentro de rango operativo.' },
  { triggers:['documentos','biblioteca'], userText:'Muéstrame los documentos.',
    response:'Abriendo biblioteca documental. 6 documentos disponibles.', action:'navigate', target:'documents' },
  { triggers:['cascade','lúpulo'],      userText:'Buscar Cascade.',
    response:'Localizando COA Cascade 2026. Referencia COA-CSC-2026. Abriendo biblioteca.', action:'navigate', target:'documents' },
  { triggers:['ipa','receta ipa'],      userText:'Abrir receta IPA.',
    response:'Buscando receta IPA en la biblioteca.', action:'navigate', target:'documents' },
  { triggers:['nuevo lote','empieza'],  userText:'Empieza una Golden de 500 litros.', response:'Lote creado. Ficha preparada. Próximo paso: preparar maceración.' },
];

export const quickActions: {
  id: Screen; label: string; description: string; icon: string; value?: string;
}[] = [
  { id:'production', label:'Producción',  description:'Golden Ale 26-017 · Fermentación', icon:'FlaskConical', value:'68%' },
  { id:'documents',  label:'Documentos',  description:'6 archivos indexados',               icon:'Library',      value:'6' },
  { id:'assistant',  label:'Asistente IA',description:'Comando de voz activo',              icon:'MessageSquare',value:'ON' },
];
