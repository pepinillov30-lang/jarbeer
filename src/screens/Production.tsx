import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Droplets, FlaskConical, Leaf, FileText, Check, Clock, User, Pencil, X, CheckCircle2, CircleDot, Plus, Loader2, Beaker } from 'lucide-react';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { productionData } from '../data/mockData';

type PdfState = 'idle'|'preparing'|'generating'|'done';

export function Production() {
  const [fields, setFields] = useState({
    batch: productionData.batch, brewer: productionData.brewer,
    startDate: productionData.startDate, plato: String(productionData.plato),
    ph: String(productionData.ph), currentTemp: String(productionData.currentTemp),
    observations: productionData.observations,
  });
  const [editing, setEditing] = useState<string|null>(null);
  const [pdfState, setPdfState] = useState<PdfState>('idle');
  const [maltas, setMaltas]   = useState(productionData.maltas.map((m,i)=>({...m,id:`m${i}`})));
  const [lupulos, setLupulos] = useState(productionData.lupulos.map((l,i)=>({...l,id:`l${i}`})));

  const handlePdf = () => {
    if (pdfState !== 'idle') return;
    setPdfState('preparing');
    setTimeout(()=>setPdfState('generating'), 1500);
    setTimeout(()=>setPdfState('done'), 3000);
    setTimeout(()=>setPdfState('idle'), 5200);
  };

  const stageIdx = ['Maceración','Filtrado','Ebullición','Whirlpool','Fermentación','Maduración','Envasado'].indexOf(productionData.stage);

  return (
    <div className="flex min-h-full flex-col pb-32">
      <ScreenHeader
        title="Ficha de Producción"
        subtitle={`Lote ${fields.batch} · ${productionData.recipe}`}
        right={
          <span className="rounded-lg px-3 py-1 font-mono text-[10px] uppercase tracking-wider"
            style={{ background:'rgba(0,225,255,0.07)', border:'1px solid rgba(0,225,255,0.18)', color:'#00e1ff' }}
          >{productionData.stage}</span>
        }
      />
      <div className="flex flex-col gap-4 px-4">

        {/* Timeline */}
        <GlassCard className="overflow-hidden px-0 py-0" corners delay={0.08}>
          <div className="flex overflow-x-auto px-4 pb-3 pt-4" style={{ scrollbarWidth:'none' }}>
            {productionData.timeline.map((item, i) => {
              const isCur  = i === stageIdx;
              const isDone = item.done;
              return (
                <div key={item.stage} className="flex shrink-0 flex-col items-center" style={{ minWidth:70 }}>
                  <div className="relative flex flex-col items-center">
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300"
                      style={{ background:isDone?'rgba(0,225,255,0.1)':isCur?'rgba(255,170,0,0.12)':'rgba(13,24,36,0.6)', border:isDone?'1.5px solid rgba(0,225,255,0.35)':isCur?'1.5px solid rgba(255,170,0,0.55)':'1px solid rgba(255,255,255,0.07)' }}
                    >
                      {isDone ? <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:500,damping:20}}><Check size={13} style={{color:'#00e1ff'}} strokeWidth={2.5}/></motion.div>
                        : isCur ? <CircleDot size={13} style={{color:'#FFAA00'}}/>
                        : <Clock size={11} style={{color:'rgba(74,96,112,0.45)'}}/>
                      }
                      {isCur && <motion.div className="absolute inset-0 rounded-full" style={{border:'1px solid rgba(255,170,0,0.38)'}} animate={{scale:[1,1.65],opacity:[0.55,0]}} transition={{duration:2,repeat:Infinity,ease:'easeOut'}}/>}
                    </div>
                    {i < productionData.timeline.length-1 && (
                      <div className="absolute left-[calc(50%+18px)] top-4 h-px" style={{width:34, background:isDone?'rgba(0,225,255,0.28)':'rgba(255,255,255,0.06)'}}/>
                    )}
                  </div>
                  <span className="mt-2 text-center font-mono text-[8px] leading-tight" style={{color:isDone?'#00e1ff':isCur?'#FFAA00':'rgba(74,96,112,0.45)',maxWidth:60}}>{item.stage}</span>
                </div>
              );
            })}
          </div>
          <div className="mx-4 mb-4 h-1 overflow-hidden rounded-full" style={{background:'rgba(255,255,255,0.05)'}}>
            <motion.div className="h-full rounded-full" style={{background:'linear-gradient(90deg,#00e1ff,#FFAA00)'}}
              initial={{width:0}} animate={{width:`${productionData.stageProgress}%`}} transition={{duration:1.2,delay:0.4,ease:[0.22,1,0.36,1]}}
            />
          </div>
        </GlassCard>

        {/* Datos generales */}
        <Sec title="Datos generales" icon={<FileText size={14}/>} delay={0.12}>
          <div className="grid grid-cols-2 gap-3">
            {([
              {key:'batch',      label:'Nº Lote',       icon:<FileText size={12}/>},
              {key:'brewer',     label:'Maestro',        icon:<User size={12}/>},
              {key:'startDate',  label:'Fecha inicio',   icon:<Clock size={12}/>},
              {key:'plato',      label:'°Plato',         icon:<Droplets size={12}/>},
              {key:'ph',         label:'pH',             icon:<Droplets size={12}/>},
              {key:'currentTemp',label:'Temperatura (°C)',icon:<Thermometer size={12}/>},
            ] as {key:string;label:string;icon:React.ReactNode}[]).map(({key,label,icon})=>(
              <EditField key={key} fkey={key} label={label} icon={icon}
                value={fields[key as keyof typeof fields]}
                isEditing={editing===key}
                onEdit={()=>setEditing(key)}
                onSave={v=>{setFields(p=>({...p,[key]:v}));setEditing(null);}}
                onCancel={()=>setEditing(null)}
              />
            ))}
          </div>
        </Sec>

        {/* Métricas técnicas */}
        <Sec title="Métricas técnicas" icon={<Beaker size={14}/>} delay={0.18}>
          <div className="grid grid-cols-3 gap-3">
            {[
              {l:'OG',  v:productionData.og.toFixed(3)},
              {l:'FG',  v:productionData.fg.toFixed(3)},
              {l:'ABV', v:`${productionData.abv}%`},
              {l:'IBU', v:String(productionData.ibu)},
              {l:'EBC', v:String(productionData.ebc)},
              {l:'CO₂', v:`${productionData.carbonation}`},
            ].map(m=>(
              <div key={m.l} className="rounded-xl p-3 text-center" style={{background:'rgba(0,135,255,0.05)',border:'1px solid rgba(0,135,255,0.1)'}}>
                <p className="font-mono text-[9px] uppercase tracking-wider" style={{color:'rgba(74,96,112,0.7)'}}>{m.l}</p>
                <p className="mt-1 font-display text-lg font-bold text-white">{m.v}</p>
              </div>
            ))}
          </div>
        </Sec>

        {/* Maltas */}
        <Sec title="Maltas" icon={<Leaf size={14}/>} delay={0.22} action={<AddBtn onClick={()=>setMaltas(p=>[...p,{id:`m${Date.now()}`,name:'Nueva malta',amount:'0 kg',ebc:0,supplier:'—'}])}/>}>
          <div className="space-y-2">
            {maltas.map(m=><IRow key={m.id} c1={m.name} c2={m.amount} c3={`EBC ${m.ebc}`} badge={m.supplier} accent="cyan"/>)}
          </div>
        </Sec>

        {/* Lúpulos */}
        <Sec title="Lúpulos" icon={<FlaskConical size={14}/>} delay={0.26} action={<AddBtn onClick={()=>setLupulos(p=>[...p,{id:`l${Date.now()}`,name:'Nuevo lúpulo',alpha:'0%',amount:'0 g',addition:'—'}])}/>}>
          <div className="space-y-2">
            {lupulos.map(l=><IRow key={l.id} c1={l.name} c2={l.amount} c3={l.alpha} badge={l.addition} accent="amber"/>)}
          </div>
        </Sec>

        {/* Levadura */}
        <Sec title="Levadura" icon={<Droplets size={14}/>} delay={0.30}>
          <div className="rounded-xl p-4" style={{background:'rgba(52,211,153,0.04)',border:'1px solid rgba(52,211,153,0.1)'}}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-base font-bold text-white">{productionData.levadura.name}</p>
                <p className="font-mono text-xs" style={{color:'rgba(74,96,112,0.7)'}}>{productionData.levadura.lab} · {productionData.levadura.format}</p>
              </div>
              <span className="rounded-lg px-2 py-1 font-mono text-[10px]" style={{background:'rgba(52,211,153,0.1)',border:'1px solid rgba(52,211,153,0.18)',color:'#34d399'}}>{productionData.levadura.attenuation}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div><p className="font-mono text-[9px] uppercase tracking-wider" style={{color:'rgba(74,96,112,0.6)'}}>Pitching</p><p className="mt-0.5 font-mono text-xs text-white">{productionData.levadura.pitch}</p></div>
              <div><p className="font-mono text-[9px] uppercase tracking-wider" style={{color:'rgba(74,96,112,0.6)'}}>Temp. rango</p><p className="mt-0.5 font-mono text-xs text-white">{productionData.levadura.tempRange}</p></div>
            </div>
          </div>
        </Sec>

        {/* Observaciones */}
        <Sec title="Observaciones" icon={<Pencil size={14}/>} delay={0.34}>
          {editing==='observations'
            ? <div className="space-y-2">
                <textarea value={fields.observations} onChange={e=>setFields(p=>({...p,observations:e.target.value}))}
                  className="w-full resize-none rounded-xl p-3 font-sans text-sm focus:outline-none" style={{minHeight:80,background:'rgba(13,24,36,0.7)',border:'1px solid rgba(0,225,255,0.3)',color:'#e8f0f8'}}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={()=>setEditing(null)} className="flex-1 rounded-xl py-2 font-mono text-xs" style={{background:'rgba(0,225,255,0.09)',border:'1px solid rgba(0,225,255,0.18)',color:'#00e1ff'}}>Guardar</button>
                  <button onClick={()=>setEditing(null)} className="flex-1 rounded-xl py-2 font-mono text-xs" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',color:'rgba(74,96,112,0.75)'}}>Cancelar</button>
                </div>
              </div>
            : <button onClick={()=>setEditing('observations')} className="w-full rounded-xl p-3 text-left transition-all duration-200" style={{background:'rgba(255,255,255,0.028)',border:'1px solid rgba(255,255,255,0.06)'}}>
                <p className="font-sans text-sm leading-relaxed" style={{color:'rgba(180,200,216,0.85)'}}>{fields.observations}</p>
                <div className="mt-2 flex items-center gap-1.5"><Pencil size={10} style={{color:'rgba(0,225,255,0.45)'}}/><span className="font-mono text-[9px]" style={{color:'rgba(74,96,112,0.55)'}}>Toca para editar</span></div>
              </button>
          }
        </Sec>

        {/* PDF */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}} className="pb-4 pt-2">
          <button onClick={handlePdf} disabled={pdfState!=='idle'}
            className="relative w-full overflow-hidden rounded-2xl py-4 font-display text-sm font-bold uppercase tracking-widest transition-all duration-300"
            style={{ background:pdfState==='done'?'rgba(52,211,153,0.1)':'rgba(0,225,255,0.07)', border:pdfState==='done'?'1px solid rgba(52,211,153,0.3)':'1px solid rgba(0,225,255,0.18)', color:pdfState==='done'?'#34d399':'#00e1ff' }}
          >
            <AnimatePresence mode="wait">
              {pdfState==='idle'      && <motion.span key="i" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-center justify-center gap-2"><FileText size={14}/> Generar PDF</motion.span>}
              {pdfState==='preparing' && <motion.span key="p" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin"/> Preparando...</motion.span>}
              {pdfState==='generating'&& <motion.span key="g" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin"/> Generando PDF...</motion.span>}
              {pdfState==='done'      && <motion.span key="d" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="flex items-center justify-center gap-2"><CheckCircle2 size={14}/> PDF listo</motion.span>}
            </AnimatePresence>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function Sec({title,icon,children,delay,action}:{title:string;icon:React.ReactNode;children:React.ReactNode;delay:number;action?:React.ReactNode}) {
  return (
    <GlassCard className="p-4" corners delay={delay}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><span style={{color:'#00e1ff'}}>{icon}</span><span className="font-display text-sm font-bold text-white">{title}</span></div>
        {action}
      </div>
      {children}
    </GlassCard>
  );
}

function AddBtn({onClick}:{onClick:()=>void}) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider"
      style={{background:'rgba(0,225,255,0.06)',border:'1px solid rgba(0,225,255,0.16)',color:'#00e1ff'}}
    ><Plus size={11}/> Añadir</button>
  );
}

function IRow({c1,c2,c3,badge,accent}:{c1:string;c2:string;c3:string;badge:string;accent:'cyan'|'amber'}) {
  const C = accent==='cyan'
    ? {border:'rgba(0,225,255,0.09)',bg:'rgba(0,225,255,0.04)',bb:'rgba(0,225,255,0.07)',bbc:'rgba(0,225,255,0.16)',bc:'#00e1ff'}
    : {border:'rgba(255,170,0,0.09)',bg:'rgba(255,170,0,0.04)',bb:'rgba(255,170,0,0.07)',bbc:'rgba(255,170,0,0.18)',bc:'#FFAA00'};
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-3" style={{background:C.bg,border:`1px solid ${C.border}`}}>
      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-sm font-medium text-white">{c1}</p>
        <p className="font-mono text-[10px]" style={{color:'rgba(74,96,112,0.65)'}}>{c2} · {c3}</p>
      </div>
      <span className="shrink-0 rounded-lg px-2 py-0.5 font-mono text-[10px]" style={{background:C.bb,border:`1px solid ${C.bbc}`,color:C.bc}}>{badge}</span>
    </div>
  );
}

