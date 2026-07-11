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
import { initialChat, voiceCommands, defaultVoiceScenario } from './data/mockData';
import type { MicState } from './components/MicButton';
import { playSound } from './lib/sound';

const pageVariants = {
  initial: { opacity: 0, y: 16, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -12, filter: 'blur(4px)' },
};

const pageTransition = {
  duration: 0.38,
  ease: 'easeOut' as const,
};

export default function App() {
  const [booted, setBooted] = useState(false);
  const [screen, setScreen] = useState<Screen>('home');
  const [micState, setMicState] = useState<MicState>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>(initialChat);
  const [typing, setTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const micTimers = useRef<number[]>([]);

  const clearMicTimers = () => {
    micTimers.current.forEach(clearTimeout);
    micTimers.current = [];
  };

  const navigate = useCallback(
    (target: Screen) => {
      playSound('navigate', soundEnabled);
      setScreen(target);
    },
    [soundEnabled],
  );

  const handleMic = useCallback(() => {
    if (micState !== 'idle') return;
    clearMicTimers();
    playSound('listen', soundEnabled);
    setMicState('listening');

    // Pick a voice command scenario
    const scenario = defaultVoiceScenario;
    const now = () =>
      new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    // Listening → processing
    const t1 = setTimeout(() => {
      playSound('process', soundEnabled);
      setMicState('processing');
    }, 2200);

    // Processing → add user message + responding
    const t2 = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `u-${Date.now()}`, role: 'user', content: scenario.userText, timestamp: now() },
      ]);
      setTyping(true);
      setMicState('responding');
    }, 3800);

    // Responding → add assistant message
    const t3 = setTimeout(() => {
      playSound('confirm', soundEnabled);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: scenario.response,
          timestamp: now(),
          navigateTo: scenario.target,
        },
      ]);
      setTyping(false);
      setMicState('idle');

      // Navigate if applicable
      if (scenario.action === 'navigate' && scenario.target) {
        setTimeout(() => setScreen(scenario.target!), 600);
      }
    }, 5400);

    micTimers.current = [t1, t2, t3] as unknown as number[];
  }, [micState, soundEnabled]);

  const handleSend = useCallback(
    (text: string) => {
      const now = () =>
        new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => [
        ...prev,
        { id: `u-${Date.now()}`, role: 'user', content: text, timestamp: now() },
      ]);
      setTyping(true);

      // Match voice commands
      const lower = text.toLowerCase();
      const matched = voiceCommands.find((cmd) =>
        cmd.triggers.some((t) => lower.includes(t)),
      );

      const response = matched?.response ?? 'Comando recibido. Procesando solicitud.';
      const target = matched?.target;

      setTimeout(() => {
        playSound('confirm', soundEnabled);
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: response,
            timestamp: now(),
            navigateTo: target,
          },
        ]);
        setTyping(false);
        if (matched?.action === 'navigate' && target) {
          setTimeout(() => setScreen(target), 600);
        }
      }, 1200);
    },
    [soundEnabled],
  );

  const handleBoot = useCallback(() => {
    setBooted(true);
  }, []);

  return (
    <>
      <BackgroundFX />

      <AnimatePresence>
        {!booted && (
          <BootScreen
            key="boot"
            onComplete={handleBoot}
            soundEnabled={soundEnabled}
          />
        )}
      </AnimatePresence>

      {booted && (
        <div className="relative mx-auto flex h-[100dvh] max-w-2xl flex-col">
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={screen}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="min-h-full"
              >
                {screen === 'home' && (
                  <Home
                    micState={micState}
                    onMic={handleMic}
                    onNavigate={navigate}
                    soundEnabled={soundEnabled}
                    onToggleSound={() => setSoundEnabled((v) => !v)}
                  />
                )}
                {screen === 'production' && <Production />}
                {screen === 'documents' && <Documents />}
                {screen === 'assistant' && (
                  <Assistant
                    messages={messages}
                    micState={micState}
                    onMic={handleMic}
                    onSend={handleSend}
                    typing={typing}
                    onNavigate={navigate}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <BottomNav active={screen} onNavigate={navigate} />
        </div>
      )}
    </>
  );
}
