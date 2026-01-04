
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnnualPlan, BigEvent } from '../types.ts';
import { suggestMisogi, suggestKevinRule } from '../services/gemini.ts';
import BigACalendar from './BigACalendar.tsx';

interface OnboardingProps {
    onComplete: (plan: AnnualPlan) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [loadingAI, setLoadingAI] = useState(false);
    const [interestInput, setInterestInput] = useState("");
    const [plan, setPlan] = useState<AnnualPlan>({
        year: new Date().getFullYear(),
        theme: "Living Uncommon",
        misogi: { title: "", description: "", date: "", status: 'planned' },
        big4: [],
        kevinRuleEvents: Array(6).fill(null),
        nonNegotiableDates: []
    });

    const [selectedKevinId, setSelectedKevinId] = useState<string | null>(null);

    const handleAiSuggest = async () => {
        if (!interestInput.trim()) return;
        setLoadingAI(true);
        try {
            const suggestion = await suggestMisogi(interestInput, plan.theme);
            if (suggestion && suggestion.title) {
                setPlan(prev => ({
                    ...prev,
                    misogi: { ...prev.misogi, title: suggestion.title, description: suggestion.description }
                }));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingAI(false);
        }
    };

    const nextStep = () => setStep(s => s + 1);

    const steps = [
        // Screen 1: Reality Check
        <div className="space-y-12 text-center max-w-2xl mx-auto">
            <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-7xl font-black italic tracking-tighter uppercase leading-none text-white"
            >
                MOST PEOPLE LIVE IN A <span className="text-red-600">7-DAY LOOP</span>.
            </motion.h2>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
            >
                <p className="text-xl font-bold text-neutral-400 uppercase tracking-tight">
                    We’re breaking that. The Big A## Calendar isn’t about appointments; it’s about <span className="text-white underline decoration-red-600 decoration-4 underline-offset-8">territory</span>.
                </p>
                <p className="text-sm font-black text-neutral-600 uppercase tracking-widest">
                    If you don't claim your time, someone else will. We are going to map out your next 365 days right now.
                </p>
            </motion.div>
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={nextStep}
                className="px-12 py-5 bg-white text-black font-black uppercase italic rounded-2xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-105"
            >
                Let's Build the Year
            </motion.button>
        </div>,

        // Screen 2: The Theme
        <div className="space-y-12 max-w-4xl mx-auto text-center">
            <div className="space-y-4">
                <h2 className="text-5xl font-black italic tracking-tighter uppercase underline decoration-red-600 text-white">STEP 1: The Theme.</h2>
                <p className="text-neutral-500 font-bold uppercase tracking-tight">
                    Don't just set goals. Set a direction. Give your year a title.<br />
                    (e.g. "Year of the Builder", "Health First", "No Fear")
                </p>
            </div>

            <div className="max-w-2xl mx-auto">
                <input
                    autoFocus
                    placeholder="ENTER YOUR THEME..."
                    className="w-full bg-transparent border-b-4 border-white text-5xl font-black italic uppercase text-white placeholder:text-neutral-800 outline-none text-center py-4 focus:border-red-600 transition-colors"
                    value={plan.theme === "Living Uncommon" ? "" : plan.theme}
                    onChange={e => setPlan({ ...plan, theme: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && plan.theme && nextStep()}
                />
            </div>

            <div className="flex justify-center pt-8">
                <button onClick={nextStep} disabled={!plan.theme || plan.theme === "Living Uncommon"} className="px-12 py-5 bg-white text-black font-black uppercase italic rounded-2xl disabled:opacity-20 hover:scale-105 transition-all">
                    NEXT: DEFINE THE MISOGI
                </button>
            </div>
        </div>,

        // Screen 3: Define Misogi (The What)
        <div className="space-y-12 max-w-5xl mx-auto text-center">
            <div className="space-y-6">
                <h2 className="text-5xl font-black italic tracking-tighter uppercase text-white">STEP 2: The Challenge.</h2>
                <div className="space-y-4 max-w-3xl mx-auto text-neutral-400 font-medium">
                    <p>
                        A <strong>Misogi</strong> is a year-defining event with a <span className="text-red-500 font-bold">50% chance of failure</span>.
                        It aligns with your theme: <span className="text-white font-black uppercase">"{plan.theme}"</span>.
                    </p>
                    <ul className="text-sm space-y-2 uppercase tracking-wide font-bold text-neutral-500">
                        <li>• It must be scary enough to demand preparation.</li>
                        <li>• It doesn't have to be physical (but those are great).</li>
                        <li>• It becomes your "North Star" for decision making.</li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col gap-8 items-center">
                {/* Main Input */}
                <div className="w-full max-w-2xl">
                    <input
                        autoFocus
                        placeholder="ENTER MISOGI TITLE..."
                        className="w-full bg-transparent border-b-4 border-red-600 text-5xl font-black italic uppercase text-white placeholder:text-neutral-800 outline-none text-center py-4"
                        value={plan.misogi.title}
                        onChange={e => setPlan({ ...plan, misogi: { ...plan.misogi, title: e.target.value } })}
                        onKeyDown={e => e.key === 'Enter' && plan.misogi.title && nextStep()}
                    />
                    {plan.misogi.description && (
                        <p className="text-neutral-500 mt-4 font-bold uppercase tracking-widest text-xs animate-pulse">
                            "{plan.misogi.description}"
                        </p>
                    )}
                </div>

                {/* AI Assist Section */}
                <div className="w-full max-w-xl bg-neutral-900/50 p-6 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-3 justify-center mb-2">
                        <span className="text-2xl">🧠</span>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Coach Jesse AI</span>
                    </div>
                    <p className="text-xs text-neutral-500 font-bold uppercase">Stuck? Tell me what you love (running, business, hiking), and I'll peak-perform it.</p>
                    <div className="flex gap-2">
                        <input
                            placeholder="E.g. I like hiking and hate the cold..."
                            className="flex-1 bg-black rounded-xl px-4 py-3 text-white text-sm font-bold border border-white/10 focus:border-red-600 outline-none transition-colors"
                            value={interestInput}
                            onChange={e => setInterestInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAiSuggest()}
                        />
                        <button
                            onClick={handleAiSuggest}
                            disabled={loadingAI || !interestInput}
                            className="bg-white text-black px-6 py-3 rounded-xl font-black uppercase italic text-xs hover:bg-neutral-200 disabled:opacity-50 transition-colors"
                        >
                            {loadingAI ? 'thinking...' : 'Suggest'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <button onClick={nextStep} disabled={!plan.misogi.title} className="px-12 py-5 bg-red-600 text-white font-black uppercase italic rounded-2xl disabled:opacity-20 hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all">
                    NEXT: SET THE DATE
                </button>
            </div>
        </div>,

        // Screen 3: Schedule Misogi (The When)
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
                <h2 className="text-5xl font-black italic tracking-tighter uppercase text-red-600">STEP 3: The Commitment.</h2>
                <p className="text-neutral-500 font-bold uppercase tracking-tight">
                    If it's not on the calendar, it's just a dream. Go into the fire.<br />
                    Pick the date your year revolves around.
                </p>
            </div>

            <div className="glass-panel p-8 rounded-[2.5rem] border-2 border-red-600/20 max-h-[60vh] overflow-y-auto">
                <div className="space-y-8">
                    <h3 className="text-center text-2xl font-black italic uppercase text-white sticky top-0 bg-black/80 backdrop-blur-md py-4 z-20">
                        {plan.misogi.title || "THE MISOGI"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 12 }).map((_, monthIndex) => {
                            const date = new Date(plan.year, monthIndex, 1);
                            const monthName = date.toLocaleString('default', { month: 'long' });
                            const daysInMonth = new Date(plan.year, monthIndex + 1, 0).getDate();
                            const startOffset = Array.from({ length: monthIndex }).reduce((acc: number, _, i) => acc + new Date(plan.year, i + 1, 0).getDate(), 0) as number;

                            // Calculate padding for Monday start (Mon=0, Sun=6 in this math)
                            let startDay = date.getDay(); // 0=Sun, 1=Mon...
                            // We want Mon=0, ..., Sun=6
                            let padding = startDay === 0 ? 6 : startDay - 1;

                            return (
                                <div key={monthIndex} className="space-y-2">
                                    <h4 className="text-red-600 font-black uppercase tracking-widest text-xs border-b border-red-600/20 pb-1 mb-2">
                                        {monthName}
                                    </h4>

                                    {/* Weekday Headers */}
                                    <div className="grid grid-cols-7 gap-1 mb-1 text-center">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                                            <div key={d} className="text-[8px] font-bold text-neutral-600">{d}</div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-7 gap-1">
                                        {/* Empty Padding Days */}
                                        {Array.from({ length: padding }).map((_, i) => (
                                            <div key={`pad-${i}`} />
                                        ))}

                                        {/* Actual Days */}
                                        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                                            const globalIndex = startOffset + dayIndex;
                                            const isSelected = plan.misogi.date === String(globalIndex);

                                            return (
                                                <div
                                                    key={dayIndex}
                                                    className={`aspect-square rounded-[2px] cursor-pointer transition-all flex items-center justify-center text-[8px] font-bold ${isSelected
                                                        ? 'bg-red-600 text-white scale-125 z-10 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                                        : 'bg-neutral-900 text-neutral-600 hover:bg-neutral-800 hover:text-neutral-400'
                                                        }`}
                                                    onClick={() => setPlan({ ...plan, misogi: { ...plan.misogi, date: String(globalIndex) } })}
                                                >
                                                    {dayIndex + 1}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <button onClick={nextStep} disabled={!plan.misogi.date} className="px-12 py-5 bg-red-600 text-white font-black uppercase italic rounded-2xl disabled:opacity-20 hover:scale-105 transition-all">
                    LOCK IT IN
                </button>
            </div>
        </div>,

        // Screen 4: The Foundation (Non-Negotiables)
        <div className="space-y-4 max-w-6xl mx-auto h-full flex flex-col">
            <div className="text-center space-y-2 shrink-0">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase text-green-500">STEP 4: The Foundation.</h2>
                <p className="text-neutral-500 font-bold uppercase tracking-tight text-sm">
                    Birthdays, anniversaries, and "Winning Days." Block these off FIRST.
                </p>
            </div>

            <div className="glass-panel p-6 rounded-[2rem] border-2 border-green-500/10 overflow-y-auto w-full max-h-[60vh] custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 12 }).map((_, monthIndex) => {
                        const date = new Date(plan.year, monthIndex, 1);
                        const monthName = date.toLocaleString('default', { month: 'long' });
                        const daysInMonth = new Date(plan.year, monthIndex + 1, 0).getDate();
                        const startOffset = Array.from({ length: monthIndex }).reduce((acc: number, _, i) => acc + new Date(plan.year, i + 1, 0).getDate(), 0) as number;

                        let startDay = date.getDay();
                        let padding = startDay === 0 ? 6 : startDay - 1;

                        return (
                            <div key={monthIndex} className="space-y-1">
                                <h4 className="text-green-500 font-black uppercase tracking-widest text-[10px] border-b border-green-500/20 pb-1 mb-1">
                                    {monthName}
                                </h4>

                                <div className="grid grid-cols-7 gap-px text-center mb-1">
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                                        <div key={d} className="text-[6px] font-bold text-neutral-600">{d}</div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-px">
                                    {/* Empty Padding Days */}
                                    {Array.from({ length: padding }).map((_, i) => (
                                        <div key={`pad-${i}`} />
                                    ))}

                                    {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                                        const globalIndex = startOffset + dayIndex;
                                        const dateStr = String(globalIndex);
                                        const isSelected = plan.nonNegotiableDates.includes(dateStr);

                                        return (
                                            <div
                                                key={dayIndex}
                                                className={`aspect-square rounded-[1px] cursor-pointer transition-all flex items-center justify-center text-[8px] font-bold ${isSelected
                                                    ? 'bg-green-500 text-white hover:bg-green-400 z-10'
                                                    : 'bg-neutral-900 text-neutral-600 hover:bg-neutral-800'
                                                    }`}
                                                onClick={() => {
                                                    const newDates = isSelected
                                                        ? plan.nonNegotiableDates.filter(d => d !== dateStr)
                                                        : [...plan.nonNegotiableDates, dateStr];
                                                    setPlan({ ...plan, nonNegotiableDates: newDates });
                                                }}
                                            >
                                                {dayIndex + 1}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-center pb-4 pt-2 shrink-0">
                <button onClick={nextStep} className="px-12 py-4 bg-green-600 text-white font-black uppercase italic rounded-2xl hover:scale-105 transition-all text-sm">
                    PROTECT THE FOUNDATION
                </button>
            </div>
        </div>,

        // Screen 5: Kevin's Rule
        <div className="space-y-4 max-w-6xl mx-auto h-full flex flex-col">
            <div className="text-center space-y-2 shrink-0">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase text-blue-500">STEP 5: The 8-Week Rhythm.</h2>
                <p className="text-neutral-500 font-bold uppercase tracking-tight text-sm">
                    Kevin’s Rule: One memory anchor every 8 weeks. Don't let time blur.
                </p>
            </div>

            <div className="grid grid-cols-6 gap-2 shrink-0">
                {Array(6).fill(null).map((_, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            setSelectedKevinId(String(i));
                        }}
                        className={`glass-panel p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${selectedKevinId === String(i)
                            ? 'border-white bg-white/10 ring-2 ring-blue-500 scale-105 z-10' // Selected Style - Expanded scale
                            : plan.kevinRuleEvents[i]?.date
                                ? 'border-blue-500 bg-blue-500/10' // Has Data Style
                                : 'border-white/10 opacity-50 hover:opacity-100' // Default
                            }`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[8px] font-black text-blue-400 uppercase">ADV 0{i + 1}</span>
                            {plan.kevinRuleEvents[i]?.date && <span className="text-[8px] font-bold text-white">📅 SET</span>}
                        </div>
                        <input
                            placeholder="Title..."
                            className="w-full bg-transparent border-none text-xs font-black uppercase text-white outline-none placeholder:text-neutral-700"
                            value={plan.kevinRuleEvents[i]?.title || ''}
                            onChange={e => {
                                const newEvents = [...plan.kevinRuleEvents];
                                const existingDate = newEvents[i]?.date || "";
                                const existingDesc = newEvents[i]?.description || "";
                                newEvents[i] = { id: String(i), title: e.target.value, date: existingDate, description: existingDesc };
                                setPlan({ ...plan, kevinRuleEvents: newEvents });
                            }}
                        />
                        {/* Show Description/Plan ONLY if selected */}
                        {selectedKevinId === String(i) && (
                            <textarea
                                placeholder="Basic Plan / AI Suggestions..."
                                className="w-full bg-black/20 rounded p-2 text-[10px] text-neutral-300 outline-none resize-none border border-white/5 placeholder:text-neutral-700 h-20"
                                value={plan.kevinRuleEvents[i]?.description || ''}
                                onChange={e => {
                                    const newEvents = [...plan.kevinRuleEvents];
                                    const existingDate = newEvents[i]?.date || "";
                                    const existingTitle = newEvents[i]?.title || "";
                                    newEvents[i] = { id: String(i), title: existingTitle, date: existingDate, description: e.target.value };
                                    setPlan({ ...plan, kevinRuleEvents: newEvents });
                                }}
                                onClick={(e) => e.stopPropagation()} // Prevent card click from re-triggering selector (optional but good hygiene)
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* AI Control Bar */}
            <div className="flex gap-2 items-center justify-between bg-neutral-900/50 p-2 rounded-xl border border-white/5 shrink-0">
                <div className="flex gap-2 items-center flex-1">
                    <span className="text-lg">🧠</span>
                    <input
                        className="bg-transparent text-xs text-white placeholder:text-neutral-600 outline-none flex-1 font-bold uppercase"
                        placeholder="Topics? (e.g. Travel, Learning, Outdoors)"
                        value={interestInput}
                        onChange={e => setInterestInput(e.target.value)}
                    />
                </div>
                <button
                    onClick={async () => {
                        if (selectedKevinId === null) return;
                        setLoadingAI(true);
                        try {
                            const suggestion = await suggestKevinRule(interestInput || "Unique Experience", plan.theme);
                            if (suggestion && suggestion.title) {
                                const i = Number(selectedKevinId);
                                const newEvents = [...plan.kevinRuleEvents];
                                const existingDate = newEvents[i]?.date || "";
                                newEvents[i] = { id: String(i), title: suggestion.title, date: existingDate, description: suggestion.description };
                                setPlan({ ...plan, kevinRuleEvents: newEvents });
                            }
                        } catch (error) {
                            console.error(error);
                        } finally {
                            setLoadingAI(false);
                        }
                    }}
                    disabled={selectedKevinId === null || loadingAI}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-blue-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                    {loadingAI ? 'Thinking...' : selectedKevinId === null ? 'Select a Card' : '✨ Suggest Idea'}
                </button>
            </div>

            <div className="glass-panel p-6 rounded-[2rem] border-2 border-blue-500/20 overflow-y-auto w-full max-h-[60vh] custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 12 }).map((_, monthIndex) => {
                        const date = new Date(plan.year, monthIndex, 1);
                        const monthName = date.toLocaleString('default', { month: 'long' });
                        const daysInMonth = new Date(plan.year, monthIndex + 1, 0).getDate();
                        const startOffset = Array.from({ length: monthIndex }).reduce((acc: number, _, i) => acc + new Date(plan.year, i + 1, 0).getDate(), 0) as number;

                        let startDay = date.getDay();
                        let padding = startDay === 0 ? 6 : startDay - 1;

                        return (
                            <div key={monthIndex} className="space-y-1">
                                <h4 className="text-blue-500 font-black uppercase tracking-widest text-[10px] border-b border-blue-500/20 pb-1 mb-1">
                                    {monthName}
                                </h4>

                                <div className="grid grid-cols-7 gap-px text-center mb-1">
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                                        <div key={d} className="text-[6px] font-bold text-neutral-600">{d}</div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-px">
                                    {Array.from({ length: padding }).map((_, i) => (
                                        <div key={`pad-${i}`} />
                                    ))}

                                    {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                                        const globalIndex = startOffset + dayIndex;

                                        // Check if this day is assigned to ANY Kevin Event
                                        const assignedEventIndex = plan.kevinRuleEvents.findIndex(e => {
                                            if (!e || !e.date) return false;
                                            const dates = e.date.split(',');
                                            return dates.includes(String(globalIndex));
                                        });
                                        const isAssigned = assignedEventIndex !== -1;

                                        // Check if this day is part of the CURRENTLY SELECTED adventure (if we add selection state)
                                        const isSelectedKevinEvent = selectedKevinId !== null && plan.kevinRuleEvents[Number(selectedKevinId)]?.date?.split(',').includes(String(globalIndex));

                                        // Check if this is the MISOGI date
                                        const isMisogi = plan.misogi.date === String(globalIndex);
                                        // Check if this is a NON-NEGOTIABLE date
                                        const isNonNegotiable = plan.nonNegotiableDates.includes(String(globalIndex));

                                        const isBlocked = isMisogi || isNonNegotiable;

                                        return (
                                            <div
                                                key={dayIndex}
                                                className={`h-8 w-full rounded-sm transition-all flex items-center justify-center text-[10px] font-bold relative group border border-white/5 ${isMisogi
                                                    ? 'bg-red-900/20 text-red-600 opacity-50 cursor-not-allowed border-red-900/30' // Misogi Style
                                                    : isNonNegotiable
                                                        ? 'bg-green-900/20 text-green-600 opacity-50 cursor-not-allowed border-green-900/30' // Non-Negotiable Style
                                                        : isSelectedKevinEvent
                                                            ? 'bg-blue-500 text-white z-10 scale-105 cursor-pointer' // Highlight if part of selected event
                                                            : isAssigned
                                                                ? 'bg-blue-500/50 text-white z-10 cursor-pointer' // Less highlight if assigned but not selected
                                                                : 'bg-neutral-900 text-neutral-500 hover:bg-neutral-800 hover:text-white cursor-pointer'
                                                    }`}
                                                onClick={() => {
                                                    if (isBlocked) return; // Prevent clicking Blocked dates

                                                    let targetIndex;

                                                    if (selectedKevinId !== null) {
                                                        targetIndex = Number(selectedKevinId);
                                                    } else if (assignedEventIndex !== -1) {
                                                        targetIndex = assignedEventIndex;
                                                    } else {
                                                        targetIndex = plan.kevinRuleEvents.findIndex(e => !e || !e.date);
                                                    }

                                                    if (targetIndex !== -1) {
                                                        // ... existing logic ...
                                                        const newEvents = [...plan.kevinRuleEvents];
                                                        const currentEvent = newEvents[targetIndex];
                                                        const currentDates = currentEvent?.date ? currentEvent.date.split(',') : [];
                                                        const clickedDateStr = String(globalIndex);

                                                        let newDateStr = "";

                                                        if (currentDates.includes(clickedDateStr)) {
                                                            newDateStr = currentDates.filter(d => d !== clickedDateStr).join(',');
                                                        } else {
                                                            const userWantsWeekend = currentDates.length > 0;
                                                            if (userWantsWeekend && currentDates.length >= 2) {
                                                                newDateStr = clickedDateStr;
                                                            } else {
                                                                newDateStr = [...currentDates, clickedDateStr].sort((a, b) => Number(a) - Number(b)).join(',');
                                                            }
                                                        }

                                                        newEvents[targetIndex] = {
                                                            id: String(targetIndex),
                                                            title: currentEvent?.title || "",
                                                            date: newDateStr,
                                                            description: ""
                                                        };
                                                        setPlan({ ...plan, kevinRuleEvents: newEvents });
                                                    }
                                                }}
                                            >
                                                {dayIndex + 1}
                                                {isMisogi && (
                                                    <div className="absolute top-0 right-0 p-0.5">
                                                        <div className="w-1 h-1 rounded-full bg-red-500"></div>
                                                    </div>
                                                )}
                                                {isNonNegotiable && (
                                                    <div className="absolute top-0 right-0 p-0.5">
                                                        <div className="w-1 h-1 rounded-full bg-green-500"></div>
                                                    </div>
                                                )}
                                                {isAssigned && !isBlocked && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-blue-600 text-white text-[8px] font-bold uppercase rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50">
                                                        ADV {assignedEventIndex + 1}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-center pb-4 pt-2 shrink-0">
                <button onClick={nextStep} className="px-12 py-4 bg-blue-600 text-white font-black uppercase italic rounded-2xl hover:scale-105 transition-all text-sm">
                    MAP THE ADVENTURES
                </button>
            </div>
        </div>,

        // Screen 5: Final View
        <div className="space-y-12 text-center max-w-3xl mx-auto text-white">
            <div className="space-y-4">
                <h2 className="text-7xl font-black italic tracking-tighter uppercase leading-none">YOUR YEAR IS LIVE.</h2>
                <p className="text-neutral-400 font-bold uppercase italic text-xl">
                    Look at the white space. That’s your opportunity.
                </p>
            </div>

            <div className="glass-panel p-10 rounded-[3rem] border-2 border-white/5 space-y-6">
                <p className="text-sm text-neutral-500 font-black uppercase tracking-widest leading-relaxed">
                    As each day passes, we’re going to "X" it out.<br />
                    Make sure the days you crossed out were worth the trade.
                </p>
                <div className="flex justify-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-red-600" />
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onComplete(plan)}
                className="px-16 py-6 bg-white text-black font-black uppercase italic rounded-2xl text-2xl shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
            >
                Enter the Year
            </motion.button>
        </div>
    ];

    const prevStep = () => setStep(s => Math.max(1, s - 1));
    const [showCalendar, setShowCalendar] = useState(false);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6 overflow-hidden">
            {/* Nav Controls */}
            <div className="absolute top-8 left-8 z-50">
                {step > 1 && (
                    <button
                        onClick={prevStep}
                        className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs"
                    >
                        ← Back
                    </button>
                )}
            </div>

            <div className="absolute top-8 right-8 z-50">
                {step > 2 && (
                    <button
                        onClick={() => setShowCalendar(true)}
                        className="flex items-center gap-2 bg-neutral-900/50 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg border border-white/10 transition-all font-bold uppercase tracking-widest text-xs"
                    >
                        <span>📅</span> View Full Year
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="w-full"
                >
                    {steps[step - 1]}
                </motion.div>
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="fixed bottom-0 left-0 right-0 h-2 bg-neutral-900">
                <motion.div
                    className="h-full bg-red-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / steps.length) * 100}%` }}
                />
            </div>

            {/* Full Calendar Modal */}
            <AnimatePresence>
                {showCalendar && (
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        className="fixed inset-0 z-[200] bg-black/95 flex flex-col"
                    >
                        <div className="p-8 flex justify-between items-center bg-neutral-900 border-b border-white/10">
                            <h2 className="text-2xl font-black italic text-white uppercase">Reference View</h2>
                            <button
                                onClick={() => setShowCalendar(false)}
                                className="text-neutral-500 hover:text-white font-bold uppercase tracking-widest text-xs"
                            >
                                Close X
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8">
                            <BigACalendar state={{
                                annualPlan: plan,
                                // Mock other state props needed for display
                                prepChecklist: [],
                                weeklyWins: [],
                                onboardingComplete: false
                            }} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Onboarding;
