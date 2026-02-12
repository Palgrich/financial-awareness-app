import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Transaction,
  Account,
  Institution,
  Subscription,
  Insight,
  Lesson,
  Challenge,
  UserPreferences,
  Debt,
  Budget,
} from '../types';
import {
  mockTransactions,
  mockAccounts,
  mockInstitutions,
  mockSubscriptions,
  mockInsights,
  mockLessons,
  mockChallenges,
} from '../data/mock';

const PREF_KEY = '@finance_prefs';
const DATA_KEY = '@finance_data';
const SCOPE_KEY = '@finance_scope';

export type LessonProgress = 'not_started' | 'in_progress' | 'completed';

interface PersistedData {
  subscriptions: Subscription[];
  lessonProgress: Record<string, LessonProgress>;
  challengeStatus: Record<string, Challenge['status']>;
  debts: Debt[];
  budget: Budget | null;
  xpTotal: number;
  streak: number;
  lastLearnDate: string | null;
  dailyGoalMinutes: number;
  todayLearnedMinutes: number;
  todayLearnDate: string | null;
}

interface AppState {
  // Data
  institutions: Institution[];
  transactions: Transaction[];
  accounts: Account[];
  subscriptions: Subscription[];
  insights: Insight[];
  lessons: Lesson[];
  challenges: Challenge[];
  debts: Debt[];
  budget: Budget | null;
  // Scope (multi-institution)
  selectedInstitutionId: string | null;
  // Progress
  lessonProgress: Record<string, LessonProgress>;
  xpTotal: number;
  streak: number;
  lastLearnDate: string | null;
  dailyGoalMinutes: number;
  todayLearnedMinutes: number;
  todayLearnDate: string | null;
  // User
  preferences: UserPreferences;
  // UI
  appLoaded: boolean;
  // Actions
  setSelectedInstitutionId: (id: string | null) => void;
  getVisibleAccounts: () => Account[];
  getVisibleTransactions: () => Transaction[];
  setPreferences: (p: Partial<UserPreferences>) => void;
  setDarkMode: (v: boolean) => void;
  setMonthlyIncome: (v: number) => void;
  setSavingsGoal: (v: number) => void;
  markSubscriptionCancelled: (id: string) => void;
  setLessonProgress: (lessonId: string, progress: LessonProgress) => void;
  setChallengeStatus: (challengeId: string, status: Challenge['status']) => void;
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  updateDebt: (id: string, debt: Partial<Debt>) => void;
  removeDebt: (id: string) => void;
  setDebtStatus: (id: string, status: Debt['status']) => void;
  setBudget: (budget: Budget) => void;
  updateXP: (amount: number, lessonId: string, durationMin?: number) => void;
  updateStreak: () => void;
  setDailyGoalMinutes: (minutes: number) => void;
  resetDemoData: () => void;
  setAppLoaded: (v: boolean) => void;
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
  persistScope: () => Promise<void>;
}

const defaultPrefs: UserPreferences = {
  currency: 'USD',
  monthlyIncome: 3200,
  savingsGoal: 2000,
  darkMode: false,
};

