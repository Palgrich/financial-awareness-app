/**
 * Typed mock data for the Learn tab.
 * Replace with real API/store data when available.
 */

import { colors } from '../theme/tokens';

export type LearnStatus = 'in_progress' | 'not_started' | 'todo' | 'done';

export interface DailyGoalMock {
  minutesTarget: number;
  minutesDone: number;
  streakDays: number;
  xp: number;
}

export interface LearningPathMock {
  id: string;
  title: string;
  lessonsCount: number;
  status: LearnStatus;
  /** ISO date string; for "most recently started" when collapsed */
  lastStartedAt: string | null;
}

export interface LessonMock {
  id: string;
  title: string;
  minutes: number;
  status: LearnStatus;
  lastStartedAt: string | null;
}

export interface ChallengeMock {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  lastUpdatedAt: string | null;
}

export const learnMock = {
  dailyGoal: {
    minutesTarget: 5,
    minutesDone: 2,
    streakDays: 0,
    xp: 125,
  } as DailyGoalMock,

  learningPaths: [
    {
      id: 'fees',
      title: 'Avoid fees',
      lessonsCount: 3,
      status: 'not_started' as LearnStatus,
      lastStartedAt: null,
    },
    {
      id: 'savings',
      title: 'Build savings',
      lessonsCount: 4,
      status: 'in_progress' as LearnStatus,
      lastStartedAt: '2025-02-20T10:00:00Z',
    },
    {
      id: 'cds',
      title: 'Understand CDs',
      lessonsCount: 3,
      status: 'not_started' as LearnStatus,
      lastStartedAt: null,
    },
    {
      id: 'subs',
      title: 'Master subscriptions',
      lessonsCount: 1,
      status: 'not_started' as LearnStatus,
      lastStartedAt: null,
    },
  ] as LearningPathMock[],

  lessons: [
    { id: 'l1', title: 'Checking vs savings', minutes: 3, status: 'done' as LearnStatus, lastStartedAt: '2025-02-18T09:00:00Z' },
    { id: 'l2', title: 'What is APY?', minutes: 2, status: 'done' as LearnStatus, lastStartedAt: '2025-02-18T09:05:00Z' },
    { id: 'l3', title: 'Emergency fund basics', minutes: 4, status: 'in_progress' as LearnStatus, lastStartedAt: '2025-02-20T10:00:00Z' },
    { id: 'l4', title: 'Understanding account fees', minutes: 3, status: 'not_started' as LearnStatus, lastStartedAt: null },
    { id: 'l5', title: 'Overdraft protection', minutes: 2, status: 'not_started' as LearnStatus, lastStartedAt: null },
    { id: 'l6', title: 'ATM fees and networks', minutes: 2, status: 'not_started' as LearnStatus, lastStartedAt: null },
  ] as LessonMock[],

  challenges: [
    { id: 'c1', title: 'Avoid fees this month', status: 'in_progress' as const, lastUpdatedAt: '2025-02-21T08:00:00Z' },
    { id: 'c2', title: 'Cancel 1 unused subscription', status: 'todo' as const, lastUpdatedAt: null },
    { id: 'c3', title: 'Save $50 this week', status: 'todo' as const, lastUpdatedAt: null },
  ] as ChallengeMock[],
};

/** Map Learn status to display label and StatusBadge color (tokens). */
export function learnStatusToLabel(status: LearnStatus): string {
  switch (status) {
    case 'in_progress':
      return 'In progress';
    case 'not_started':
      return 'Not started';
    case 'todo':
      return 'To do';
    case 'done':
      return 'Done';
    default:
      return 'Not started';
  }
}

/** Pill color for lessons/paths: good (done), moderate (in_progress), muted (not_started/todo). */
export function learnStatusToColor(status: LearnStatus): string {
  switch (status) {
    case 'done':
      return colors.status.good;
    case 'in_progress':
      return colors.status.moderate;
    case 'not_started':
    case 'todo':
    default:
      return colors.text.muted;
  }
}