function EditField({fkey,label,icon,value,isEditing,onEdit,onSave,onCancel}:{
  fkey:string;label:string;icon:React.ReactNode;value:string;
  isEditing:boolean;onEdit:()=>void;onSave:(v:string)=>void;onCancel:()=>void;
}) {
  const [draft,setDraft]=useState(value);
  if (isEditing) return (
    <div className="col-span-2 flex gap-2">
      <input value={draft} onChange={e=>setDraft(e.target.value)}
        className="flex-1 rounded-xl px-3 py-2 font-mono text-sm focus:outline-none"
        style={{background:'rgba(13,24,36,0.8)',border:'1px solid rgba(0,225,255,0.32)',color:'#e8f0f8'}}
        autoFocus onKeyDown={e=>{if(e.key==='Enter')onSave(draft);if(e.key==='Escape')onCancel();}}
      />
      <button onClick={()=>onSave(draft)} className="flex h-10 w-10 items-center justify-center rounded-xl" style={{background:'rgba(0,225,255,0.09)',border:'1px solid rgba(0,225,255,0.18)'}}><Check size={13} style={{color:'#00e1ff'}}/></button>
      <button onClick={onCancel} className="flex h-10 w-10 items-center justify-center rounded-xl" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}><X size={13} style={{color:'rgba(74,96,112,0.65)'}}/></button>
    </div>
  );
  return (
    <button onClick={onEdit}
      className="rounded-xl p-3 text-left transition-all duration-200"
      style={{background:'rgba(255,255,255,0.022)',border:'1px solid rgba(255,255,255,0.06)'}}
      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(0,225,255,0.18)';}}
      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.06)';}}
    >
      <div className="mb-1 flex items-center gap-1.5"><span style={{color:'rgba(0,225,255,0.45)'}}>{icon}</span><span className="font-mono text-[9px] uppercase tracking-wider" style={{color:'rgba(74,96,112,0.6)'}}>{label}</span></div>
      <p className="font-display text-sm font-semibold text-white">{value}</p>
    </button>
  );
}
