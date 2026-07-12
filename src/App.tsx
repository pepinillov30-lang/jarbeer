import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BackgroundFX } from './components/BackgroundFX';
import { BottomNav } from './components/BottomNav';
import { BootScreen } from './screens/BootScreen';
import { Home } from './screens/Home';
import { Production } from './screens/Production';
import { Documents } from './screens/Documents';
import { Assistant } from './screens/Assistant';
import type { Screen, ChatMessage } from './data/mockData';
import { initialChat, voiceCommands } from './data/mockData';
import type { MicState } from './components/MicButton';
import { playSound } from './lib/sound';

const PV = {
  initial: { opacity:0, y:14, filter:'blur(5px)' },
  animate: { opacity:1, y:0,  filter:'blur(0px)' },
  exit:    { opacity:0, y:-10, filter:'blur(4px)' },
};
const PT = { duration:0.37, ease:[0.22,1,0.36,1] as [number,number,number,number] };

export default function App() {
  const [booted, setBooted] = useState(false);
  const [screen, setScreen] = useState<Screen>('home');
  const [mic, setMic]       = useState<MicState>('idle');
  const [msgs, setMsgs]     = useState<ChatMessage[]>(initialChat);
  const [typing, setTyping] = useState(false);
  const [sound, setSound]   = useState(true);
  const timers              = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current=[]; };

  const navigate = useCallback((s: Screen) => {
    playSound('navigate', sound); setScreen(s);
  }, [sound]);

  const handleMic = useCallback(() => {
    if (mic !== 'idle') return;
    clearTimers();
    playSound('listen', sound);
    setMic('listening');
    const scenario = voiceCommands[0];
    const now = () => new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});

    timers.current.push(setTimeout(()=>{ playSound('process',sound); setMic('processing'); }, 2100));
    timers.current.push(setTimeout(()=>{
      setMsgs(p=>[...p,{id:`u${Date.now()}`,role:'user',content:scenario.userText,timestamp:now()}]);
      setTyping(true); setMic('responding');
    }, 3700));
    timers.current.push(setTimeout(()=>{
      playSound('confirm',sound);
      setMsgs(p=>[...p,{id:`a${Date.now()}`,role:'assistant',content:scenario.response,timestamp:now(),navigateTo:scenario.target}]);
      setTyping(false); setMic('idle');
      if(scenario.action==='navigate'&&scenario.target) setTimeout(()=>setScreen(scenario.target!),600);
    }, 5300));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mic, sound]);

  const handleSend = useCallback((text: string) => {
    const now = () => new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
    setMsgs(p=>[...p,{id:`u${Date.now()}`,role:'user',content:text,timestamp:now()}]);
    setTyping(true);
    const lower = text.toLowerCase();
    const match = voiceCommands.find(c=>c.triggers.some(t=>lower.includes(t)));
    const reply = match?.response ?? 'Comando recibido. Procesando en modo local.';
    setTimeout(()=>{
      playSound('confirm',sound);
      setMsgs(p=>[...p,{id:`a${Date.now()}`,role:'assistant',content:reply,timestamp:now(),navigateTo:match?.target}]);
      setTyping(false);
      if(match?.action==='navigate'&&match.target) setTimeout(()=>setScreen(match.target!),600);
    }, 1100);
  }, [sound]);

  return (
    <>
      <BackgroundFX/>
      <AnimatePresence>
        {!booted && <BootScreen key="boot" onComplete={()=>setBooted(true)} soundEnabled={sound}/>}
      </AnimatePresence>
      {booted && (
        <div className="relative mx-auto flex h-[100dvh] max-w-2xl flex-col">
          <div className="relative z-10 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div key={screen} variants={PV} initial="initial" animate="animate" exit="exit" transition={PT} className="min-h-full">
                {screen==='home'       && <Home micState={mic} onMic={handleMic} onNavigate={navigate} soundEnabled={sound} onToggleSound={()=>setSound(v=>!v)}/>}
                {screen==='production' && <Production/>}
                {screen==='documents'  && <Documents/>}
                {screen==='assistant'  && <Assistant messages={msgs} micState={mic} onMic={handleMic} onSend={handleSend} typing={typing} onNavigate={navigate}/>}
              </motion.div>
            </AnimatePresence>
          </div>
          <BottomNav active={screen} onNavigate={navigate} soundEnabled={sound}/>
        </div>
      )}
    </>
  );
}
