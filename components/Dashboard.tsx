
import React from 'react';
import { AppState } from '../types';
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
      {/* Top Banner - Jesse Style */}
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
        {/* The 8-Week Clock */}
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
              <div className="col-span-2 py-16 text-center border-2 border-dashed border-neutral-800 rounded-3xl group cursor-pointer hover:border-red-600/30 transition-all">
                <p className="text-neutral-500 text-sm font-black uppercase tracking-[0.2em]">Your clock is empty</p>
                <p className="text-[10px] text-neutral-700 mt-2 italic">"If it's not on the calendar, it doesn't exist."</p>
              </div>
            )}
          </div>
        </div>

        {/* The Anchor: Misogi */}
        <div className="bg-red-600 p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 p-8 text-9xl opacity-[0.1] font-black italic select-none group-hover:opacity-[0.2] transition-all">🏔️</div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8">The Anchor</h3>
            <div className="bg-black p-8 rounded-2xl shadow-2xl">
              {annualPlan.misogi.title ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Misogi Confirmed</span>
                  </div>
                  <h4 className="text-3xl font-black text-white italic mb-4 leading-tight uppercase tracking-tighter">{annualPlan.misogi.title}</h4>
                  <p className="text-[11px] text-neutral-500 leading-relaxed mb-8 italic line-clamp-4">"{annualPlan.misogi.description}"</p>
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-neutral-600 uppercase">Success Rate</span>
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">50/50</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-neutral-500 text-xs font-black italic uppercase tracking-widest mb-6">"What scares you?"</p>
                  <button className="w-full py-4 bg-white rounded-xl text-xs font-black text-black uppercase tracking-[0.3em] hover:bg-neutral-200 transition-all active:scale-95">SET THE ANCHOR</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Big 4 Visualization */}
        <section className="glass-panel p-10 rounded-3xl border-t-8 border-white">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Big 4 Audit</h3>
            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Winning Only</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#171717" />
                <XAxis dataKey="name" stroke="#525252" fontSize={11} fontWeight="900" tickLine={false} axisLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #262626', borderRadius: '12px', fontSize: '11px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={48}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent Momentum */}
        <section className="glass-panel p-10 rounded-3xl border-t-8 border-red-600">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Momentum</h3>
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Brown Bagging It</span>
          </div>
          <div className="space-y-4">
            {weeklyWins.length > 0 ? (
              weeklyWins.slice(0, 4).map(win => (
                <div key={win.id} className="p-6 bg-neutral-900/50 rounded-2xl flex items-center justify-between border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-neutral-600 uppercase mb-1 tracking-widest">{win.weekStart}</span>
                    <span className="text-sm text-white font-bold italic line-clamp-1">"{win.reflections}"</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center text-lg font-black text-red-600 shadow-xl">
                    {win.score}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-neutral-600 italic text-sm font-bold uppercase tracking-widest">
                "Winning is a habit. So is losing."
                <br/><span className="text-red-600 mt-2 block">Log your first week.</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
