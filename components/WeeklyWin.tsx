
import React, { useState, useEffect } from 'react';
import { WeeklyWin, AnnualPlan, Goal } from '../types.ts';
import { CATEGORIES } from '../constants.tsx';
import { motion, AnimatePresence } from 'framer-motion';

interface WeeklyWinProps {
  annualPlan: AnnualPlan;
  weeklyWins: WeeklyWin[];
  onSave: (win: WeeklyWin) => void;
}

// Helper to get start of current week (Sunday)
const getWeekStart = (d: Date) => {
  const day = d.getDay();
  const diff = d.getDate() - day;
  const sun = new Date(d.setDate(diff));
  sun.setHours(0, 0, 0, 0);
  return sun.toLocaleDateString();
};

const WeeklyWinComponent: React.FC<WeeklyWinProps> = ({ annualPlan, weeklyWins, onSave }) => {
  const [mode, setMode] = useState<'planning' | 'reviewing'>('planning');
  const currentWeekDate = getWeekStart(new Date());

  // State for the specific weekly tasks associated with each Big 4 Category
  const [tasks, setTasks] = useState<Record<string, string>>({
    'Health': '', 'Wealth': '', 'Relationship': '', 'Self': ''
  });

  // State for tracking completion in Review mode
  const [completed, setCompleted] = useState<Record<string, boolean>>({
    'Health': false, 'Wealth': false, 'Relationship': false, 'Self': false
  });

  const [reflection, setReflection] = useState('');

  // Load existing data if found for this week
  useEffect(() => {
    const existing = weeklyWins.find(w => w.weekStart === currentWeekDate);
    if (existing) {
      const newTasks: Record<string, string> = {};
      const newCompleted: Record<string, boolean> = {};
      existing.big4Wins.forEach(w => {
        newTasks[w.category] = w.task;
        newCompleted[w.category] = w.completed;
      });
      setTasks(newTasks);
      setCompleted(newCompleted);
      setReflection(existing.reflections);

      // If we already have a planned win, default to reviewing mode
      if (existing.status === 'planned') {
        setMode('reviewing');
      }
    }
  }, [weeklyWins, currentWeekDate]);

  // Calculate score based on completion count
  const completedCount = Object.values(completed).filter(c => c).length;
  const score = Math.round((completedCount / 4) * 100);

  const handleSave = () => {
    const big4Wins = CATEGORIES.map(cat => ({
      category: cat,
      task: tasks[cat] || '',
      completed: completed[cat] || false
    }));

    onSave({
      id: Math.random().toString(36).substr(2, 9),
      weekStart: currentWeekDate,
      big4Wins,
      reflections: reflection,
      score: score,
      status: mode === 'planning' ? 'planned' : 'completed'
    });

    if (mode === 'reviewing') {
      alert(`Week Recorded! Score: ${score}%`);
    }
  };

  // Helper to find the main annual goal for a category
  const getAnnualGoal = (cat: string) => {
    return annualPlan.big4.find(g => g.category === cat)?.title || "No Annual Goal Set";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-6 duration-700 pb-32">
      <header className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            {mode === 'planning' ? 'Design The Week' : 'Win The Week'}
          </h2>
          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">
            {mode === 'planning' ? 'Set the intention. One step per goal.' : 'Binary Scoring. Did you execute?'}
          </p>
        </div>
        <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setMode('planning')}
            className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase transition-all tracking-widest ${mode === 'planning' ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
          >
            1. Plan
          </button>
          <button
            onClick={() => setMode('reviewing')}
            className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase transition-all tracking-widest ${mode === 'reviewing' ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
          >
            2. Review
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES.map((cat, idx) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-panel p-6 rounded-[2rem] border-l-[6px] relative overflow-hidden group transition-all ${mode === 'reviewing' && completed[cat] ? 'border-green-500 bg-green-900/10' : 'border-white/20'
              }`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{cat}</span>
              {mode === 'reviewing' && (
                <div
                  onClick={() => setCompleted({ ...completed, [cat]: !completed[cat] })}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${completed[cat] ? 'bg-green-500 border-green-500 text-black' : 'border-white/20 hover:border-white'
                    }`}
                >
                  {completed[cat] && <span className="font-bold">✓</span>}
                </div>
              )}
            </div>

            <div className="mb-6">
              <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wide mb-1">Annual Standard</p>
              <p className="text-lg font-black text-white uppercase italic leading-none opacity-80">
                "{getAnnualGoal(cat)}"
              </p>
            </div>

            <div className="space-y-2">
              <label className={`text-[9px] font-black uppercase tracking-wide transition-colors ${mode === 'reviewing' ? 'text-neutral-500' : 'text-red-500'}`}>
                {mode === 'planning' ? 'Micro-Win For This Week' : 'The Commitment'}
              </label>
              {mode === 'planning' ? (
                <input
                  value={tasks[cat]}
                  onChange={(e) => setTasks({ ...tasks, [cat]: e.target.value })}
                  placeholder={`What is one actionable step for ${cat}?`}
                  className="w-full bg-black/30 border-b border-white/10 px-0 py-2 text-sm font-bold text-white placeholder:text-neutral-700 outline-none focus:border-red-600 transition-colors"
                />
              ) : (
                <p className={`text-md font-bold ${tasks[cat] ? 'text-white' : 'text-neutral-600 italic'}`}>
                  {tasks[cat] || "No task set."}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-[2rem] border border-white/5 space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Weekly Reflection</label>
          {mode === 'reviewing' && (
            <div className="px-4 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
              Weekly Score: <span className={score >= 75 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-500'}>{score}%</span>
            </div>
          )}
        </div>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder={mode === 'planning' ? "Any anticipated obstacles? How will you overcome them?" : "What went well? What didn't? Be honest."}
          className="w-full bg-black/20 rounded-2xl p-4 text-sm font-medium text-white placeholder:text-neutral-700 outline-none h-24 resize-none"
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className={`px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 shadow-2xl ${mode === 'planning'
            ? 'bg-white text-black hover:bg-neutral-200'
            : 'bg-green-600 text-white hover:bg-green-500'
            }`}
        >
          {mode === 'planning' ? 'Lock In The Plan' : 'Submit Weekly Review'}
        </button>
      </div>

    </div>
  );
};

export default WeeklyWinComponent;
