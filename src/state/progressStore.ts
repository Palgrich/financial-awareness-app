import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ProgressUserData, HealthBreakdown } from '../data/progressUserData';
import {
  defaultProgressUserData,
  getAwarenessLevelName,
  getAwarenessLevelNumber,
  awarenessScore,
  totalHealthScore,
} from '../data/progressUserData';

const KEY_HINT = '@progress_healthCardHintSeen';
const KEY_DATA = '@progress_userData';
const KEY_NOTIFICATIONS_VIEWED = '@progress_notificationsViewed';

interface ProgressState {
  userData: ProgressUserData;
  healthCardHintSeen: boolean;
  notificationsViewedAt: number | null;

  setHealthCardHintSeen: () => Promise<void>;
  loadHintSeen: () => Promise<void>;
  setNotificationsViewed: () => void;
  loadNotificationsViewed: () => Promise<void>;

  setUserData: (data: Partial<ProgressUserData>) => void;
  loadUserData: () => Promise<void>;
  persistUserData: () => Promise<void>;

  /** Lesson completed in Learn tab: update awareness + health breakdown. */
  completeLesson: (totalLessons: number) => void;

  /** Subscription marked cut and applied: update subscription load + health. */
  applySubscriptionCuts: (cutNames: string[]) => void;

  /** Payment confirmed on time: update credit card component. */
  confirmPayment: () => void;

  /** Set subscription keep/cut (for list screen). */
  setSubscriptionKeep: (name: string, keep: boolean | null) => void;

  /** Recompute health breakdown from current userData (e.g. after awareness/sub changes). */
  refreshHealthBreakdown: () => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  userData: defaultProgressUserData,
  healthCardHintSeen: false,
  notificationsViewedAt: null,

  setHealthCardHintSeen: async () => {
    await AsyncStorage.setItem(KEY_HINT, '1');
    set({ healthCardHintSeen: true });
  },

  loadHintSeen: async () => {
    const v = await AsyncStorage.getItem(KEY_HINT);
    set({ healthCardHintSeen: v === '1' });
  },

  setNotificationsViewed: () => {
    const now = Date.now();
    set({ notificationsViewedAt: now });
    AsyncStorage.setItem(KEY_NOTIFICATIONS_VIEWED, String(now));
  },

  loadNotificationsViewed: async () => {
    const v = await AsyncStorage.getItem(KEY_NOTIFICATIONS_VIEWED);
    set({ notificationsViewedAt: v ? parseInt(v, 10) : null });
  },

  setUserData: (data) => {
    set((s) => ({ userData: { ...s.userData, ...data } }));
    get().persistUserData();
  },

  loadUserData: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY_DATA);
      if (raw) {
        const parsed = JSON.parse(raw) as ProgressUserData;
        set((s) => ({ userData: { ...s.userData, ...parsed } }));
      }
    } catch (_) {}
  },

  persistUserData: async () => {
    try {
      await AsyncStorage.setItem(KEY_DATA, JSON.stringify(get().userData));
    } catch (_) {}
  },

  completeLesson: (totalLessons) => {
    const s = get();
    const completed = s.userData.financialAwareness.lessonsCompleted + 1;
    const levelName = getAwarenessLevelName(completed);
    const levelNum = getAwarenessLevelNumber(completed);
    const awarenessComponentScore = awarenessScore(completed, totalLessons);
    const newBreakdown: HealthBreakdown = {
      ...s.userData.healthBreakdown,
      financialAwareness: {
        ...s.userData.healthBreakdown.financialAwareness,
        score: awarenessComponentScore,
        max: 20,
        status: awarenessComponentScore >= 18 ? 'Good' : awarenessComponentScore >= 14 ? 'Moderate' : 'High',
      },
    };
    const total = totalHealthScore(newBreakdown);
    set({
      userData: {
        ...s.userData,
        financialHealthScore: total,
        healthBreakdown: newBreakdown,
        financialAwareness: {
          ...s.userData.financialAwareness,
          lessonsCompleted: completed,
          totalLessons,
          level: levelNum,
          levelName,
        },
      },
    });
    get().persistUserData();
  },

  applySubscriptionCuts: (cutNames) => {
    const s = get();
    const subs = s.userData.subscriptions.map((sub) =>
      cutNames.includes(sub.name) ? { ...sub, keep: false } : sub
    );
    const cutMonthly = subs
      .filter((sub) => cutNames.includes(sub.name))
      .reduce((sum, sub) => sum + sub.price, 0);
    const newMonthly = s.userData.subscriptionMonthly - cutMonthly;
    const newCount = s.userData.subscriptionCount - cutNames.length;
    const subscriptionScore = Math.min(
      30,
      Math.round((newCount / 16) * 30) + Math.round((1 - newMonthly / 300) * 10)
    );
    const newBreakdown: HealthBreakdown = {
      ...s.userData.healthBreakdown,
      subscriptionLoad: {
        score: Math.min(30, subscriptionScore + 5),
        max: 30,
        status: subscriptionScore >= 25 ? 'Good' : subscriptionScore >= 18 ? 'Moderate' : 'High',
      },
    };
    const total = totalHealthScore(newBreakdown);
    set({
      userData: {
        ...s.userData,
        subscriptions: subs,
        subscriptionMonthly: newMonthly,
        subscriptionCount: newCount,
        subscriptionYearly: Math.round(newMonthly * 12 * 100) / 100,
        financialHealthScore: total,
        healthBreakdown: newBreakdown,
        savedTotal: s.userData.savedTotal + cutMonthly * 12,
      },
    });
    get().persistUserData();
  },

  confirmPayment: () => {
    const s = get();
    const newBreakdown: HealthBreakdown = {
      ...s.userData.healthBreakdown,
      creditCardPayments: { score: 25, max: 25, status: 'Strong' },
    };
    set({
      userData: {
        ...s.userData,
        financialHealthScore: totalHealthScore(newBreakdown),
        healthBreakdown: newBreakdown,
        lastStatementBalance: 0,
        daysUntilDue: 30,
      },
    });
    get().persistUserData();
  },

  setSubscriptionKeep: (name, keep) => {
    set((s) => ({
      userData: {
        ...s.userData,
        subscriptions: s.userData.subscriptions.map((sub) =>
          sub.name === name ? { ...sub, keep } : sub
        ),
      },
    }));
    get().persistUserData();
  },

  refreshHealthBreakdown: () => {
    const s = get();
    const total = totalHealthScore(s.userData.healthBreakdown);
    set({
      userData: {
        ...s.userData,
        financialHealthScore: total,
      },
    });
    get().persistUserData();
  },
}));
