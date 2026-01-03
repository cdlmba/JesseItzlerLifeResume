
import React, { useState } from 'react';
import { AnnualPlan, Goal, BigEvent } from '../types';
import { CATEGORIES } from '../constants';
import { suggestMisogi } from '../services/gemini';

interface AnnualPlannerProps {
  plan: AnnualPlan;
  onUpdate: (plan: AnnualPlan) => void;
}

const AnnualPlanner: React.FC<AnnualPlannerProps> = ({ plan, onUpdate }) => {
  const [editingTheme, setEditingTheme] = useState(false);
  const [themeInput, setThemeInput] = useState(plan.theme);
  const [suggesting, setSuggesting] = useState(false);

  const handleUpdate = (updates: Partial<AnnualPlan>) => {
    onUpdate({ ...plan, ...updates });
  };

  const handleSuggestMisogi = async () => {
    const interests = prompt("What are you interested in? (e.g., fitness, travel, survival, skills)");
    if (!interests) return;

    setSuggesting(true);
    try {
      const suggestion = await suggestMisogi(interests);
      handleUpdate({
        misogi: {
          ...plan.misogi,
          title: suggestion.title,
          description: suggestion.description
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSuggesting(false);
    }
  };

  const handleAddGoal = (cat: typeof CATEGORIES[number]) => {
    const title = prompt(`What is your non-negotiable standard for ${cat}?`);
    if (title) {
      const description = prompt(`Add a short description for this ${cat} goal:`) || "";
      const newGoal: Goal = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        category: cat,
        completed: false
      };
      handleUpdate({ big4: [...plan.big4, newGoal] });
    }
  };

  const handleEditGoal = (goal: Goal) => {
    const newTitle = prompt(`Edit the standard for ${goal.category}:`, goal.title);
    if (newTitle === null) return;
    
    const newDesc = prompt(`Edit the description for this goal:`, goal.description);
    if (newDesc === null) return;

    const updatedGoals = plan.big4.map(g => 
      g.id === goal.id ? { ...g, title: newTitle, description: newDesc } : g
    );
    handleUpdate({ big4: updatedGoals });
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm("Remove this goal from your Big 4?")) {
      handleUpdate({ big4: plan.big4.filter(g => g.id !== id) });
    }
  };

  const handleAddEvent = () => {
    const title = prompt(`Describe the epic experience (Kevin's Rule):`);
    if (title) {
      const newEvent: BigEvent = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        date: new Date().toISOString(),
        description: 'Scheduled for the Life Resume'
      };
      handleUpdate({ kevinRuleEvents: [...plan.kevinRuleEvents, newEvent] });
    }
  };

  return (
    <div className="space-y-16 max-w-4xl mx-auto animate-in slide-in-from-bottom-6 duration-700 pb-24">
      <header className="text-center space-y-8">
        <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">The Blueprint</h2>
        <div className="flex flex-col items-center">
          {editingTheme ? (
            <div className="flex gap-4">
              <input 
                value={themeInput} 
                onChange={(e) => setThemeInput(e.target.value)}
                className="bg-black border-red-600 border-2 rounded-2xl px-8 py-4 text-white focus:outline-none font-black italic text-2xl uppercase tracking-tight"
                placeholder="Yearly Theme"
              />
              <button 
                onClick={() => { handleUpdate({ theme: themeInput }); setEditingTheme(false); }}
                className="bg-white px-8 py-4 rounded-2xl font-black uppercase text-xs text-black hover:bg-red-600 hover:text-white transition-all"
              >
                SAVE
              </button>
            </div>
          ) : (
            <div className="group cursor-pointer text-center" onClick={() => setEditingTheme(true)}>
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] block mb-4 group-hover:text-red-400 transition-colors">THE PRIMARY FOCUS</span>
              <p className="text-4xl font-black text-white italic transition-all group-hover:scale-105 uppercase tracking-tighter">
                "{plan.theme || 'LIVING UNCOMMON'}"
              </p>
            </div>
          )}
        </div>
      </header>

      {/* The Big 4 */}
      <section className="space-y-10">
        <div className="flex items-center gap-6">
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Big 4 Standards</h3>
          <div className="h-[2px] flex-1 bg-white/5"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORIES.map(cat => (
            <div key={cat} className="glass-panel p-8 rounded-3xl border-l-8 border-white hover:border-red-600 transition-all group">
              <div className="flex items-center justify-between mb-8">
                <span className="font-black text-neutral-500 text-[10px] uppercase tracking-[0.3em] group-hover:text-red-500 transition-colors">{cat}</span>
                <button onClick={() => handleAddGoal(cat)} className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white hover:bg-red-600 transition-all font-bold">+</button>
              </div>
              <div className="space-y-4">
                {plan.big4.filter(g => g.category === cat).map(goal => (
                  <div key={goal.id} className="flex flex-col gap-2 text-white bg-black p-5 rounded-2xl border border-white/5 group/goal relative overflow-hidden">
                    <div className="flex items-center gap-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>
                      <span className="text-sm font-black uppercase tracking-tight flex-1">{goal.title}</span>
                      <div className="flex gap-2 opacity-0 group-hover/goal:opacity-100 transition-opacity">
                         <button 
                          onClick={() => handleEditGoal(goal)}
                          className="text-neutral-600 hover:text-white transition-colors"
                          title="Edit Goal"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-neutral-600 hover:text-red-600 transition-colors"
                          title="Delete Goal"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </div>
                    {goal.description && (
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest pl-6 italic leading-relaxed">
                        {goal.description}
                      </p>
                    )}
                  </div>
                ))}
                {plan.big4.filter(g => g.category === cat).length === 0 && (
                  <p className="text-neutral-700 text-[10px] font-black uppercase tracking-[0.2em] italic py-4">Status: Incomplete...</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Anchor: Misogi */}
      <section className="bg-black p-12 rounded-[3rem] border-4 border-red-600 relative overflow-hidden group shadow-[0_0_50px_rgba(239,68,68,0.1)]">
        <div className="absolute top-0 right-0 p-12 text-9xl opacity-[0.03] font-black italic select-none group-hover:opacity-[0.06] transition-all">MISOGI</div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">The Anchor</h3>
            {!plan.misogi.title && (
              <button 
                onClick={handleSuggestMisogi}
                disabled={suggesting}
                className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl text-[10px] font-black text-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 group/suggest"
              >
                <span className={suggesting ? 'animate-spin' : 'group-hover/suggest:scale-125 transition-transform'}>⚡</span>
                {suggesting ? 'PROCESSING...' : 'GENERATE MISOGI'}
              </button>
            )}
          </div>
          <p className="text-neutral-500 font-bold text-xs uppercase tracking-[0.3em] mb-12 italic">"One event. 50% Failure. Infinite Growth."</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-neutral-600 uppercase mb-4 tracking-[0.2em]">Misogi Title</label>
                <input 
                  value={plan.misogi.title}
                  onChange={(e) => handleUpdate({ misogi: { ...plan.misogi, title: e.target.value } })}
                  placeholder="e.g. 50-MILE ULTRA"
                  className="w-full bg-neutral-900 border-2 border-neutral-800 rounded-2xl px-8 py-5 text-white font-black italic uppercase text-xl focus:border-red-600 outline-none transition-all placeholder:text-neutral-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-neutral-600 mb-4 tracking-[0.2em] uppercase">The Stakes</label>
                <textarea 
                   value={plan.misogi.description}
                   onChange={(e) => handleUpdate({ misogi: { ...plan.misogi, description: e.target.value } })}
                   placeholder="Why are you doing this?"
                   className="w-full bg-neutral-900 border-2 border-neutral-800 rounded-2xl px-8 py-5 text-white font-bold text-sm focus:border-red-600 outline-none h-40 resize-none transition-all italic placeholder:text-neutral-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-neutral-600 uppercase mb-4 tracking-[0.2em]">Execution Date</label>
                <input 
                  type="date"
                  value={plan.misogi.date}
                  onChange={(e) => handleUpdate({ misogi: { ...plan.misogi, date: e.target.value } })}
                  className="w-full bg-neutral-900 border-2 border-neutral-800 rounded-2xl px-8 py-5 text-white font-black focus:border-red-600 outline-none transition-all [color-scheme:dark]"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center text-center bg-neutral-900/50 rounded-[2.5rem] border border-white/5 p-12 shadow-inner">
              <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-5xl mb-10 shadow-2xl rotate-[-6deg] group-hover:rotate-0 transition-transform">🏆</div>
              <h4 className="text-white font-black text-2xl italic uppercase mb-8 tracking-tighter">STATUS: {plan.misogi.status}</h4>
              <div className="flex flex-col w-full gap-4">
                <button 
                  onClick={() => handleUpdate({ misogi: { ...plan.misogi, status: 'planned' } })}
                  className={`py-4 rounded-2xl text-[10px] font-black tracking-[0.3em] transition-all ${plan.misogi.status === 'planned' ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'bg-black text-neutral-600 hover:text-white border border-white/5'}`}
                >
                  PLANNED
                </button>
                <button 
                  onClick={() => handleUpdate({ misogi: { ...plan.misogi, status: 'in-progress' } })}
                  className={`py-4 rounded-2xl text-[10px] font-black tracking-[0.3em] transition-all ${plan.misogi.status === 'in-progress' ? 'bg-white text-black shadow-xl shadow-white/10' : 'bg-black text-neutral-600 hover:text-white border border-white/5'}`}
                >
                  IN PROGRESS
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 8-Week Clock */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">8-Week Clock</h3>
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mt-2">Life-First Calendar Logic</span>
          </div>
          <button onClick={handleAddEvent} className="bg-white hover:bg-red-600 hover:text-white text-[10px] font-black text-black px-10 py-5 rounded-2xl transition-all uppercase tracking-[0.3em]">
            + LOG EXPERIENCE
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plan.kevinRuleEvents.map((event, idx) => (
            <div key={event.id} className="glass-panel p-8 rounded-3xl flex items-center justify-between group hover:border-red-600 transition-all">
              <div className="flex items-center gap-8">
                <span className="text-neutral-800 font-black text-6xl group-hover:text-red-600/20 transition-all italic">{idx + 1}</span>
                <div>
                  <h4 className="text-white font-black text-xl group-hover:text-red-600 transition-colors italic uppercase tracking-tighter">{event.title}</h4>
                  <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] mt-1">Memory Entry</p>
                </div>
              </div>
              <button 
                onClick={() => handleUpdate({ kevinRuleEvents: plan.kevinRuleEvents.filter(e => e.id !== event.id) })}
                className="text-neutral-700 hover:text-red-600 transition-colors p-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          ))}
          {plan.kevinRuleEvents.length === 0 && (
            <div className="col-span-2 p-20 border-4 border-dashed border-neutral-900 rounded-[3rem] text-center">
              <p className="text-neutral-700 font-black uppercase tracking-[0.3em] text-sm mb-4">Clock is ticking...</p>
              <p className="text-[10px] text-neutral-800 italic uppercase font-black">"Memories are the only currency."</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AnnualPlanner;
