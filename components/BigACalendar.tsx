
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppState } from '../types.ts';

interface BigACalendarProps {
    state: AppState;
}

const BigACalendar: React.FC<BigACalendarProps & { onUpdate?: (plan: any) => void }> = ({ state, onUpdate }) => {
    const { annualPlan } = state;
    const currentYear = annualPlan.year;
    const [editMode, setEditMode] = React.useState(false);
    const [selectedType, setSelectedType] = React.useState<'none' | 'misogi' | 'kevin' | 'foundation'>('none');

    const handleDateClick = (dateIndex: number) => {
        if (!editMode || !onUpdate) return;

        const dateStr = String(dateIndex);
        const newPlan = { ...annualPlan };

        // Helper to remove date from All lists
        const clearDate = (d: string) => {
            if (newPlan.misogi.date === d) newPlan.misogi.date = "";
            newPlan.nonNegotiableDates = newPlan.nonNegotiableDates.filter(x => x !== d);
            newPlan.kevinRuleEvents = newPlan.kevinRuleEvents.map(e => {
                if (!e || !e.date) return e;
                const dates = e.date.split(',').filter(x => x !== d);
                return { ...e, date: dates.join(',') };
            });
        };

        // 1. Clear existing generic assignments for this date
        clearDate(dateStr);

        // 2. Apply new type
        if (selectedType === 'misogi') {
            newPlan.misogi.date = dateStr;
        } else if (selectedType === 'foundation') {
            newPlan.nonNegotiableDates.push(dateStr);
        } else if (selectedType === 'kevin') {
            // Find first empty slot or just append to the first one for simplicity in this quick-edit mode
            // For a robust app, we might want a modal. For now, we assign to the first event or create a dummy one if full.
            let found = false;
            for (let i = 0; i < 6; i++) {
                if (newPlan.kevinRuleEvents[i]) {
                    // simplistic: just add to the first event for now to mark the "day"
                    // In reality, user might want to pick WHICH adventure. 
                    // Users can refine in the specific tab.
                    const current = newPlan.kevinRuleEvents[i].date ? newPlan.kevinRuleEvents[i].date.split(',') : [];
                    current.push(dateStr);
                    newPlan.kevinRuleEvents[i].date = current.join(',');
                    found = true;
                    break;
                }
            }
        }

        onUpdate(newPlan);
    };

    const days = useMemo(() => {
        // ... existing logic ...
        const start = new Date(currentYear, 0, 1);
        const result = [];
        for (let i = 0; i < 365; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            result.push({
                index: i,
                date: d,
                isMisogi: annualPlan.misogi.date === String(i),
                isKevinRule: annualPlan.kevinRuleEvents.some(e => e && e.date && e.date.split(',').includes(String(i))),
                isNonNegotiable: annualPlan.nonNegotiableDates.includes(String(i)),
                isToday: d.toDateString() === new Date().toDateString(),
                isPast: d < new Date() && d.toDateString() !== new Date().toDateString()
            });
        }
        return result;
    }, [annualPlan, currentYear]);

    const nextKevinEvent = useMemo(() => {
        const todayIndex = Math.floor((new Date().getTime() - new Date(currentYear, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
        // Safe check for invalid dates
        return annualPlan.kevinRuleEvents
            .filter(e => e && e.date && !isNaN(Number(e.date.split(',')[0])) && Number(e.date.split(',')[0]) >= todayIndex)
            .sort((a, b) => Number(a.date.split(',')[0]) - Number(b.date.split(',')[0]))[0];
    }, [annualPlan, currentYear]);

    const daysUntilNext = nextKevinEvent && nextKevinEvent.date
        ? Number(nextKevinEvent.date.split(',')[0]) - Math.floor((new Date().getTime() - new Date(currentYear, 0, 1).getTime()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <div className="space-y-12 max-w-6xl mx-auto pb-24 px-4 overflow-hidden relative">
            <header className="flex flex-col md:flex-row justify-between items-center gap-8 bg-neutral-900/50 p-8 rounded-[2.5rem] border border-white/5">
                <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-white">THE BIG A## CALENDAR</h2>
                    <p className="text-neutral-500 font-black text-[10px] tracking-[0.3em] uppercase italic">The Year is your territory. Own it.</p>
                </div>

                {/* Edit Controls */}
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${editMode ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
                    >
                        {editMode ? 'Done Editing' : 'Edit Calendar'}
                    </button>
                    {editMode && (
                        <div className="flex items-center gap-1 border-l border-white/10 ml-2 pl-2">
                            {[
                                { id: 'foundation', label: 'Found.', color: 'bg-green-500' },
                                { id: 'misogi', label: 'Misogi', color: 'bg-red-500' },
                                { id: 'none', label: 'Clear', color: 'bg-neutral-700' },
                            ].map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedType(t.id as any)}
                                    className={`w-6 h-6 rounded flex items-center justify-center transition-all ${selectedType === t.id ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100'}`}
                                    title={t.label}
                                >
                                    <div className={`w-3 h-3 rounded-full ${t.color}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {daysUntilNext !== null && (
                    <div className="hidden md:block bg-blue-600 px-8 py-5 rounded-2xl text-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Countdown to Adventure</p>
                        <p className="text-4xl font-black italic text-white leading-none">{daysUntilNext} DAYS</p>
                        <p className="text-[10px] font-black uppercase tracking-tight text-blue-200 mt-1">{nextKevinEvent?.title}</p>
                    </div>
                )}
            </header>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 glass-panel rounded-[3rem] border border-white/5 ${editMode ? 'ring-2 ring-white/20' : ''}`}>
                {Array.from({ length: 12 }).map((_, monthIndex) => {
                    // ... (date calculation logic remains same)
                    const date = new Date(currentYear, monthIndex, 1);
                    const monthName = date.toLocaleString('default', { month: 'long' });
                    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
                    const startOffset = Array.from({ length: monthIndex }).reduce((acc: number, _, i) => acc + new Date(currentYear, i + 1, 0).getDate(), 0) as number;

                    // Calculate padding for Monday start (Mon=0, Sun=6 in this math)
                    let startDay = date.getDay(); // 0=Sun, 1=Mon...
                    let padding = startDay === 0 ? 6 : startDay - 1;

                    return (
                        <div key={monthIndex} className="space-y-4">
                            <h4 className="text-white/50 font-black uppercase tracking-widest text-sm border-b border-white/10 pb-2">
                                {monthName}
                            </h4>

                            {/* Weekday Headers */}
                            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                                    <div key={d} className="text-[10px] font-bold text-neutral-600">{d}</div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1.5">
                                {/* Empty Padding Days */}
                                {Array.from({ length: padding }).map((_, i) => (
                                    <div key={`pad-${i}`} />
                                ))}

                                {/* Actual Days */}
                                {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                                    const globalIndex = startOffset + dayIndex;
                                    const dayData = days[globalIndex]; // Optimization: Access pre-calculated
                                    const { isMisogi, isKevinRule, isNonNegotiable, isToday, isPast } = dayData;

                                    return (
                                        <div
                                            key={dayIndex}
                                            onClick={() => handleDateClick(globalIndex)}
                                            className={`relative aspect-square rounded-sm group ${editMode ? 'cursor-pointer hover:ring-1 hover:ring-white/50' : 'pointer-events-none'}`}
                                        >
                                            {/* Base Day Tile */}
                                            <div className={`absolute inset-0 rounded-sm transition-all duration-300 ${isMisogi
                                                ? 'bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)] z-10 scale-110'
                                                : isKevinRule
                                                    ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10 scale-105'
                                                    : isNonNegotiable
                                                        ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                                                        : isToday
                                                            ? 'bg-white ring-4 ring-white/20 z-10'
                                                            : 'bg-neutral-900/40' // Removed hover effect here since container handles it
                                                } ${editMode && !isMisogi && !isKevinRule && !isNonNegotiable ? 'hover:bg-neutral-800' : ''}`} />

                                            {/* Sharpie Cross-out Animation for Past Days */}
                                            {(isPast || isToday) && (
                                                <svg className="absolute inset-0 w-full h-full text-white/40 pointer-events-none z-20" viewBox="0 0 100 100">
                                                    <motion.path
                                                        d="M 10,10 L 90,90 M 90,10 L 10,90"
                                                        fill="transparent"
                                                        stroke="currentColor"
                                                        strokeWidth="15"
                                                        strokeLinecap="round"
                                                        initial={{ pathLength: 0, opacity: 0 }}
                                                        animate={{ pathLength: 1, opacity: isToday ? 0.8 : 0.3 }}
                                                        transition={{ duration: 0.8, ease: "easeInOut", delay: globalIndex * 0.0001 }} // faster stagger
                                                    />
                                                </svg>
                                            )}

                                            {/* Day Number */}
                                            <div className={`absolute inset-0 flex items-center justify-center text-[8px] font-bold pointer-events-none ${isMisogi || isKevinRule || isNonNegotiable ? 'text-white' : 'text-neutral-600'
                                                }`}>
                                                {dayIndex + 1}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Footer remains same... */}
            <footer className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Misogi", color: "bg-red-600" },
                    { label: "Kevin's Rule", color: "bg-blue-500" },
                    { label: "Foundation", color: "bg-green-500" },
                    { label: "The Past", color: "bg-neutral-800", isX: true },
                ].map(legend => (
                    <div key={legend.label} className="flex items-center gap-3 bg-neutral-900/30 p-4 rounded-2xl border border-white/5">
                        <div className={`w-4 h-4 rounded-sm ${legend.color} flex items-center justify-center relative`}>
                            {legend.isX && <span className="text-[10px] text-white/50">X</span>}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{legend.label}</span>
                    </div>
                ))}
            </footer>
        </div>
    );
};

export default BigACalendar;
