
import React, { useState, useEffect, useRef } from 'react';
import { AppState } from '../types.ts';
import { getCoachAdvice } from '../services/gemini.ts';

import ReactMarkdown from 'react-markdown';

interface AICoachProps {
  state: AppState;
  onClose?: () => void;
  isPopUp?: boolean;
}

const AICoach: React.FC<AICoachProps> = ({ state, onClose, isPopUp }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'coach', content: string }[]>([
    { role: 'coach', content: "I'm your performance coach. The clock is ticking. What's the block?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    const advice = await getCoachAdvice(state.annualPlan, state.weeklyWins, userMsg);
    setMessages(prev => [...prev, { role: 'coach', content: advice }]);
    setLoading(false);
  };

  const containerClasses = isPopUp
    ? "fixed bottom-8 left-8 w-[400px] h-[600px] z-[100] flex flex-col glass-panel rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 animate-in slide-in-from-bottom-4 duration-300"
    : "max-w-4xl mx-auto h-[75vh] flex flex-col glass-panel rounded-[2.5rem] overflow-hidden";

  return (
    <div className={containerClasses}>
      {isPopUp && (
        <div className="bg-neutral-900 px-8 py-4 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-lg">🧠</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Coach Jesse</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white font-black text-xs">CLOSE X</button>
        </div>
      )}
      <div ref={scrollRef} className={`flex-1 overflow-y-auto p-8 space-y-6 ${isPopUp ? 'p-6' : 'p-10'}`}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-6 py-4 rounded-[1.5rem] text-sm font-bold leading-relaxed ${m.role === 'user'
              ? 'bg-red-600 text-white'
              : 'bg-neutral-900 text-neutral-200'}`}>
              {m.role === 'coach' ? (
                <div className="prose prose-invert prose-p:leading-relaxed prose-headings:mb-2 prose-headings:mt-4 prose-headings:text-white prose-ul:list-disc prose-li:ml-4 text-xs">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : (
                <span className="text-xs">{m.content}</span>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-neutral-900 px-6 py-3 rounded-full flex gap-2 items-center">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>
      <div className={`${isPopUp ? 'p-4' : 'p-8'} bg-black border-t border-white/5 flex gap-2`}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask for advice..." className="flex-1 bg-neutral-900 border-2 border-neutral-800 rounded-xl px-4 py-3 text-white font-bold text-xs outline-none focus:border-red-600 transition-colors" />
        <button onClick={handleSend} disabled={loading} className="px-6 py-3 bg-white rounded-xl font-black text-black text-xs hover:bg-neutral-200 transition-colors">SEND</button>
      </div>
    </div>
  );
};

export default AICoach;
