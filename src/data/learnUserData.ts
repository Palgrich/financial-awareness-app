/**
 * Learn tab user data — mirrors Progress tab data.
 * Replace with real store/API when wiring to Progress.
 */

export type SubscriptionLoadStatus = 'High' | 'Moderate' | 'Low';
export type CashControlStatus = 'Moderate' | 'Strong' | 'Weak';
export type CreditCardStatus = 'Strong' | 'Moderate' | 'Needs attention';

export interface SubscriptionItem {
  name: string;
  price: number;
  lastUsed: string;
}

export interface CreditCardDue {
  daysUntilDue: number;
  minimumDue: number;
  cardName: string;
}

export interface LearnUserData {
  subscriptionLoad: SubscriptionLoadStatus;
  subscriptionCount: number;
  subscriptionMonthly: number;
  subscriptions: SubscriptionItem[];
  creditCardDue: CreditCardDue | null;
  creditCardStatus: CreditCardStatus;
  cashControlStatus: CashControlStatus;
  streak: number;
  questProgress: {
    subscriptionCleanse: number;
    creditCardBasics: number;
    emergencyFund: number;
  };
  savedTotal: number;
}

export const learnUserData: LearnUserData = {
  subscriptionLoad: 'High',
  subscriptionCount: 16,
  subscriptionMonthly: 286.85,
  subscriptions: [
    { name: 'Netflix', price: 15.99, lastUsed: '45 days ago' },
    { name: 'Paramount+', price: 9.99, lastUsed: '31 days ago' },
    { name: 'Hulu', price: 17.99, lastUsed: '12 days ago' },
    { name: 'Spotify', price: 10.99, lastUsed: '2 days ago' },
    { name: 'Amazon Prime', price: 14.99, lastUsed: '5 days ago' },
    { name: 'Apple TV+', price: 9.99, lastUsed: '60 days ago' },
    { name: 'Disney+', price: 13.99, lastUsed: '20 days ago' },
    { name: 'YouTube Premium', price: 13.99, lastUsed: '3 days ago' },
  ],
  creditCardDue: {
    daysUntilDue: 2,
    minimumDue: 47.0,
    cardName: 'Chase Sapphire',
  },
  creditCardStatus: 'Strong',
  cashControlStatus: 'Moderate',
  streak: 3,
  questProgress: {
    subscriptionCleanse: 0,
    creditCardBasics: 2,
    emergencyFund: 0,
  },
  savedTotal: 143,
};

export const QUEST_CONFIG = [
  {
    id: 'subscriptionCleanse',
    title: 'Subscription Cleanse',
    emoji: '🧹',
    steps: 4,
    progressKey: 'subscriptionCleanse' as const,
  },
  {
    id: 'creditCardBasics',
    title: 'Credit Card Basics',
    emoji: '💳',
    steps: 5,
    progressKey: 'creditCardBasics' as const,
  },
  {
    id: 'emergencyFund',
    title: 'Emergency Fund 101',
    emoji: '🛡️',
    steps: 3,
    progressKey: 'emergencyFund' as const,
  },
] as const;

export const QUICK_WINS = [
  { id: 'creditScore', title: 'What is a credit score?', emoji: '📊', type: 'quiz' as const },
  { id: 'thirtyRule', title: '30% rule explained', emoji: '💳', type: 'quiz' as const },
  { id: 'paymentReminder', title: 'Set a payment reminder', emoji: '🔔', type: 'guide' as const },
  { id: 'bankStatement', title: 'Read your bank statement', emoji: '🧾', type: 'quiz' as const },
];
