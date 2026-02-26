export type { Transaction } from './domain';

export interface Institution {
  id: string;
  name: string;
}

export type AccountType = 'checking' | 'savings' | 'credit' | 'cd';

export interface Account {
  id: string;
  institutionId: string;
  name: string;
  type: AccountType;
  balance: number;
}

export type SubscriptionStatus = 'active' | 'trial' | 'cancelled';

export interface Subscription {
  id: string;
  merchant: string;
  monthlyCost: number;
  lastChargeDate: string;
  status: SubscriptionStatus;
  category: string;
  /** Account id (links to Account) for bank source display. */
  accountId: string;
}

export type InsightSeverity = 'info' | 'warn';

export interface Insight {
  id: string;
  title: string;
  message: string;
  severity: InsightSeverity;
  relatedCategory?: string;
  ctaLabel?: string;
  ctaRoute?: string;
}

export type LessonLevel = 'beginner' | 'intermediate';

export interface LessonSection {
  heading: string;
  bullets: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  whyCorrect?: string;
}

export interface Lesson {
  id: string;
  title: string;
  level: LessonLevel;
  durationMin: number;
  summary: string;
  sections: LessonSection[];
  quiz?: QuizQuestion[];
}

export type ChallengeStatus = 'todo' | 'in_progress' | 'done';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: ChallengeStatus;
  rewardText: string;
}

export interface UserPreferences {
  currency: string;
  monthlyIncome: number;
  savingsGoal: number;
  darkMode: boolean;
}

export type DebtType = 'student' | 'mortgage' | 'credit' | 'auto' | 'personal' | 'other';

export type DebtStatus = 'active' | 'paused' | 'paid_off';

export interface Debt {
  id: string;
  name: string;
  type: DebtType;
  balance: number;
  apr?: number;
  minimumPayment?: number;
  dueDay?: number;
  status: DebtStatus;
}

export interface Budget {
  monthlyIncome: number;
  needsTarget: number;
  wantsTarget: number;
  savingsTarget: number;
}
