
import React from 'react';
import { PrepItem } from '../types.ts';

interface YearPrepProps {
  checklist: PrepItem[];
  onToggle: (id: string) => void;
}

const YearPrep: React.FC<YearPrepProps> = ({ checklist, onToggle }) => {
  const completedCount = checklist.filter(i => i.completed).length;
  const progress = (completedCount / checklist.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-24">
      <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase text-center">SYSTEMS CHECK</h2>
      <div className="bg-neutral-900 p-10 rounded-[2.5rem] border border-white/5">
        <div className="w-full bg-black h-4 rounded-full overflow-hidden">
          <div className="h-full bg-red-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="space-y-4">
        {checklist.map((item) => (
          <div key={item.id} onClick={() => onToggle(item.id)} className={`p-8 rounded-[2rem] border cursor-pointer ${item.completed ? 'opacity-40' : 'bg-black border-neutral-800'}`}>
            <h3 className="text-xl font-black italic uppercase text-white">{item.task}</h3>
            <p className="text-[11px] text-neutral-500 mt-2 font-bold uppercase">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearPrep;
