import React from 'react';
import { suggestMisogi } from '../services/gemini.ts';
import { AppState, AnnualPlan, Goal } from '../types.ts';
import { CATEGORIES } from '../constants.tsx';

interface DashboardProps {
  state: AppState;
  onUpdate: (plan: AnnualPlan) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onUpdate }) => {
  const { annualPlan, weeklyWins } = state;
  const [editingMisogi, setEditingMisogi] = React.useState(false);
  const [suggesting, setSuggesting] = React.useState(false);

  const lastWeeklyScore = weeklyWins.length > 0 ? weeklyWins[0].score : 0;

  const now = new Date();
  const startYear = new Date(now.getFullYear(), 0, 0);
  const diffTime = now.getTime() - startYear.getTime();
  const dayOfYear = Math.floor(diffTime / 86400000);
  const yearProgress = Math.round((dayOfYear / 365) * 100);

  const handleUpdatePlan = (updates: Partial<AnnualPlan>) => {
    onUpdate({ ...annualPlan, ...updates });
  };

  const handleSuggestMisogi = async () => {
    const interests = prompt("What are you interested in?");
    if (!interests) return;
    setSuggesting(true);
    try {
      const suggestion = await suggestMisogi(interests, annualPlan.theme);
      handleUpdatePlan({
        misogi: { ...annualPlan.misogi, title: suggestion.title, description: suggestion.description }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSuggesting(false);
    }
  };

  const handleAddGoal = (cat: typeof CATEGORIES[number]) => {
    const title = prompt(`Enter Standard for ${cat}:`);
    if (title) {
      const newGoal: Goal = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description: "",
        category: cat,
        completed: false
      };
      handleUpdatePlan({ big4: [...annualPlan.big4, newGoal] });
    }
  };

  const handleRemoveGoal = (id: string) => {
    handleUpdatePlan({ big4: annualPlan.big4.filter(g => g.id !== id) });
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <section className="relative py-12 border-b border-white/10">
        <h2 className="text-[10px] font-black tracking-[0.5em] text-red-500 uppercase mb-4">Current Theme</h2>
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
          <h1 className="text-huge font-black italic uppercase italic">
            {annualPlan.theme || "Living Uncommon"}
          </h1>
          <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex-1 md:min-w-[300px]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Year Progress</span>
                <span className="text-sm font-black text-white italic">{yearProgress}%</span>
              </div>
              <div className="h-4 bg-black/40 rounded-full overflow-hidden p-1 border border-white/5">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${yearProgress}%` }}
                />
              </div>
              <p className="text-[8px] font-bold text-white/20 uppercase mt-2 tracking-tighter">Day {Math.floor(((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000))} of 365</p>
            </div>

            <div className="bg-red-600 text-white px-8 py-6 rounded-2xl flex flex-col justify-center min-w-[200px] shadow-[0_10px_30px_rgba(220,38,38,0.3)]">
              <span className="block text-[10px] font-black uppercase tracking-widest opacity-70">Weekly Win Rate</span>
              <span className="text-4xl font-black italic">{lastWeeklyScore}%</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* The 8-Week Clock */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black italic uppercase">The 8-Week Clock</h3>
            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Kevin's Rule</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => {
              const event = annualPlan.kevinRuleEvents[i];
              return (
                <div key={i} className={`p-6 rounded-2xl border ${event ? 'border-red-600/50 bg-neutral-900' : 'border-white/5 bg-black'} group transition-all hover:border-white/20`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black group-hover:bg-red-600 group-hover:text-white transition-colors">
                      Q{Math.ceil((i + 1) / 1.5)}
                    </span>
                    {event && (
                      <span className="text-[10px] font-bold text-neutral-500">
                        {(() => {
                          const idxStr = event.date?.split(',')[0];
                          if (!idxStr) return '';
                          const idx = Number(idxStr);
                          const date = new Date(annualPlan.year, 0, 1 + idx);
                          return date.toLocaleDateString();
                        })()}
                      </span>
                    )}
                  </div>
                  {event ? (
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight mb-1">{event.title}</h4>
                      <p className="text-[10px] text-neutral-500 uppercase line-clamp-1">{event.description}</p>
                    </div>
                  ) : (
                    <div className="opacity-20">
                      <h4 className="text-sm font-black uppercase tracking-tight mb-1">Unscheduled Slot</h4>
                      <p className="text-[10px] uppercase">Book an experience</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* The Anchor (Misogi) */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black italic uppercase text-white">The Anchor</h3>
            <div className="flex gap-2">
              <button onClick={handleSuggestMisogi} disabled={suggesting} className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-white transition-colors">
                {suggesting ? 'THINKING...' : 'AI SUGGEST'}
              </button>
              <button
                onClick={() => setEditingMisogi(!editingMisogi)}
                className="text-[9px] font-black uppercase tracking-widest text-white/50 hover:text-white"
              >
                {editingMisogi ? '[ DONE ]' : '[ EDIT ]'}
              </button>
            </div>
          </div>

          <div className="bg-red-600 p-8 rounded-3xl h-full flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            </div>

            <div className="space-y-4">
              {editingMisogi ? (
                <div className="space-y-4">
                  <input
                    value={annualPlan.misogi.title}
                    onChange={(e) => handleUpdatePlan({ misogi: { ...annualPlan.misogi, title: e.target.value } })}
                    placeholder="Misogi Title"
                    className="w-full bg-black/20 border-none text-2xl font-black uppercase italic text-white placeholder:text-white/30 rounded-lg p-3 outline-none"
                  />
                  <textarea
                    value={annualPlan.misogi.description}
                    onChange={(e) => handleUpdatePlan({ misogi: { ...annualPlan.misogi, description: e.target.value } })}
                    placeholder="Misogi Description"
                    className="w-full bg-black/20 border-none text-xs font-bold uppercase text-white placeholder:text-white/30 rounded-lg p-3 h-24 resize-none outline-none"
                  />
                  <div className="flex gap-2">
                    {['planned', 'in-progress', 'completed'].map(s => (
                      <button
                        key={s}
                        onClick={() => handleUpdatePlan({ misogi: { ...annualPlan.misogi, status: s as any } })}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase ${annualPlan.misogi.status === s ? 'bg-white text-red-600' : 'bg-black/20 text-white'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <h4 className="text-4xl font-black uppercase italic leading-none mb-4">
                    {annualPlan.misogi.title || "No Anchor Set"}
                  </h4>
                  <p className="text-xs font-bold uppercase tracking-tight opacity-80 leading-relaxed">
                    {annualPlan.misogi.description || "Every year needs one event where you have a 50% chance of failure."}
                  </p>
                </>
              )}
            </div>
            {!editingMisogi && (
              <div className="mt-8">
                <div className="w-full bg-black/20 h-2 rounded-full mb-2">
                  <div className={`h-full bg-white rounded-full transition-all duration-1000 ${annualPlan.misogi.status === 'completed' ? 'w-full' : annualPlan.misogi.status === 'in-progress' ? 'w-1/2' : 'w-1/4'}`}></div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Status: {annualPlan.misogi.status}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Standards Section */}
      <section className="pt-12">
        <h3 className="text-2xl font-black italic uppercase mb-8 text-white">The Big 4 Standards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => {
            const rules = annualPlan.big4.filter(g => g.category === cat);
            return (
              <div key={cat} className="glass-panel p-6 rounded-3xl border-t-4 border-white flex flex-col h-full bg-neutral-900/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">{cat}</span>
                  <button onClick={() => handleAddGoal(cat)} className="w-8 h-8 rounded-full bg-white text-black font-black flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">+</button>
                </div>

                <div className="flex-1 space-y-3">
                  {rules.map(rule => (
                    <div key={rule.id} className="group relative bg-black/40 p-3 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                      <p className="text-[10px] font-black uppercase text-white/80 leading-tight pr-4">{rule.title}</p>
                      <button
                        onClick={() => handleRemoveGoal(rule.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[8px] text-red-500 font-black"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {rules.length === 0 && (
                    <div className="border-2 border-dashed border-white/5 rounded-2xl py-8 flex items-center justify-center opacity-20">
                      <span className="text-[8px] font-black uppercase tracking-widest">No Rules Set</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
