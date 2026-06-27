import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, RotateCcw, ChevronDown } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are Zara, a friendly and stylish AI fashion assistant for Shazora — a premium online fashion store. You help customers with:
- Outfit recommendations and styling tips
- Finding the right size or fit
- Product recommendations from our Men's and Women's collections
- Order tracking help (tell them to use the Track Order page with their SHZ- ID)
- Fashion trends and styling advice
- Return and policy questions

Keep responses concise, warm, and fashion-forward. Use emojis occasionally. Never make up specific product prices — suggest they browse the shop. If asked about orders, guide them to the Track Order page.`;

const SUGGESTED = [
  "What's trending this season? 🔥",
  "Help me pick an outfit for a date 💃",
  "How do I track my order?",
  "What's your return policy?",
];

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm **Zara**, your Shazora fashion assistant ✨ How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const updatedMessages = [...messages, { role: 'user', content: userText }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      if (!GEMINI_API_KEY) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: "Oops! It looks like my API key is missing. Please ask your developer to set `VITE_GEMINI_API_KEY` in the Vercel environment variables." },
        ]);
        setLoading(false);
        return;
      }

      // Build Gemini contents array (skip the initial assistant greeting for history)
      const history = updatedMessages.slice(0, -1).filter(m => m.role === 'user' || m.role === 'assistant');
      const contents = [];

      // Add system instruction as first user turn (Gemini 1.5 flash supports systemInstruction)
      for (const m of history) {
        contents.push({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        });
      }
      // Add current user message
      contents.push({ role: 'user', parts: [{ text: userText }] });

      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 400, temperature: 0.8 },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || 'Gemini API error');
      }

      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to help with that. Try browsing our collection!";

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      if (!open) setUnread(n => n + 1);
    } catch (err) {
      console.error('Zara AI error:', err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Sorry, I'm having a moment 😅 Please try again shortly!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([{ role: 'assistant', content: "Hi! I'm **Zara**, your Shazora fashion assistant ✨ How can I help you today?" }]);
  };

  const renderText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
      return part;
    });
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[1000] w-14 h-14 rounded-2xl bg-gradient-to-br from-magenta to-accent text-white shadow-[0_8px_32px_rgba(0,210,255,0.4)] flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="relative">
              <MessageCircle className="w-6 h-6" />
              {unread > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center">
                  {unread}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-[999] w-[360px] max-h-[560px] flex flex-col rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.4)] border border-white/10"
            style={{ background: 'linear-gradient(145deg, #161821, #0b0c10)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-magenta to-accent flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-black text-white text-sm">Zara AI</p>
                  <p className="text-[10px] text-accent font-bold uppercase tracking-widest">Powered by Gemini</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={reset} title="New chat" className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/10 transition-all">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setOpen(false)} className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/10 transition-all">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar" style={{ maxHeight: '360px' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-magenta to-accent flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-accent text-white rounded-tr-sm'
                        : 'bg-white/8 text-gray-200 rounded-tl-sm border border-white/5'
                    }`}
                  >
                    {renderText(msg.content)}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-magenta to-accent flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-white/8 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                        className="w-1.5 h-1.5 rounded-full bg-accent"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggested Chips (only at start) */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex gap-2 flex-wrap">
                {SUGGESTED.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-accent hover:text-white hover:border-accent transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-4 pt-2 border-t border-white/5">
              <div className="flex gap-2 bg-white/5 rounded-2xl border border-white/10 px-4 py-2 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/25 font-medium"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-magenta to-accent flex items-center justify-center disabled:opacity-30 transition-opacity flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </motion.button>
              </div>
              <p className="text-[9px] text-white/15 text-center mt-2 uppercase tracking-widest">Powered by Shazora AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
