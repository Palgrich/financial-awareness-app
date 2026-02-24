/**
 * Progress tab user data — full mock per spec.
 * Used by progressStore; updates flow from Learn tab and user actions.
 */

export type HealthStatus = 'Strong' | 'Good' | 'Moderate' | 'High';

export interface HealthBreakdownItem {
  score: number;
  max: number;
  status: HealthStatus;
}

export interface HealthBreakdown {
  creditCardPayments: HealthBreakdownItem;
  cashControl: HealthBreakdownItem;
  financialAwareness: HealthBreakdownItem;
  subscriptionLoad: HealthBreakdownItem;
}

export interface ProgressCategory {
  name: string;
  emoji: string;
  amount: number;
  percent: number;
}

export interface ProgressSubscription {
  name: string;
  price: number;
  lastUsed: string;
  keep: boolean | null;
}

export interface ProgressNotification {
  type: 'urgent' | 'warning' | 'info';
  text: string;
  time: string;
}

export interface FinancialAwarenessProgress {
  lessonsCompleted: number;
  totalLessons: number;
  level: number;
  levelName: string;
}

export interface ProgressUserData {
  financialHealthScore: number;
  healthBreakdown: HealthBreakdown;

  daysUntilPaycheck: number;
  availableBalance: number;
  dailyBudgetSafe: number;
  avgDailySpendLast3Days: number;

  cashControlStatus: 'Moderate' | 'Strong' | 'High' | 'Good';
  expensesThisMonth: number;
  expensesLastMonth: number;
  currentBalance: number;
  weeklySpending: number[];
  topCategories: ProgressCategory[];

  financialAwareness: FinancialAwarenessProgress;

  subscriptionStatus: HealthStatus;
  subscriptionCount: number;
  subscriptionMonthly: number;
  subscriptionYearly: number;
  subscriptions: ProgressSubscription[];

  creditCardStatus: HealthStatus;
  lastStatementBalance: number;
  currentCardBalance: number;
  creditLimit: number;
  utilizationPercent: number;
  daysUntilDue: number;
  minimumDue: number;
  cardName: string;
  nextDueDate: string;
  estimatedPayment: number;
  paymentHistory: boolean[];

  notifications: ProgressNotification[];
  streak: number;
  savedTotal: number;
}

const HEALTH_BREAKDOWN: HealthBreakdown = {
  creditCardPayments: { score: 25, max: 25, status: 'Strong' },
  cashControl: { score: 20, max: 25, status: 'Moderate' },
  financialAwareness: { score: 18, max: 20, status: 'Good' },
  subscriptionLoad: { score: 19, max: 30, status: 'High' },
};

