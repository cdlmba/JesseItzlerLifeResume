import React from 'react';

const StartHere: React.FC = () => {
    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-green-600 to-green-900 p-12 md:p-24 text-white">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                        <circle cx="50" cy="50" r="40" />
                    </svg>
                </div>

                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-green-300 font-black uppercase tracking-[0.3em] text-[10px] mb-6 underline decoration-2 underline-offset-8">Mission Briefing</h2>
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-none mb-8 tracking-tighter">
                        BUILD A LIFE <br />
                        <span className="text-green-300">WORTH READING.</span>
                    </h1>
                    <p className="text-lg md:text-xl font-bold text-green-50/80 leading-relaxed mb-10 uppercase tracking-tight">
                        Stop living for the resume on your desk. Start living for the resume of your life.
                        This planner isn't about productivity—it's about intensity, memories, and uncommon standards.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                            <span className="text-2xl">⚡</span>
                            <span className="text-xs font-black uppercase tracking-widest">High Stakes</span>
                        </div>
                        <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                            <span className="text-2xl">🧠</span>
                            <span className="text-xs font-black uppercase tracking-widest">AI Performance Coach</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        title: "THE MISOGI",
                        tag: "THE ANCHOR",
                        desc: "One event a year that's 50/50. If you don't feel like you might fail, it's not a Misogi. It anchors your entire identity for the year.",
                        icon: "🏔️",
                        color: "border-red-600"
                    },
                    {
                        title: "KEVIN'S RULE",
                        tag: "THE RHYTHM",
                        desc: "Every 8 weeks, you do something unique. No work, no screens, just an experience that creates a permanent memory. 6 times a year.",
                        icon: "⌚",
                        color: "border-blue-500"
                    },
                    {
                        title: "THE BIG 4",
                        tag: "THE STANDARDS",
                        desc: "Health, Wealth, Relationship, and Self. We don't settle for 'good enough'. We set uncommon standards and protect them daily.",
                        icon: "🏆",
                        color: "border-green-500"
                    }
                ].map((item, idx) => (
                    <div key={idx} className={`bg-neutral-900 border-l-4 ${item.color} p-8 rounded-3xl group hover:bg-neutral-800 transition-all`}>
                        <div className="text-4xl mb-6">{item.icon}</div>
                        <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">{item.tag}</h4>
                        <h3 className="text-2xl font-black italic uppercase text-white mb-4">{item.title}</h3>
                        <p className="text-xs font-bold text-neutral-400 leading-relaxed uppercase">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* Getting Started Steps */}
            <section className="py-12 border-t border-white/5">
                <h2 className="text-2xl font-black italic uppercase mb-12 text-center text-white">CHART YOUR COURSE</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { step: "01", label: "PHASE 1", task: "Complete Your Prep Checklist", target: "prep" },
                        { step: "02", label: "PHASE 2", task: "Lock Your Misogi & Standards", target: "dashboard" },
                        { step: "03", label: "PHASE 3", task: "Date Your Calendar", target: "calendar" },
                        { step: "04", label: "PHASE 4", task: "Own Your Weekly Wins", target: "weekly" }
                    ].map((item, idx) => (
                        <div key={idx} className="relative p-6 glass-panel rounded-2xl flex flex-col items-center text-center group">
                            <span className="text-4xl font-black text-white/5 absolute -top-4 -left-2 italic">{item.step}</span>
                            <h4 className="text-[10px] font-black text-green-500 mt-4 mb-2 tracking-widest">{item.label}</h4>
                            <p className="text-sm font-bold text-white uppercase leading-tight">{item.task}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quote Section */}
            <section className="py-24 text-center">
                <blockquote className="max-w-4xl mx-auto">
                    <p className="text-4xl md:text-5xl font-black italic uppercase leading-none text-white/90 mb-8 italic">
                        "YOU DON'T GET TO CHOOSE HOW YOU'RE GOING TO DIE. OR WHEN. YOU CAN ONLY DECIDE HOW YOU'RE GOING TO LIVE. NOW."
                    </p>
                    <cite className="text-xs font-black uppercase tracking-[0.4em] text-red-600">— PREPARE TO LIVE UNCOMMON</cite>
                </blockquote>
            </section>
        </div>
    );
};

export default StartHere;
