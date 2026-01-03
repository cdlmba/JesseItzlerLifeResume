
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
}

export interface WeeklyWin {
  id: string;
  weekStart: string;
  nonNegotiables: string[];
  reflections: string;
  score: number; // 1-10
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
}
