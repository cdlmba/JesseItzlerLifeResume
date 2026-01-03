
import React, { useState } from 'react';
import { WeeklyWin } from '../types.ts';

interface WeeklyWinProps {
  onSave: (win: WeeklyWin) => void;
}

const WeeklyWinComponent: React.FC<WeeklyWinProps> = ({ onSave }) => {
  const [nonNeg, setNonNeg] = useState<string[]>(['The First 60 Protocol (Daily)', 'Big 4: 45m Sweat', 'Relationship: One Meaningful Connect']);
  const [reflection, setReflection] = useState('');
  const [score, setScore] = useState(7);
  const [effort, setEffort] = useState(7); 

  const handleSave = () => {
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      weekStart: new Date().toLocaleDateString(),
      nonNegotiables: nonNeg.filter(n => n.trim() !== ''),
      reflections: reflection,
      score: Math.round((score + effort) / 2) 
    });
    setNonNeg(['The First 60 Protocol (Daily)', 'Big 4: 45m Sweat', 'Relationship: One Meaningful Connect']);
    setReflection('');
    setScore(7);
    setEffort(7);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in slide-in-from-right-6 duration-700 pb-32">
      <header className="text-center">
        <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">SEAL THE WIN</h2>
        <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.4em] mt-4">"Don't negotiate with your goals."</p>
      </header>

      <div className="glass-panel p-10 rounded-[2.5rem] space-y-12 relative overflow-hidden border-2 border-white/5">
        {/* Morning Protocol Focus */}
        <div className="bg-red-600 p-8 rounded-3xl relative group shadow-2xl overflow-hidden">
           <div className="absolute -top-3 -right-3 bg-black text-[10px] font-black text-white px-6 py-2 rounded-full shadow-2xl uppercase tracking-widest border border-white/10">PROTOCOL V0.1</div>
           <div className="flex items-center gap-6">
             <div className="text-5xl">🌅</div>
             <div>
               <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-1">Win the First 60</h4>
               <p className="text-[11px] text-black font-black uppercase italic leading-tight">No Phone • Hydration • Outdoor Light</p>
             </div>
           </div>
        </div>

        {/* Non-Negotiables */}
        <div className="space-y-6">
          <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">The Standards</label>
          <div className="space-y-4">
            {nonNeg.map((val, idx) => (
              <div key={idx} className="flex gap-4 items-center group">
                <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-sm font-black text-red-600 transition-all group-focus-within:border-red-600">
                  {idx + 1}
                </div>
                <input 
                  value={val}
                  onChange={(e) => {
                    const copy = [...nonNeg];
                    copy[idx] = e.target.value;
                    setNonNeg(copy);
                  }}
                  className="flex-1 bg-black border border-white/5 rounded-2xl px-6 py-4 text-white text-sm font-black focus:border-red-600 outline-none transition-all uppercase tracking-tight placeholder:text-neutral-800"
                  placeholder="SET STANDARD..."
                />
              </div>
            ))}
            <button 
              onClick={() => setNonNeg([...nonNeg, ''])}
              className="text-[10px] font-black text-white uppercase tracking-[0.2em] hover:text-red-500 transition-colors pl-16"
            >
              + ADD ANOTHER STANDARD
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
          <div className="space-y-6">
            <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Execution (1-10)</label>
            <div className="flex items-center gap-6">
              <input 
                type="range" min="1" max="10" step="1"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value))}
                className="flex-1 accent-red-600 h-2 bg-black rounded-full appearance-none cursor-pointer"
              />
              <span className="text-4xl font-black text-white w-10 text-center">{score}</span>
            </div>
          </div>
          <div className="space-y-6">
            <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">BROWN BAGGING EFFORT</label>
            <div className="flex items-center gap-6">
              <input 
                type="range" min="1" max="10" step="1"
                value={effort}
                onChange={(e) => setEffort(parseInt(e.target.value))}
                className="flex-1 accent-white h-2 bg-black rounded-full appearance-none cursor-pointer"
              />
              <span className="text-4xl font-black text-red-600 w-10 text-center">{effort}</span>
            </div>
          </div>
        </div>

        {/* Reflection */}
        <div className="space-y-6">
          <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Life Resume Log</label>
          <textarea 
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Did you build memories? Did you win the morning?"
            className="w-full bg-black border border-white/5 rounded-3xl px-8 py-6 text-white text-sm font-bold focus:border-red-600 outline-none h-40 resize-none placeholder:text-neutral-800 italic"
          />
        </div>

        <button 
          onClick={handleSave}
          className="w-full py-6 bg-white rounded-3xl font-black text-black text-sm uppercase tracking-[0.4em] shadow-2xl hover:bg-red-600 hover:text-white transition-all active:scale-[0.98]"
        >
          SUBMIT ENTRY
        </button>
      </div>
    </div>
  );
};

export default WeeklyWinComponent;
