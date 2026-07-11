import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { MicButton, type MicState } from '../components/MicButton';
import type { ChatMessage, Screen } from '../data/mockData';

interface AssistantProps {
  messages: ChatMessage[];
  micState: MicState;
  onMic: () => void;
  onSend: (text: string) => void;
  typing: boolean;
  onNavigate: (s: Screen) => void;
}

export function Assistant({ messages, micState, onMic, onSend, typing }: AssistantProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }), 50);
    }
  }, [messages, typing]);

  const handleSend = () => {
    const val = inputRef.current?.value.trim();
    if (!val) return;
    onSend(val);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex h-full flex-col pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 px-4 pt-[env(safe-area-inset-top)] pb-3"
      >
        <div
          className="flex items-center gap-4 rounded-2xl px-4 py-3"
          style={{
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Avatar size={52} active={micState !== 'idle'} responding={micState === 'responding'} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-base font-bold text-white">J.A.R.B.E.E.R.</h1>
              <Sparkles size={13} className="text-cyan-400/70" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="live-dot" />
              <span className="font-mono text-[11px] text-emerald-400">Asistente activo</span>
            </div>
          </div>
          <div
            className="rounded-xl px-3 py-1.5 text-center"
            style={{ background: 'rgba(0,225,255,0.06)', border: '1px solid rgba(0,225,255,0.15)' }}
          >
            <p className="font-mono text-[9px] uppercase tracking-widest text-ink-500">Modelo</p>
            <p className="font-mono text-[11px] font-bold text-cyan-300">JAR-1.0</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div ref={scrollRef} className="no-scrollbar flex-1 overflow-y-auto px-4 py-2">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          <AnimatePresence>
            {typing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-end gap-3"
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{ background: 'rgba(0,225,255,0.08)', border: '1px solid rgba(0,225,255,0.15)' }}
                >
                  <Avatar size={32} />
                </div>
                <div
                  className="rounded-2xl rounded-bl-md px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex gap-1.5 items-center h-4">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: '#00e1ff' }}
                        animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input + Mic */}
      <div className="px-4">
        <div className="mx-auto max-w-2xl space-y-4">
          {/* Text input */}
          <div
            className="flex items-center gap-2 rounded-2xl p-2"
            style={{
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <input
              ref={inputRef}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Escribe un comando o pregunta..."
              className="flex-1 bg-transparent px-3 font-mono text-sm text-white placeholder:text-ink-700 focus:outline-none"
            />
            <motion.button
              onClick={handleSend}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
              style={{
                background: 'rgba(0,225,255,0.1)',
                border: '1px solid rgba(0,225,255,0.2)',
                color: '#00e1ff',
              }}
              aria-label="Enviar"
            >
              <Send size={17} />
            </motion.button>
          </div>

          {/* Mic */}
          <div className="flex justify-center pb-2">
            <MicButton state={micState} onPress={onMic} size="large" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ background: 'rgba(0,225,255,0.08)', border: '1px solid rgba(0,225,255,0.15)' }}
        >
          <Avatar size={32} />
        </div>
      )}

      <div className={`max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`rounded-2xl px-4 py-3 ${isUser ? 'rounded-br-md' : 'rounded-bl-md'}`}
          style={
            isUser
              ? {
                  background: 'linear-gradient(135deg, rgba(250,106,0,0.15), rgba(180,50,0,0.1))',
                  border: '1px solid rgba(250,106,0,0.25)',
                }
              : {
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }
          }
        >
          <p className="text-sm leading-relaxed text-white">{message.content}</p>
        </div>
        <span className="font-mono text-[9px] text-ink-700 px-1">{message.timestamp}</span>
      </div>
    </motion.div>
  );
}
