
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'prep', label: 'Prep', icon: '📝' },
    { id: 'annual', label: 'Annual Plan', icon: '📅' },
    { id: 'weekly', label: 'Weekly Win', icon: '⚡' },
    { id: 'coach', label: 'AI Coach', icon: '🧠' },
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
        <nav className="hidden md:flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === tab.id ? 'text-red-600 border-b-2 border-red-600 pb-1' : 'text-slate-500 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        {children}
      </main>

      <footer className="md:hidden glass-panel fixed bottom-0 left-0 right-0 flex justify-around py-4 z-50 border-t border-white/5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === tab.id ? 'text-red-500' : 'text-slate-600'
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
