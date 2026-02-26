export type UUID = string;

export type ISODateString = string; // e.g. "2026-02-21"
export type ISOTimestampString = string; // e.g. "2026-02-21T12:34:56.000Z"

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | (string & {});

export type Cents = number;

export interface Money {
  currency: CurrencyCode;
  cents: Cents;
}

export type Percentage = number; // 0..100

export type RiskLevel = 'good' | 'moderate' | 'high';

export type MetricSnapshot = {
  financialHealth: number;
  awarenessScore: number;
  cashControlScore: number;
  subscriptionScore: number;
  creditScore: number;
};

export type LessonStatus = 'in_progress' | 'not_started' | 'done';

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  status: LessonStatus;
  lastStartedAt?: ISOTimestampString;
}

export interface LearningPath {
  id: string;
  title: string;
  lessonsCount: number;
  lastStartedAt?: ISOTimestampString;
}

export type ChallengeStatus = 'in_progress' | 'todo' | 'done';

export interface Challenge {
  id: string;
  title: string;
  status: ChallengeStatus;
  lastUpdatedAt?: ISOTimestampString;
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  accountId: string;
  isRecurring?: boolean;
}
