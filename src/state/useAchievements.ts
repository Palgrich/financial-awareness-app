import { useMemo } from 'react';
import { useStore } from './store';
import { useAchievementsStore } from './achievementsStore';
import {
  buildAchievements,
  countUnlocked,
  type Achievement,
} from '../domain/achievements';

/**
 * Assembles live achievement inputs from the app's stores and returns the
 * full achievement list plus unlocked count. Metrics that already exist in
 * state (lessons, streak, cancelled subscriptions, XP) are derived here;
 * quiz/practice counters come from the achievements store.
 */
export function useAchievements(): { achievements: Achievement[]; unlocked: number; total: number } {
  const lessonProgress = useStore((s) => s.lessonProgress);
  const streak = useStore((s) => s.streak);
  const xpTotal = useStore((s) => s.xpTotal);
  const subscriptions = useStore((s) => s.subscriptions);
  const quizzesPassed = useAchievementsStore((s) => s.quizzesPassed);
  const perfectQuizzes = useAchievementsStore((s) => s.perfectQuizzes);
  const practicesCompleted = useAchievementsStore((s) => s.practicesCompleted);

  return useMemo(() => {
    const lessonsCompleted = Object.values(lessonProgress).filter((p) => p === 'completed').length;
    const subscriptionsCancelled = subscriptions.filter((s) => s.status === 'cancelled').length;
    const achievements = buildAchievements({
      lessonsCompleted,
      streak,
      quizzesPassed,
      perfectQuizzes,
      practicesCompleted,
      subscriptionsCancelled,
      xpTotal,
    });
    return {
      achievements,
      unlocked: countUnlocked(achievements),
      total: achievements.length,
    };
  }, [lessonProgress, streak, xpTotal, subscriptions, quizzesPassed, perfectQuizzes, practicesCompleted]);
}
