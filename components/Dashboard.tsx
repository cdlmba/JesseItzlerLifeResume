
import React from 'react';
import { AppState } from '../types.ts';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const { annualPlan, weeklyWins } = state;
  const lastWeeklyScore = weeklyWins.length > 0 ? weeklyWins[0].score : 0;
  
  const currentMonth = new Date().getMonth();
  const yearProgress = Math.round(((currentMonth + 1) / 12) * 100);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <section className="relative py-12 border-b border-white/10">
        <h2 className="text-[10px] font-black tracking-[0.5em] text-red-500 uppercase mb-4">Current Theme</h2>
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
          <h1 className="text-huge font-black italic uppercase italic">
            {annualPlan.theme || "Living Uncommon"}
          </h1>
          <div className="flex gap-4">
            <div className="bg-white text-black px-6 py-4 rounded-xl">
              <span className="block text-[10px] font-black uppercase tracking-widest opacity-50">Year Elapsed</span>
              <span className="text-3xl font-black">{yearProgress}%</span>
            </div>
            <div className="bg-red-600 text-white px-6 py-4 rounded-xl">
              <span className="block text-[10px] font-black uppercase tracking-widest opacity-70">Weekly Win Rate</span>
              <span className="text-3xl font-black">{lastWeeklyScore}/10</span>
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
                      Q{Math.ceil((i+1)/1.5)}
                    </span>
                    {event && <span className="text-[10px] font-bold text-neutral-500">{new Date(event.date).toLocaleDateString()}</span>}
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
          <h3 className="text-2xl font-black italic uppercase">The Anchor</h3>
          <div className="bg-red-600 p-8 rounded-3xl h-full flex flex-col justify-between shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
             </div>
             <div>
               <h4 className="text-4xl font-black uppercase italic leading-none mb-4">
                 {annualPlan.misogi.title || "No Anchor Set"}
               </h4>
               <p className="text-xs font-bold uppercase tracking-tight opacity-80 leading-relaxed">
                 {annualPlan.misogi.description || "Every year needs one event where you have a 50% chance of failure."}
               </p>
             </div>
             <div className="mt-8">
                <div className="w-full bg-black/20 h-2 rounded-full mb-2">
                   <div className={`h-full bg-white rounded-full ${annualPlan.misogi.status === 'completed' ? 'w-full' : 'w-1/4'}`}></div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Status: {annualPlan.misogi.status}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Standards Section */}
      <section className="pt-12">
        <h3 className="text-2xl font-black italic uppercase mb-8">The Big 4 Standards</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Health', 'Wealth', 'Relationship', 'Self'].map(cat => {
            const count = annualPlan.big4.filter(g => g.category === cat).length;
            return (
              <div key={cat} className="glass-panel p-6 rounded-2xl border-t-4 border-white">
                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2">{cat}</span>
                <span className="text-3xl font-black">{count}</span>
                <span className="text-[10px] font-bold block mt-1 uppercase opacity-40">Active Rules</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
