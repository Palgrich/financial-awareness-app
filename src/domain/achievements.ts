/**
 * Achievements — replaces the composite Financial Health / Pulse score.
 * Achievements are computed from real user progress (lessons, streak, quizzes,
 * practice actions, subscription cleanup) so they update as the user acts.
 */

export type AchievementCategory = 'learning' | 'consistency' | 'action' | 'mastery';

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: AchievementCategory;
  /** Target count to unlock. */
  target: number;
  /** Which counter this achievement measures. */
  metric: AchievementMetric;
}

export type AchievementMetric =
  | 'lessonsCompleted'
  | 'streak'
  | 'quizzesPassed'
  | 'perfectQuizzes'
  | 'practicesCompleted'
  | 'subscriptionsCancelled'
  | 'xpTotal';

/** Live counters gathered from the app's stores. */
export interface AchievementInputs {
  lessonsCompleted: number;
  streak: number;
  quizzesPassed: number;
  perfectQuizzes: number;
  practicesCompleted: number;
  subscriptionsCancelled: number;
  xpTotal: number;
}

export interface Achievement extends AchievementDef {
  unlocked: boolean;
  /** Current progress toward target (clamped to target). */
  progress: number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // Learning
  { id: 'first_lesson', title: 'First step', description: 'Complete your first lesson', emoji: '🎓', category: 'learning', target: 1, metric: 'lessonsCompleted' },
  { id: 'five_lessons', title: 'Getting sharp', description: 'Complete 5 lessons', emoji: '📚', category: 'learning', target: 5, metric: 'lessonsCompleted' },
  { id: 'ten_lessons', title: 'Money student', description: 'Complete 10 lessons', emoji: '🧠', category: 'learning', target: 10, metric: 'lessonsCompleted' },
  // Consistency
  { id: 'streak_3', title: 'Warming up', description: 'Keep a 3-day streak', emoji: '🔥', category: 'consistency', target: 3, metric: 'streak' },
  { id: 'streak_7', title: 'On a roll', description: 'Keep a 7-day streak', emoji: '⚡', category: 'consistency', target: 7, metric: 'streak' },
  { id: 'streak_30', title: 'Unstoppable', description: 'Keep a 30-day streak', emoji: '🏆', category: 'consistency', target: 30, metric: 'streak' },
  // Mastery (quizzes)
  { id: 'quiz_pass', title: 'Quiz whiz', description: 'Pass your first quiz', emoji: '✅', category: 'mastery', target: 1, metric: 'quizzesPassed' },
  { id: 'quiz_ace', title: 'Perfect score', description: 'Ace a quiz with no mistakes', emoji: '💯', category: 'mastery', target: 1, metric: 'perfectQuizzes' },
  { id: 'quiz_5', title: 'Knowledge check', description: 'Pass 5 quizzes', emoji: '🎯', category: 'mastery', target: 5, metric: 'quizzesPassed' },
  // Action
  { id: 'first_practice', title: 'Doer', description: 'Complete your first practice action', emoji: '🛠️', category: 'action', target: 1, metric: 'practicesCompleted' },
  { id: 'practice_5', title: 'Money in motion', description: 'Complete 5 practice actions', emoji: '🚀', category: 'action', target: 5, metric: 'practicesCompleted' },
  { id: 'sub_slayer', title: 'Subscription slayer', description: 'Cancel an unused subscription', emoji: '✂️', category: 'action', target: 1, metric: 'subscriptionsCancelled' },
  { id: 'sub_slayer_3', title: 'Clean sweep', description: 'Cancel 3 subscriptions', emoji: '🧹', category: 'action', target: 3, metric: 'subscriptionsCancelled' },
  // Mastery (XP)
  { id: 'xp_250', title: 'Rising star', description: 'Earn 250 XP', emoji: '🌟', category: 'mastery', target: 250, metric: 'xpTotal' },
];

/** Build the full achievement list with unlocked/progress from live inputs. */
export function buildAchievements(inputs: AchievementInputs): Achievement[] {
  return ACHIEVEMENTS.map((def) => {
    const current = inputs[def.metric] ?? 0;
    return {
      ...def,
      progress: Math.min(current, def.target),
      unlocked: current >= def.target,
    };
  });
}

export function countUnlocked(achievements: Achievement[]): number {
  return achievements.filter((a) => a.unlocked).length;
}
