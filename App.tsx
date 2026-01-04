
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import AnnualPlanner from './components/AnnualPlanner.tsx';
import WeeklyWinComponent from './components/WeeklyWin.tsx';
import AICoach from './components/AICoach.tsx';
import YearPrep from './components/YearPrep.tsx';
import Onboarding from './components/Onboarding.tsx';
import BigACalendar from './components/BigACalendar.tsx';
import { AppState, AnnualPlan, WeeklyWin, PrepItem } from './types.ts';

const DEFAULT_PREP: PrepItem[] = [
  { id: 'resume-audit', task: 'The Life Resume Audit', description: 'Be brutally honest: If last year was a chapter in your biography, would anyone want to read it? Score your experiences.', completed: false },
  { id: 'primary-focus', task: 'Identify Your "North Star"', description: 'The one singular focus that dictates every other decision this year.', completed: false },
  { id: 'misogi-lock', task: 'Lock the Misogi', description: 'The 50/50 failure event. Book the flight, pay the registration, or announce the date. No turning back.', completed: false },
  { id: 'life-first-cal', task: 'Life-First Calendar Reset', description: 'Schedule vacations, dates with your spouse, and family rituals BEFORE work. Work is the filler, life is the container.', completed: false },
  { id: 'kevin-rule-6', task: 'The 8-Week Clock', description: 'Schedule your 6 "Kevin\'s Rule" events—one every 8 weeks. These are your mini-misogis.', completed: false },
  { id: 'morning-60', task: 'The First 60 Protocol', description: 'Commit to the protocol: No digital input (phone) for 30-60 mins, 20oz hydration, and outdoor sunlight.', completed: false },
  { id: 'env-purge', task: 'The Friction Purge', description: 'Tidy your desk and clear your digital inbox. High performance requires zero friction.', completed: false },
  { id: 'donate-clothes', task: 'Donate Old Clothes', description: 'Declutter your physical space to declutter your mind. Pass on what you no longer need.', completed: false },
  { id: 'no-negotiation', task: 'Sign the "No-Negotiation" Pact', description: 'Once it is on the calendar, the debate is over. We don\'t negotiate with our goals.', completed: false },
];

const INITIAL_PLAN: AnnualPlan = {
  year: new Date().getFullYear(),
  theme: "Living Uncommon",
  misogi: {
    title: "",
    description: "",
    date: "",
    status: 'planned'
  },
  big4: [],
  kevinRuleEvents: [],
  nonNegotiableDates: []
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('itzler_app_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: ensure new fields exist
      if (!parsed.annualPlan.nonNegotiableDates) parsed.annualPlan.nonNegotiableDates = [];
      if (parsed.onboardingComplete === undefined) parsed.onboardingComplete = false;
      return parsed;
    }
    return {
      annualPlan: INITIAL_PLAN,
      weeklyWins: [],
      prepChecklist: DEFAULT_PREP,
      onboardingComplete: false
    };
  });

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('itzler_active_tab') || 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('itzler_app_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem('itzler_active_tab', activeTab);
  }, [activeTab]);

  const updateAnnualPlan = (annualPlan: AnnualPlan) => {
    setState(prev => ({ ...prev, annualPlan }));
  };

  const addWeeklyWin = (win: WeeklyWin) => {
    setState(prev => ({ ...prev, weeklyWins: [win, ...prev.weeklyWins] }));
    setActiveTab('dashboard');
  };

  const togglePrepItem = (id: string) => {
    setState(prev => ({
      ...prev,
      prepChecklist: prev.prepChecklist.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const completeOnboarding = (annualPlan: AnnualPlan) => {
    setState(prev => ({ ...prev, annualPlan, onboardingComplete: true }));
    setActiveTab('calendar');
  };

  if (!state.onboardingComplete) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard state={state} />}
      {activeTab === 'calendar' && <BigACalendar state={state} onUpdate={updateAnnualPlan} />}
      {activeTab === 'prep' && <YearPrep checklist={state.prepChecklist} onToggle={togglePrepItem} />}
      {activeTab === 'annual' && <AnnualPlanner plan={state.annualPlan} onUpdate={updateAnnualPlan} />}
      {activeTab === 'weekly' && <WeeklyWinComponent annualPlan={state.annualPlan} onSave={addWeeklyWin} />}
      {activeTab === 'coach' && <AICoach state={state} />}
    </Layout>
  );
};

export default App;