export const useStore = create<AppState>((set, get) => ({
  institutions: mockInstitutions,
  transactions: mockTransactions,
  accounts: mockAccounts,
  selectedInstitutionId: null,
  debts: [],
  budget: null,
  subscriptions: mockSubscriptions,
  insights: mockInsights,
  lessons: mockLessons,
  challenges: mockChallenges,
  lessonProgress: {},
  xpTotal: 0,
  streak: 0,
  lastLearnDate: null,
  dailyGoalMinutes: 5,
  todayLearnedMinutes: 0,
  todayLearnDate: null,
  preferences: defaultPrefs,
  appLoaded: false,

  setSelectedInstitutionId: (id) => {
    set({ selectedInstitutionId: id });
    get().persistScope();
  },

  getVisibleAccounts: () => {
    const state = get();
    if (!state.selectedInstitutionId) return state.accounts;
    return state.accounts.filter((a) => a.institutionId === state.selectedInstitutionId);
  },

  getVisibleTransactions: () => {
    const state = get();
    const visibleIds = new Set(state.getVisibleAccounts().map((a) => a.id));
    return state.transactions.filter((t) => visibleIds.has(t.accountId));
  },

  setPreferences: (p) => {
    set((s) => ({ preferences: { ...s.preferences, ...p } }));
    get().persist();
  },
  setDarkMode: (v) => get().setPreferences({ darkMode: v }),
  setMonthlyIncome: (v) => get().setPreferences({ monthlyIncome: Math.max(0, v) }),
  setSavingsGoal: (v) => get().setPreferences({ savingsGoal: Math.max(0, v) }),

  markSubscriptionCancelled: (id) => {
    set((s) => ({
      subscriptions: s.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, status: 'cancelled' as const } : sub
      ),
    }));
    get().persist();
  },

  setLessonProgress: (lessonId, progress) => {
    set((s) => ({
      lessonProgress: { ...s.lessonProgress, [lessonId]: progress },
    }));
    get().persist();
  },

  setChallengeStatus: (challengeId, status) => {
    set((s) => ({
      challenges: s.challenges.map((c) =>
        c.id === challengeId ? { ...c, status } : c
      ),
    }));
    get().persist();
  },

  addDebt: (debt) => {
    const id = `d-${Date.now()}`;
    set((s) => ({ debts: [...s.debts, { ...debt, id }] }));
    get().persist();
  },
  updateDebt: (id, updates) => {
    set((s) => ({
      debts: s.debts.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
    get().persist();
  },
  removeDebt: (id) => {
    set((s) => ({ debts: s.debts.filter((d) => d.id !== id) }));
    get().persist();
  },
  setDebtStatus: (id, status) => {
    set((s) => ({
      debts: s.debts.map((d) => (d.id === id ? { ...d, status } : d)),
    }));
    get().persist();
  },

  setBudget: (budget) => {
    set({ budget });
    get().persist();
  },

  updateXP: (amount, _lessonId, durationMin: number = 2) => {
    const today = new Date().toISOString().split('T')[0];
    set((s) => {
      const isNewDay = s.todayLearnDate !== today;
      return {
        xpTotal: s.xpTotal + amount,
        lastLearnDate: today,
        todayLearnedMinutes: isNewDay ? durationMin : s.todayLearnedMinutes + durationMin,
        todayLearnDate: today,
      };
    });
    get().updateStreak();
    get().persist();
  },
  updateStreak: () => {
    const today = new Date().toISOString().split('T')[0];
    const s = get();
    if (!s.lastLearnDate) {
      set({ streak: 1, lastLearnDate: today });
      return;
    }
    const last = new Date(s.lastLearnDate + 'T00:00:00');
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - last.getTime()) / 86400000);
    if (diffDays === 0) return;
    if (diffDays === 1) set((state) => ({ streak: state.streak + 1, lastLearnDate: today }));
    else set({ streak: 1, lastLearnDate: today });
  },
  setDailyGoalMinutes: (minutes) => {
    set({ dailyGoalMinutes: Math.max(1, minutes) });
    get().persist();
  },

  resetDemoData: () => {
    set({
      institutions: mockInstitutions,
      transactions: mockTransactions,
      accounts: mockAccounts,
      debts: [],
      subscriptions: mockSubscriptions,
      insights: mockInsights,
      lessons: mockLessons,
      challenges: mockChallenges,
      lessonProgress: {},
      budget: null,
    });
    set((s) => ({
      challenges: s.challenges.map((c) => ({ ...c, status: c.id === 'c1' ? 'in_progress' as const : 'todo' as const })),
    }));
    get().persist();
  },

  setAppLoaded: (v) => set({ appLoaded: v }),

  hydrate: async () => {
    try {
      const [prefStr, dataStr, scopeStr] = await Promise.all([
        AsyncStorage.getItem(PREF_KEY),
        AsyncStorage.getItem(DATA_KEY),
        AsyncStorage.getItem(SCOPE_KEY),
      ]);
      const prefs = prefStr ? (JSON.parse(prefStr) as UserPreferences) : null;
      const data = dataStr ? (JSON.parse(dataStr) as PersistedData) : null;
      const scope = scopeStr ? (JSON.parse(scopeStr) as string | null) : null;
      const today = new Date().toISOString().split('T')[0];
      const loadedSubs = data?.subscriptions;
      const subsUseMock = !Array.isArray(loadedSubs) || !loadedSubs.every((sub: Subscription) => sub?.accountId != null);
      set((s) => ({
        preferences: prefs ? { ...defaultPrefs, ...prefs } : s.preferences,
        selectedInstitutionId: scope !== undefined ? scope : s.selectedInstitutionId,
        subscriptions: data?.subscriptions != null && !subsUseMock ? data.subscriptions : mockSubscriptions,
        lessonProgress: data?.lessonProgress ?? s.lessonProgress,
        debts: data?.debts ?? s.debts,
        budget: data?.budget ?? s.budget,
        xpTotal: data?.xpTotal ?? s.xpTotal,
        streak: data?.streak ?? s.streak,
        lastLearnDate: data?.lastLearnDate ?? s.lastLearnDate,
        dailyGoalMinutes: data?.dailyGoalMinutes ?? s.dailyGoalMinutes,
        todayLearnedMinutes: data?.todayLearnDate === today ? (data?.todayLearnedMinutes ?? 0) : 0,
        todayLearnDate: data?.todayLearnDate === today ? (data?.todayLearnDate ?? today) : today,
      }));
      if (data?.challengeStatus) {
        set((s) => ({
          challenges: s.challenges.map((c) => ({
            ...c,
            status: data.challengeStatus[c.id] ?? c.status,
          })),
        }));
      }
    } catch (_) {}
  },

  persistScope: async () => {
    try {
      const id = get().selectedInstitutionId;
      await AsyncStorage.setItem(SCOPE_KEY, JSON.stringify(id));
    } catch (_) {}
  },

  persist: async () => {
    const s = get();
    try {
      await AsyncStorage.setItem(PREF_KEY, JSON.stringify(s.preferences));
      const data: PersistedData = {
        subscriptions: s.subscriptions,
        lessonProgress: s.lessonProgress,
        challengeStatus: s.challenges.reduce<Record<string, Challenge['status']>>((acc, c) => {
          acc[c.id] = c.status;
          return acc;
        }, {}),
        debts: s.debts,
        budget: s.budget,
        xpTotal: s.xpTotal,
        streak: s.streak,
        lastLearnDate: s.lastLearnDate,
        dailyGoalMinutes: s.dailyGoalMinutes,
        todayLearnedMinutes: s.todayLearnedMinutes,
        todayLearnDate: s.todayLearnDate,
      };
      await AsyncStorage.setItem(DATA_KEY, JSON.stringify(data));
    } catch (_) {}
  },
}));