export const defaultProgressUserData: ProgressUserData = {
  financialHealthScore: 82,
  healthBreakdown: HEALTH_BREAKDOWN,

  daysUntilPaycheck: 8,
  availableBalance: 340,
  dailyBudgetSafe: 42,
  avgDailySpendLast3Days: 67,

  cashControlStatus: 'Moderate',
  expensesThisMonth: 961.62,
  expensesLastMonth: 641.97,
  currentBalance: 27520.5,
  weeklySpending: [180, 220, 310, 251],
  topCategories: [
    { name: 'Food & Dining', emoji: '🍔', amount: 312, percent: 32 },
    { name: 'Bills & Utilities', emoji: '🏠', amount: 280, percent: 29 },
    { name: 'Transport', emoji: '🚗', amount: 180, percent: 19 },
    { name: 'Shopping', emoji: '🛍️', amount: 120, percent: 12 },
    { name: 'Entertainment', emoji: '🎬', amount: 69, percent: 8 },
  ],

  financialAwareness: {
    lessonsCompleted: 6,
    totalLessons: 23,
    level: 2,
    levelName: 'Money Aware',
  },

  subscriptionStatus: 'High',
  subscriptionCount: 16,
  subscriptionMonthly: 286.85,
  subscriptionYearly: 3442,
  subscriptions: [
    { name: 'Netflix', price: 15.99, lastUsed: '45 days ago', keep: null },
    { name: 'Paramount+', price: 9.99, lastUsed: '31 days ago', keep: null },
    { name: 'Hulu', price: 17.99, lastUsed: '12 days ago', keep: null },
    { name: 'Spotify', price: 10.99, lastUsed: '2 days ago', keep: true },
    { name: 'Amazon Prime', price: 14.99, lastUsed: '5 days ago', keep: true },
    { name: 'Apple TV+', price: 9.99, lastUsed: '60 days ago', keep: null },
    { name: 'Disney+', price: 13.99, lastUsed: '20 days ago', keep: null },
    { name: 'YouTube Premium', price: 13.99, lastUsed: '3 days ago', keep: true },
    { name: 'iCloud+', price: 2.99, lastUsed: 'today', keep: true },
    { name: 'Xbox Game Pass', price: 14.99, lastUsed: '50 days ago', keep: null },
    { name: 'Duolingo Plus', price: 6.99, lastUsed: '8 days ago', keep: null },
    { name: 'Adobe CC', price: 54.99, lastUsed: '15 days ago', keep: null },
    { name: 'Calm', price: 14.99, lastUsed: '90 days ago', keep: null },
    { name: 'NordVPN', price: 4.99, lastUsed: '30 days ago', keep: null },
    { name: 'Audible', price: 14.95, lastUsed: '25 days ago', keep: null },
    { name: 'Dropbox', price: 9.99, lastUsed: '45 days ago', keep: null },
  ],

  creditCardStatus: 'Strong',
  lastStatementBalance: 0,
  currentCardBalance: 89,
  creditLimit: 500,
  utilizationPercent: 18,
  daysUntilDue: 2,
  minimumDue: 47,
  cardName: 'Chase Sapphire',
  nextDueDate: 'March 15',
  estimatedPayment: 120,
  paymentHistory: [true, true, true, true, true, true],

  notifications: [
    { type: 'urgent', text: 'Chase Sapphire payment due in 2 days · $47 minimum', time: 'now' },
    { type: 'warning', text: "You're spending $67/day · $340 left until payday", time: '1h ago' },
    { type: 'info', text: 'New lesson available: The 30% credit rule', time: 'today' },
  ],

  streak: 3,
  savedTotal: 143,
};

/** Level name by completed lessons (0–4, 5–8, …). */
export const AWARENESS_LEVELS: { min: number; max: number; name: string }[] = [
  { min: 0, max: 4, name: 'Level 1 · Beginner' },
  { min: 5, max: 8, name: 'Level 2 · Money Aware' },
  { min: 9, max: 14, name: 'Level 3 · Smart Spender' },
  { min: 15, max: 19, name: 'Level 4 · Credit Builder' },
  { min: 20, max: 23, name: 'Level 5 · Money Master' },
];

export function getAwarenessLevelName(lessonsCompleted: number): string {
  const row = AWARENESS_LEVELS.find(
    (r) => lessonsCompleted >= r.min && lessonsCompleted <= r.max
  );
  return row?.name ?? AWARENESS_LEVELS[0].name;
}

export function getAwarenessLevelNumber(lessonsCompleted: number): number {
  const idx = AWARENESS_LEVELS.findIndex(
    (r) => lessonsCompleted >= r.min && lessonsCompleted <= r.max
  );
  return idx >= 0 ? idx + 1 : 1;
}

/** Financial Awareness component score: round(lessonsCompleted / totalLessons * 20). */
export function awarenessScore(lessonsCompleted: number, totalLessons: number): number {
  if (totalLessons <= 0) return 0;
  return Math.round((lessonsCompleted / totalLessons) * 20);
}

/** Recompute total financial health score from breakdown. */
export function totalHealthScore(breakdown: HealthBreakdown): number {
  const b = breakdown;
  return (
    b.creditCardPayments.score +
    b.cashControl.score +
    b.financialAwareness.score +
    b.subscriptionLoad.score
  );
}
