
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
      const suggestion = await suggestMisogi(interests);
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
    const title = prompt(`Goal for ${cat}?`);
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

  const handleEditGoal = (goal: Goal) => {
    const newTitle = prompt(`Edit title:`, goal.title);
    if (newTitle === null) return;
    const newDesc = prompt(`Edit description:`, goal.description);
    if (newDesc === null) return;
    const updatedGoals = plan.big4.map(g => 
      g.id === goal.id ? { ...g, title: newTitle, description: newDesc } : g
    );
    handleUpdate({ big4: updatedGoals });
  };

  return (
    <div className="space-y-16 max-w-4xl mx-auto animate-in slide-in-from-bottom-6 duration-700 pb-24">
      <header className="text-center space-y-8">
        <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">The Blueprint</h2>
        <div className="group cursor-pointer text-center" onClick={() => setEditingTheme(true)}>
          <p className="text-4xl font-black text-white italic uppercase tracking-tighter">
            "{plan.theme || 'LIVING UNCOMMON'}"
          </p>
        </div>
      </header>

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
                  <div key={goal.id} onClick={() => handleEditGoal(goal)} className="flex flex-col gap-2 text-white bg-black p-5 rounded-2xl border border-white/5 cursor-pointer hover:border-red-600 transition-all">
                    <span className="text-sm font-black uppercase tracking-tight">{goal.title}</span>
                    {goal.description && <p className="text-[10px] text-neutral-500 uppercase font-bold italic">{goal.description}</p>}
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
