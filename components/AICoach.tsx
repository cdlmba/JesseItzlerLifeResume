
import React, { useState, useEffect, useRef } from 'react';
import { AppState } from '../types.ts';
import { getCoachAdvice } from '../services/gemini.ts';

interface AICoachProps {
  state: AppState;
}

const AICoach: React.FC<AICoachProps> = ({ state }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'coach', content: string}[]>([
    { role: 'coach', content: "I'm your coach. Ready to build your Life Resume? What's the block?" }
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

  return (
    <div className="max-w-4xl mx-auto h-[75vh] flex flex-col glass-panel rounded-[2.5rem] overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-8 py-6 rounded-[2rem] text-sm font-bold ${m.role === 'user' ? 'bg-red-600 text-white' : 'bg-neutral-900 text-neutral-200'}`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-8 bg-black border-t border-white/5 flex gap-4">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="flex-1 bg-neutral-900 border-2 border-neutral-800 rounded-2xl px-6 py-4 text-white font-bold" placeholder="Ask anything..." />
        <button onClick={handleSend} disabled={loading} className="px-10 py-4 bg-white rounded-2xl font-black text-black">SEND</button>
      </div>
    </div>
  );
};

export default AICoach;
