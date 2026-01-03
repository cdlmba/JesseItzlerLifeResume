
import React from 'react';
import { AppState } from '../types.ts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const { annualPlan, weeklyWins } = state;
  
  const categoryData = [
    { name: 'Health', score: 85 },
    { name: 'Wealth', score: 70 },
    { name: 'Relationship', score: 90 },
    { name: 'Self', score: 65 },
  ];

  const COLORS = ['#ef4444', '#ffffff', '#737373', '#262626'];

  const lastWeeklyScore = weeklyWins.length > 0 ? weeklyWins[0].score : 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      {/* Top Banner */}
      <div className="bg-white p-1 rounded-3xl">
        <div className="bg-black p-8 rounded-[calc(1.5rem+4px)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-2">Build Your Life Resume</h2>
            <p className="text-4xl font-black text-white italic leading-none">"{annualPlan.theme || 'LIVING UNCOMMON'}"</p>
          </div>
          <div className="flex gap-6">
             <div className="text-center bg-neutral-900 px-8 py-4 rounded-2xl border border-white/5">
               <span className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Year Elapsed</span>
               <span className="text-2xl font-black text-white">{Math.round((new Date().getMonth() + 1) / 12 * 100)}%</span>
             </div>
             <div className="text-center bg-white px-8 py-4 rounded-2xl">
               <span className="block text-[10px] font-bold text-black uppercase tracking-widest mb-1">Win Rate</span>
               <span className="text-2xl font-black text-red-600">{lastWeeklyScore}/10</span>
             </div>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-10 rounded-3xl border-l-8 border-red-600">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">The 8-Week Clock</h3>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Six Epic Experiences. Zero Regrets.</p>
            </div>
            <div className="bg-white text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">KEVIN'S RULE</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {annualPlan.kevinRuleEvents.length > 0 ? (
              annualPlan.kevinRuleEvents.map((event, i) => (
                <div key={event.id} className="group relative p-6 bg-neutral-900 rounded-2xl border border-white/5 hover:border-red-600/50 transition-all">
                  <span className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-xs font-black text-white shadow-xl rotate-[-4deg] group-hover:rotate-0 transition-transform">
                    {i + 1}
                  </span>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-black text-white uppercase text-sm tracking-tight">{event.title}</h4>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">Life Resume Entry</p>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-16 text-center border-2 border-dashed border-neutral-800 rounded-3xl">
                <p className="text-neutral-500 text-sm font-black uppercase tracking-[0.2em]">Your clock is empty</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-red-600 p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between group">
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8">The Anchor</h3>
            <div className="bg-black p-8 rounded-2xl shadow-2xl">
              {annualPlan.misogi.title ? (
                <>
                  <h4 className="text-3xl font-black text-white italic mb-4 uppercase tracking-tighter">{annualPlan.misogi.title}</h4>
                  <p className="text-[11px] text-neutral-500 italic line-clamp-4">"{annualPlan.misogi.description}"</p>
                </>
              ) : (
                <p className="text-white/50 text-xs font-black uppercase tracking-widest">No Anchor Set</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
