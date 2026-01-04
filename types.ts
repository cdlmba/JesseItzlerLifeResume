
export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'Health' | 'Wealth' | 'Relationship' | 'Self';
  completed: boolean;
}

export interface BigEvent {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface Misogi {
  title: string;
  description: string;
  date: string;
  status: 'planned' | 'in-progress' | 'completed';
}

export interface AnnualPlan {
  year: number;
  theme: string;
  misogi: Misogi;
  big4: Goal[];
  kevinRuleEvents: BigEvent[]; // 6 events, one every 8 weeks
  nonNegotiableDates: string[]; // ISO string dates
}

export interface WeeklyWin {
  id: string;
  weekStart: string;
  big4Wins: { category: string; task: string; completed: boolean }[];
  reflections: string;
  score: number; // 0-100% based on wins
  status: 'planned' | 'completed';
}

export interface PrepItem {
  id: string;
  task: string;
  description: string;
  completed: boolean;
}

export interface AppState {
  annualPlan: AnnualPlan;
  weeklyWins: WeeklyWin[];
  prepChecklist: PrepItem[];
  onboardingComplete: boolean;
}
