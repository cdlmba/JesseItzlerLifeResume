
import React, { useState, useEffect, useRef } from 'react';
import { AppState } from '../types';
import { getCoachAdvice } from '../services/gemini';

interface AICoachProps {
  state: AppState;
}

const AICoach: React.FC<AICoachProps> = ({ state }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'coach', content: string}[]>([
    { role: 'coach', content: "I'm your performance coach. Let's look at your Misogi and your Big 4. The clock is ticking. Ready to build your resume of life? What's the block?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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

  return (
    <div className="max-w-4xl mx-auto h-[75vh] flex flex-col glass-panel rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl">
      <header className="p-8 border-b border-white/5 bg-black/80 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-3xl shadow-xl shadow-red-600/20">🧠</div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">THE COACH</h2>
            <p className="text-[10px] text-neutral-500 uppercase font-black tracking-[0.2em] mt-1">Status: Brown Bagging It</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest border border-red-600 px-3 py-1 rounded-full">LIVE GUIDANCE</span>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-6 no-scrollbar bg-black/40">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-8 py-6 rounded-[2rem] text-sm font-bold leading-relaxed ${
              m.role === 'user' 
                ? 'bg-red-600 text-white rounded-tr-none shadow-xl' 
                : 'bg-neutral-900 text-neutral-200 rounded-tl-none border border-white/5'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-neutral-900 px-8 py-6 rounded-[2rem] rounded-tl-none border border-white/5">
               <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></div>
                 <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                 <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse [animation-delay:0.4s]"></div>
               </div>
             </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-black border-t border-white/5">
        <div className="flex gap-4">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="DON'T NEGOTIATE WITH YOUR GOALS. ASK ME ANYTHING..."
            className="flex-1 bg-neutral-900 border-2 border-neutral-800 rounded-2xl px-6 py-5 text-white font-bold focus:outline-none focus:border-red-600 transition-all uppercase tracking-tight placeholder:text-neutral-800"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="px-10 py-5 bg-white rounded-2xl font-black text-black shadow-2xl active:scale-95 transition-all uppercase tracking-widest hover:bg-red-600 hover:text-white"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
