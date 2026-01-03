
import React, { useState } from 'react';
import { AnnualPlan, Goal, BigEvent } from '../types.ts';
import { CATEGORIES } from '../constants.tsx';
import { suggestMisogi } from '../services/gemini.ts';

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
    const interests = prompt("What are you interested in?");
    if (!interests) return;
    setSuggesting(true);
    try {
      const suggestion = await suggestMisogi(interests, plan.theme);
      handleUpdate({
        misogi: { ...plan.misogi, title: suggestion.title, description: suggestion.description }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSuggesting(false);
    }
  };

  const handleAddGoal = (cat: typeof CATEGORIES[number]) => {
    const title = prompt(`Standard for ${cat}?`);
    if (title) {
      const description = prompt(`Description?`) || "";
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

  return (
    <div className="space-y-16 max-w-4xl mx-auto animate-in slide-in-from-bottom-6 duration-700 pb-24">
      <header className="text-center space-y-8">
        <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">The Blueprint</h2>
        <div className="group cursor-pointer text-center">
          {editingTheme ? (
            <div className="flex flex-col items-center gap-4">
              <input
                autoFocus
                value={themeInput}
                onChange={(e) => setThemeInput(e.target.value)}
                onBlur={() => {
                  handleUpdate({ theme: themeInput });
                  setEditingTheme(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdate({ theme: themeInput });
                    setEditingTheme(false);
                  }
                }}
                className="text-4xl font-black text-black bg-white px-6 py-2 uppercase italic tracking-tighter rounded-xl text-center"
              />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">PRESS ENTER TO LOCK IT IN</p>
            </div>
          ) : (
            <div onClick={() => setEditingTheme(true)}>
              <p className="text-4xl font-black text-white italic uppercase tracking-tighter group-hover:text-neutral-400 transition-colors">
                "{plan.theme || 'LIVING UNCOMMON'}"
              </p>
            </div>
          )}
        </div>
      </header>

      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">The Anchor (Misogi)</h3>
          <button
            onClick={handleSuggestMisogi}
            disabled={suggesting}
            className="text-[10px] font-black text-white/50 uppercase tracking-widest hover:text-red-500 transition-colors"
          >
            {suggesting ? 'CONSULTING GEMINI...' : 'GENERATE AI SUGGESTION'}
          </button>
        </div>

        <div className="bg-red-600 p-12 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>

          <div className="space-y-6 relative">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">The Challenge</label>
              <input
                value={plan.misogi.title}
                onChange={(e) => handleUpdate({ misogi: { ...plan.misogi, title: e.target.value } })}
                placeholder="What is your 50/50 challenge?"
                className="w-full bg-transparent border-none text-5xl font-black text-white uppercase italic placeholder:text-black/20 outline-none p-0 leading-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">The "Scare You" Factor</label>
              <textarea
                value={plan.misogi.description}
                onChange={(e) => handleUpdate({ misogi: { ...plan.misogi, description: e.target.value } })}
                placeholder="Every year needs one event where you have a 50% chance of failure."
                className="w-full bg-transparent border-none text-lg font-bold text-white uppercase tracking-tight placeholder:text-black/20 outline-none p-0 resize-none h-24"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              {['planned', 'in-progress', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleUpdate({ misogi: { ...plan.misogi, status: status as any } })}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${plan.misogi.status === status
                      ? 'bg-white text-red-600 shadow-xl scale-105'
                      : 'bg-black/20 text-white/60 hover:bg-black/30'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Big 4 Standards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORIES.map(cat => (
            <div key={cat} className="glass-panel p-8 rounded-3xl border-l-8 border-white group">
              <div className="flex items-center justify-between mb-8">
                <span className="font-black text-neutral-500 text-[10px] uppercase tracking-[0.3em]">{cat}</span>
                <button onClick={() => handleAddGoal(cat)} className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white font-bold">+</button>
              </div>
              <div className="space-y-4">
                {plan.big4.filter(g => g.category === cat).map(goal => (
                  <div key={goal.id} className="text-white bg-black p-5 rounded-2xl border border-white/5">
                    <span className="text-sm font-black uppercase tracking-tight">{goal.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AnnualPlanner;
