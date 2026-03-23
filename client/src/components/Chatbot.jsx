import { useState, useRef, useEffect } from 'react';

// Typing indicator animation (three pulsing dots)
const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-indigo-400"
        style={{
          animation: 'chatbot-bounce 1.2s infinite ease-in-out',
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
  </div>
);

// Individual chat bubble
const ChatBubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1">
          AI
        </div>
      )}
      <div
        className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-white/10 backdrop-blur-sm border border-white/10 text-slate-200 rounded-bl-sm'
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! 👋 I'm your AI Tutor. Ask me anything — coding, SQL, aptitude, concepts — I'm here to help!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg = { role: 'user', content: trimmed };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setMessages([...updatedHistory, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes chatbot-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes chatbot-slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .chatbot-window {
          animation: chatbot-slide-up 0.25s ease forwards;
        }
        @keyframes chatbot-pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.6); }
          70%  { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
        .chatbot-fab {
          animation: chatbot-pulse-ring 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* ── FLOATING ACTION BUTTON ── */}
      <button
        id="chatbot-fab"
        onClick={() => setIsOpen((o) => !o)}
        className="chatbot-fab fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-indigo-500/50 active:scale-95 focus:outline-none"
        aria-label="Toggle AI Tutor chat"
        title="AI Tutor"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* ── CHAT WINDOW ── */}
      {isOpen && (
        <div
          id="chatbot-window"
          className="chatbot-window fixed bottom-24 right-6 z-[9998] w-[360px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)] flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10"
          style={{ background: 'rgba(10, 12, 20, 0.92)', backdropFilter: 'blur(24px)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-gradient-to-r from-indigo-600/30 to-purple-600/20 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              AI
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-none">AI Tutor</p>
              <p className="text-indigo-300 text-xs mt-0.5">Powered by Mistral · Always ready</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="text-emerald-400 text-xs font-medium">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {messages.map((msg, idx) => (
              <ChatBubble key={idx} msg={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1">
                  AI
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl rounded-bl-sm">
                  <TypingIndicator />
                </div>
              </div>
            )}
            {error && (
              <div className="text-center">
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 inline-block">
                  ⚠️ {error}
                </p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="flex items-end gap-2 px-4 py-4 border-t border-white/10 flex-shrink-0">
            <textarea
              ref={inputRef}
              id="chatbot-input"
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything…"
              disabled={isLoading}
              className="flex-1 resize-none bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/40 transition-all duration-200 min-h-[44px] max-h-24 disabled:opacity-50"
              style={{ lineHeight: '1.4' }}
            />
            <button
              id="chatbot-send"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 flex-shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Send"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
