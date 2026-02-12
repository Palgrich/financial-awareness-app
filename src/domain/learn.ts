/**
 * Learn gamification helpers
 */

export const XP_PER_LESSON = 25;

export function getTodayMinutes(lessonProgress: Record<string, string>, lessons: { id: string; durationMin: number }[]): number {
  const today = new Date().toISOString().split('T')[0];
  // We don't track per-day minutes; use completed count * avg as proxy for daily goal
  const completedIds = Object.entries(lessonProgress)
    .filter(([, p]) => p === 'completed')
    .map(([id]) => id);
  return completedIds.reduce((sum, id) => {
    const l = lessons.find((x) => x.id === id);
    return sum + (l?.durationMin ?? 2);
  }, 0);
}
