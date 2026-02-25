import type {
  MetricSnapshot,
  Lesson,
  LearningPath,
  Challenge,
} from '../types/domain';

export const mockMetrics: MetricSnapshot = {
  financialHealth: 82,
  awarenessScore: 74,
  cashControlScore: 68,
  subscriptionScore: 45,
  creditScore: 90,
};

export const mockLessons: Lesson[] = [
  { id: 'lesson-1', title: 'The 30% credit rule explained', minutes: 2, status: 'done', lastStartedAt: '2026-02-18T10:00:00.000Z' },
  { id: 'lesson-2', title: 'How to track your spending in 5 min', minutes: 5, status: 'in_progress', lastStartedAt: '2026-02-20T14:30:00.000Z' },
  { id: 'lesson-3', title: 'Why subscriptions drain your wealth', minutes: 2, status: 'not_started' },
  { id: 'lesson-4', title: 'Building an emergency fund', minutes: 4, status: 'not_started' },
  { id: 'lesson-5', title: 'What is a credit score?', minutes: 3, status: 'done', lastStartedAt: '2026-02-15T09:00:00.000Z' },
];

export const mockLearningPaths: LearningPath[] = [
  { id: 'path-1', title: 'Money basics', lessonsCount: 8, lastStartedAt: '2026-02-20T14:30:00.000Z' },
  { id: 'path-2', title: 'Credit & debt', lessonsCount: 6, lastStartedAt: '2026-02-18T10:00:00.000Z' },
  { id: 'path-3', title: 'Subscriptions & spending', lessonsCount: 5, lastStartedAt: '2026-02-19T11:00:00.000Z' },
  { id: 'path-4', title: 'Savings & goals', lessonsCount: 7, lastStartedAt: undefined },
];

export const mockChallenges: Challenge[] = [
  { id: 'challenge-1', title: '7-day spending log', status: 'in_progress', lastUpdatedAt: '2026-02-21T08:00:00.000Z' },
  { id: 'challenge-2', title: 'Cancel one subscription', status: 'todo' },
  { id: 'challenge-3', title: 'Review last statement', status: 'done', lastUpdatedAt: '2026-02-18T16:00:00.000Z' },
];
