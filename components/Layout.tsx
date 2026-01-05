import React from 'react';
import AICoach from './AICoach.tsx';
import { AppState } from '../types.ts';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  state: AppState;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, state }) => {
  const [showCoach, setShowCoach] = React.useState(false);
  const tabs = [
    { id: 'start', label: 'Start Here', icon: '🚀', highlight: 'green' },
    { id: 'prep', label: 'Prep', icon: '📝', highlight: 'white' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'calendar', label: 'Big Annual Calendar', icon: '📅' },
    { id: 'weekly', label: 'Weekly Win', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="glass-panel sticky top-0 z-50 px-6 py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-black text-black text-xl shadow-lg group-hover:bg-red-600 group-hover:text-white transition-all">
            JI
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white">
            LIFE RESUME<span className="text-red-600 italic">.</span>
          </h1>
        </div>
        <nav className="hidden md:flex gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all px-3 py-1.5 rounded-lg ${activeTab === tab.id
                ? 'text-white bg-red-600'
                : tab.highlight === 'green'
                  ? 'text-black bg-green-500 hover:bg-green-400'
                  : tab.highlight === 'white'
                    ? 'text-black bg-white hover:bg-neutral-200'
                    : 'text-slate-500 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Floating AI Coach Trigger */}
      <button
        onClick={() => setShowCoach(!showCoach)}
        className="fixed bottom-8 left-8 z-[110] w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all border-2 border-slate-100"
      >
        <span>🧠</span>
      </button>

      {showCoach && (
        <AICoach state={state} isPopUp onClose={() => setShowCoach(false)} />
      )}

      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        {children}
      </main>

      <footer className="md:hidden glass-panel fixed bottom-0 left-0 right-0 flex justify-around py-4 z-50 border-t border-white/5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === tab.id ? 'text-red-500' : 'text-slate-600'
              }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </footer>
    </div>
  );
};

export default Layout;
