import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Heart, UserPlus, Phone } from 'lucide-react';
import { getMentalHealthResource } from '@/data/countries';

interface SupportChatProps {
  countryCode: string;
}

interface ChatMessage {
  id: number;
  sender: 'companion' | 'user';
  text: string;
}

const GROUNDING_PROMPTS = [
  "I'm here with you. You're not alone in this moment. What's happening for you right now?",
  "That sounds really hard. Thank you for sharing that with me. Can you tell me a bit more?",
  "I hear you, and what you're feeling matters. You're showing courage just by being here. How are you holding up?",
  "It's okay to feel this way. These feelings are heavy, but you don't have to carry them all at once. What would feel even a little bit helpful right now?",
  "You're doing the right thing by reaching out. Is there someone in your life you trust who you could call or text?",
  "You matter, and your safety matters. If things feel overwhelming, it's okay to call a crisis line — they're there for moments exactly like this.",
];

const QUICK_REPLIES = [
  "I feel overwhelmed",
  "I don't know what to do",
  "I'm scared",
  "I feel alone",
  "I want to talk to someone I trust",
  "Thank you, I feel a bit better",
];

export function SupportChat({ countryCode }: SupportChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);
  const mentalHealth = getMentalHealthResource(countryCode);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        { id: messageIdRef.current++, sender: 'companion', text: GROUNDING_PROMPTS[0] },
      ]);
      setPromptIndex(1);
    }
  }, [open, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { id: messageIdRef.current++, sender: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const nextPrompt = GROUNDING_PROMPTS[promptIndex % GROUNDING_PROMPTS.length];
    setPromptIndex((prev) => prev + 1);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: messageIdRef.current++, sender: 'companion', text: nextPrompt },
      ]);
    }, 800);
  };

  if (!open) {
    return (
      <div className="flex flex-col gap-2.5">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-5 py-4 text-base font-bold text-white shadow-md transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          <MessageCircle size={20} />
          Do you want to talk?
        </button>
        <p className="text-xs text-blue-600 leading-relaxed text-center px-2">
          A calming companion to help you through this moment. This is not therapy or a
          replacement for professional help.
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl bg-white border border-blue-200 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-600 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <Heart size={18} />
          <span className="font-bold text-sm">Calming Companion</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Close chat"
          className="text-white/80 hover:text-white p-1 -m-1"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="max-h-72 min-h-40 overflow-y-auto px-4 py-3 space-y-3 bg-blue-50/50"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-white border border-blue-100 text-gray-800 rounded-bl-md'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Quick replies */}
      <div className="px-3 py-2 border-t border-gray-100">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              onClick={() => handleSend(reply)}
              className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend(input);
            }}
            placeholder="Type how you're feeling..."
            aria-label="Message the calming companion"
            className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:ring-0 outline-none"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            aria-label="Send message"
            className="shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Reach out section */}
      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
        <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
          <UserPlus size={14} className="text-blue-600" />
          You could also reach out to:
        </p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => {
              const contact = prompt('Enter a phone number for someone you trust:');
              if (contact) {
                const ua = navigator.userAgent || '';
                if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) {
                  window.location.href = `tel:${contact}`;
                } else {
                  navigator.clipboard.writeText(contact).catch(() => {});
                }
              }
            }}
            className="rounded-lg bg-white border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors"
          >
            Call someone you trust
          </button>
          {mentalHealth.number && (
            <button
              onClick={() => {
                const ua = navigator.userAgent || '';
                const num = mentalHealth.number!;
                if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) {
                  window.location.href = `tel:${num}`;
                } else {
                  navigator.clipboard.writeText(num).catch(() => {});
                }
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-white border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors"
            >
              <Phone size={12} />
              Crisis line ({mentalHealth.number})
            </button>
          )}
        </div>
        <p className="mt-2.5 text-xs text-gray-500 leading-relaxed">
          This companion offers calming support, not professional therapy. If you may hurt
          yourself or someone else, please call your local emergency number now.
        </p>
      </div>
    </section>
  );
}
