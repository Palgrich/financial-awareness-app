import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@moneygator_achievements';

/**
 * Counters that can't be derived from other stores.
 * (lessonsCompleted, streak, subscriptionsCancelled, xpTotal come from useStore.)
 */
interface AchievementsPersisted {
  quizzesPassed: number;
  perfectQuizzes: number;
  practicesCompleted: number;
}

interface AchievementsState extends AchievementsPersisted {
  hydrated: boolean;
  /** Record a quiz attempt; counts as passed at >= 60% correct. */
  recordQuiz: (correct: number, total: number) => void;
  /** Record a completed practice action. */
  recordPractice: () => void;
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
  reset: () => void;
}

const initial: AchievementsPersisted = {
  quizzesPassed: 0,
  perfectQuizzes: 0,
  practicesCompleted: 0,
};

export const useAchievementsStore = create<AchievementsState>((set, get) => ({
  ...initial,
  hydrated: false,

  recordQuiz: (correct, total) => {
    if (total <= 0) return;
    const passed = correct / total >= 0.6;
    const perfect = correct === total;
    if (!passed) return;
    set((s) => ({
      quizzesPassed: s.quizzesPassed + 1,
      perfectQuizzes: s.perfectQuizzes + (perfect ? 1 : 0),
    }));
    get().persist();
  },

  recordPractice: () => {
    set((s) => ({ practicesCompleted: s.practicesCompleted + 1 }));
    get().persist();
  },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AchievementsPersisted>;
        set({
          quizzesPassed: parsed.quizzesPassed ?? 0,
          perfectQuizzes: parsed.perfectQuizzes ?? 0,
          practicesCompleted: parsed.practicesCompleted ?? 0,
        });
      }
    } catch (_) {
      // ignore
    } finally {
      set({ hydrated: true });
    }
  },

  persist: async () => {
    const s = get();
    const data: AchievementsPersisted = {
      quizzesPassed: s.quizzesPassed,
      perfectQuizzes: s.perfectQuizzes,
      practicesCompleted: s.practicesCompleted,
    };
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(data));
    } catch (_) {
      // ignore
    }
  },

  reset: () => {
    set({ ...initial });
    get().persist();
  },
}));
