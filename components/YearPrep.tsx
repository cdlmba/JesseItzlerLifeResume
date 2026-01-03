
import React from 'react';
import { PrepItem } from '../types';

interface YearPrepProps {
  checklist: PrepItem[];
  onToggle: (id: string) => void;
}

const YearPrep: React.FC<YearPrepProps> = ({ checklist, onToggle }) => {
  const completedCount = checklist.filter(i => i.completed).length;
  const progress = (completedCount / checklist.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-700 pb-24">
      <header className="text-center space-y-6">
        <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">SYSTEMS CHECK</h2>
        <p className="text-neutral-500 max-w-lg mx-auto text-[11px] font-black uppercase tracking-[0.3em]">
          "Friction is the enemy. Clean the mechanism." 
        </p>
      </header>

      <div className="bg-neutral-900 p-10 rounded-[2.5rem] border border-white/5 sticky top-28 z-10 shadow-3xl">
        <div className="flex justify-between items-end mb-4">
          <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em]">Operational Readiness</span>
          <span className="text-4xl font-black text-white">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-black h-4 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-red-600 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(239,68,68,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {checklist.map((item) => (
          <div 
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`group flex items-start gap-8 p-8 rounded-[2rem] border transition-all cursor-pointer ${
              item.completed 
                ? 'bg-neutral-900/20 border-white/5 opacity-40' 
                : 'bg-black border-neutral-800 hover:border-red-600'
            }`}
          >
            <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
              item.completed ? 'bg-red-600 border-red-600 shadow-xl' : 'border-neutral-700'
            }`}>
              {item.completed && (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </div>
            <div>
              <h3 className={`text-xl font-black italic transition-all uppercase tracking-tighter ${item.completed ? 'text-neutral-700 line-through' : 'text-white'}`}>
                {item.task}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-2 leading-relaxed font-bold uppercase tracking-widest">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {progress === 100 && (
        <div className="p-12 bg-white rounded-[3rem] text-center shadow-3xl transform hover:scale-105 transition-all">
          <h3 className="text-4xl font-black text-black mb-4 italic uppercase tracking-tighter">YOU ARE READY.</h3>
          <p className="text-red-600 font-black uppercase text-[10px] tracking-[0.5em]">GO BUILD THE RESUME.</p>
        </div>
      )}
    </div>
  );
};

export default YearPrep;
