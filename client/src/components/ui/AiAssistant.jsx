import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, RotateCcw, ChevronDown } from 'lucide-react';
import { getPublicProducts } from '../../services/mongoApi';
import {
  buildStoreKnowledgePrompt,
  formatCatalogForPrompt,
  CONTACT_INFO,
  RETURN_POLICY,
  ORDER_TRACKING,
  STORE_INFO,
} from '../../data/shazoraKnowledge';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Gemini: valid free-tier model (gemini-flash-latest can 404 on newer keys)
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// Groq: OpenAI-compatible free tier — fast + higher free limits
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || 'openai/gpt-oss-120b';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const BASE_SYSTEM_PROMPT = `You are Zara, the official AI fashion & customer-care assistant for Shazora — a premium online fashion store.

YOUR JOB
- Answer ONLY with facts from the Shazora knowledge base and LIVE product catalog provided below.
- Be exact about product names, prices (USD), stock, policies, tracking, and contact details.
- If something is not in the knowledge base or catalog, say you are not sure and guide them to the correct page or ${CONTACT_INFO.email}. NEVER invent products, prices, or policies.
- Be warm, concise, and fashion-forward. Occasional emojis are fine. Keep replies short (2–6 sentences unless they need a list).

WHAT YOU CAN HELP WITH
- Product recommendations from Men's and Women's collections (use LIVE catalog names + exact prices)
- Order tracking: use Track Order page with SHZ- ID or phone used at checkout
- Return/refund policy (exact rules from knowledge base)
- Checkout, payment, account, privacy, terms questions
- Contact/support: ${CONTACT_INFO.email}, phone ${CONTACT_INFO.phone}, hours ${CONTACT_INFO.hours}

RULES
- Use exact product names and prices from the LIVE catalog when recommending.
- If a product is OUT OF STOCK (stock:0), say so and suggest similar in-stock items.
- Never make up sizes, colors, or materials — the catalog does not store those fields.
- Order tracking ID format is always SHZ-XXXXXXXX (example ${ORDER_TRACKING.example}).
- Return window is always ${RETURN_POLICY.window}.
- Point users to exact site paths (e.g. /track-order, /products/men, /return-policy).

${buildStoreKnowledgePrompt()}

=== LIVE PRODUCT CATALOG (use these exact names & prices) ===
{{CATALOG}}
=== END LIVE PRODUCT CATALOG ===`;

const SUGGESTED = [
  "What men's jackets do you have under $60? 🧥",
  'Recommend a party outfit for women 💃',
  'How do I track my order with SHZ ID?',
  'What is your return policy?',
  'Do you have formal suits?',
  'Contact support for my order',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function buildSystemPrompt(catalogText) {
  return BASE_SYSTEM_PROMPT.replace(
    '{{CATALOG}}',
    catalogText ||
    'Live catalog unavailable right now. Direct customers to /products, /products/men, or /products/women.'
  );
}

async function callGemini(systemPrompt, contents) {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { maxOutputTokens: 500, temperature: 0.6 },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || `Gemini HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
}

async function callGroq(systemPrompt, messages) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: 500,
      temperature: 0.6,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || `Groq HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data?.choices?.[0]?.message?.content?.trim() || null;
}

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm **Zara**, your Shazora fashion assistant ✨ I know our Men's & Women's collections, prices, order tracking, and return policy. How can I help?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const catalogRef = useRef('');
  const catalogLoadedRef = useRef(false);

  const loadCatalog = async (force = false) => {
    if (catalogLoadedRef.current && !force) return;
    try {
      const products = await getPublicProducts();
      catalogRef.current = formatCatalogForPrompt(products);
      catalogLoadedRef.current = true;
    } catch (err) {
      console.error('Zara catalog load error:', err);
      catalogRef.current = formatCatalogForPrompt([]);
      catalogLoadedRef.current = true;
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  useEffect(() => {
    if (open) {
      setUnread(0);
      loadCatalog();
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

    if (!catalogLoadedRef.current) {
      await loadCatalog();
    }

    const apiMessages = updatedMessages
      .slice(1, -1)
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }));
    apiMessages.push({ role: 'user', content: userText });

    const geminiContents = apiMessages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const systemPrompt = buildSystemPrompt(catalogRef.current);

    let reply = null;
    let lastError = null;

    // Gemini first, then Groq fallback
    const providers = [
      {
        name: 'Gemini',
        enabled: !!GEMINI_API_KEY,
        call: () => callGemini(systemPrompt, geminiContents),
      },
      {
        name: 'Groq',
        enabled: !!GROQ_API_KEY,
        call: () => callGroq(systemPrompt, apiMessages),
      },
    ];

    for (const provider of providers) {
      if (!provider.enabled) continue;

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          reply = await provider.call();
          if (reply) break;
          lastError = new Error('Empty response from model');
        } catch (err) {
          lastError = err;
          const status = err?.status;
          const isRetryable =
            status === 429 ||
            status === 503 ||
            status === 500 ||
            status === 408 ||
            /rate|quota|unavailable|overloaded|timeout/i.test(err?.message || '');
          if (!isRetryable || attempt === 2) break;
          await sleep(1000 * attempt);
        }
      }
      if (reply) break;
    }

    if (reply) {
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      if (!open) setUnread(n => n + 1);
    } else {
      console.error('Zara AI error:', lastError);
      const raw = lastError?.message || '';
      let friendly = "Sorry, I'm having a moment 😅 Please try again shortly!";
      if (/API key|API_KEY|permission|unauthorized|401|403/i.test(raw)) {
        friendly =
          "I can't reach my AI brain right now — the API key looks invalid or missing. Please check `VITE_GEMINI_API_KEY` / `VITE_GROQ_API_KEY` in Vercel.";
      } else if (/quota|rate|429|too many/i.test(raw)) {
        friendly = "I'm getting a lot of questions right now 😅 Please wait a few seconds and try again!";
      } else if (/not found|404|model/i.test(raw)) {
        friendly =
          "The AI model I'm using isn't available. Please ask your developer to update the model name in the environment variables.";
      } else {
        friendly = `I'm having trouble reaching my AI brain right now 😅 Here's official Shazora info:

**Orders:** Track with your ${ORDER_TRACKING.idFormat} on ${STORE_INFO.pages.trackOrder}. Statuses: ${ORDER_TRACKING.progressSteps.join(' → ')}. Estimated delivery: ${ORDER_TRACKING.estimatedDelivery}.

**Returns:** ${RETURN_POLICY.summary}

**Support:** ${CONTACT_INFO.email} | ${CONTACT_INFO.phone} | ${CONTACT_INFO.hours}

Browse collections at ${STORE_INFO.pages.shop}.`;
      }
      setMessages(prev => [...prev, { role: 'assistant', content: friendly }]);
    }

    setLoading(false);
  };

  const reset = () => {
    loadCatalog(true);
    setMessages([
      {
        role: 'assistant',
        content:
          "Hi! I'm **Zara**, your Shazora fashion assistant ✨ I know our Men's & Women's collections, prices, order tracking, and return policy. How can I help?",
      },
    ]);
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
                  <p className="text-[9px] text-blue-400 font-bold tracking-wider uppercase mt-0.5">Powered by Shazora AI</p>
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
                    className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
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
                  placeholder="Ask me anything about Shazora..."
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
