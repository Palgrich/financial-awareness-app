/**
 * Learn domain helpers: gamification, data-personalized daily lesson,
 * practice routing, and periodic knowledge checks.
 */

import type { Lesson, LessonTopic, PracticeActionType } from '../types';
import type { TabParamList } from '../navigation/types';

export const XP_PER_LESSON = 25;

/** Days after completing a lesson before its first knowledge check is due. */
export const KNOWLEDGE_CHECK_INTERVAL_DAYS = 3;
/** Longer interval after a knowledge check is passed (spaced repetition). */
export const KNOWLEDGE_CHECK_REPEAT_DAYS = 10;

export function getTodayMinutes(lessonProgress: Record<string, string>, lessons: { id: string; durationMin: number }[]): number {
  // We don't track per-day minutes; use completed count * duration as proxy for daily goal.
  const completedIds = Object.entries(lessonProgress)
    .filter(([, p]) => p === 'completed')
    .map(([id]) => id);
  return completedIds.reduce((sum, id) => {
    const l = lessons.find((x) => x.id === id);
    return sum + (l?.durationMin ?? 2);
  }, 0);
}

/** Signals derived from the user's financial data that drive the daily lesson. */
export interface DailyLessonSignals {
  creditDueSoon: boolean;
  highSubscriptionLoad: boolean;
  highSpending: boolean;
  lowSavings: boolean;
}

/** Topic priority given the current signals (most urgent first). */
function prioritizedTopics(signals: DailyLessonSignals): LessonTopic[] {
  const order: LessonTopic[] = [];
  if (signals.creditDueSoon) order.push('credit', 'fees');
  if (signals.highSubscriptionLoad) order.push('subscriptions');
  if (signals.highSpending) order.push('spending', 'fees');
  if (signals.lowSavings) order.push('savings');
  // Always fall back through the rest.
  order.push('fees', 'subscriptions', 'spending', 'savings', 'general');
  return order;
}

/**
 * Pick the personalized lesson of the day from the user's data signals.
 * Prefers a not-yet-completed lesson matching the highest-priority topic;
 * falls back to the first incomplete lesson, then the first lesson.
 */
export function selectDailyLesson(
  lessons: Lesson[],
  signals: DailyLessonSignals,
  completedIds: Set<string>
): Lesson | null {
  if (lessons.length === 0) return null;
  const topics = prioritizedTopics(signals);
  for (const topic of topics) {
    const match = lessons.find((l) => l.topic === topic && !completedIds.has(l.id));
    if (match) return match;
  }
  const firstIncomplete = lessons.find((l) => !completedIds.has(l.id));
  return firstIncomplete ?? lessons[0];
}

/** A short, human reason string for why this lesson was picked today. */
export function dailyLessonReason(lesson: Lesson, signals: DailyLessonSignals): string {
  switch (lesson.topic) {
    case 'credit':
    case 'fees':
      return signals.creditDueSoon ? 'Your credit card payment is due soon.' : 'Trim avoidable bank fees.';
    case 'subscriptions':
      return signals.highSubscriptionLoad ? 'Your subscriptions are eating a big share of income.' : 'Keep your subscriptions in check.';
    case 'spending':
      return signals.highSpending ? "You're spending faster than usual this month." : 'Build a simple spending plan.';
    case 'savings':
      return signals.lowSavings ? "You're behind on your savings goal." : 'Grow your savings steadily.';
    default:
      return 'Personalized for you.';
  }
}

/** Emoji for a lesson topic (used on cards). */
export function topicEmoji(topic: LessonTopic | undefined): string {
  switch (topic) {
    case 'credit':
      return '💳';
    case 'subscriptions':
      return '🔄';
    case 'spending':
      return '💰';
    case 'savings':
      return '🏦';
    case 'fees':
      return '🧾';
    default:
      return '📚';
  }
}

/** Map a practice action to the bottom-tab route it should open. */
export function practiceRouteFor(action: PracticeActionType): keyof TabParamList {
  switch (action) {
    case 'review_subscriptions':
      return 'Subscriptions';
    case 'set_budget':
      return 'Budget';
    case 'review_transactions':
      return 'Transactions';
    case 'review_debts':
      return 'Debts';
    case 'add_savings_goal':
      return 'Profile';
    default:
      return 'Dashboard';
  }
}

/** State stored per lesson for periodic knowledge checks. */
export interface KnowledgeCheck {
  /** ISO date (YYYY-MM-DD) when the next check becomes due. */
  dueDate: string;
  /** ISO date of the last passed review, or null if never reviewed. */
  lastReviewedDate: string | null;
}

function isoDateInDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function scheduleFirstCheck(): KnowledgeCheck {
  return { dueDate: isoDateInDays(KNOWLEDGE_CHECK_INTERVAL_DAYS), lastReviewedDate: null };
}

export function scheduleRepeatCheck(): KnowledgeCheck {
  const today = new Date().toISOString().split('T')[0];
  return { dueDate: isoDateInDays(KNOWLEDGE_CHECK_REPEAT_DAYS), lastReviewedDate: today };
}

/** Lessons whose knowledge check is due today or earlier, and that have a quiz. */
export function getDueKnowledgeChecks(
  checks: Record<string, KnowledgeCheck>,
  lessons: Lesson[]
): Lesson[] {
  const today = new Date().toISOString().split('T')[0];
  return Object.entries(checks)
    .filter(([, c]) => c.dueDate <= today)
    .map(([lessonId]) => lessons.find((l) => l.id === lessonId))
    .filter((l): l is Lesson => l != null && (l.quiz?.length ?? 0) > 0);
}
