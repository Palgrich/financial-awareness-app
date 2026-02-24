/**
 * Persist Learn quest progress and Subscription Cleanse decisions.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SubscriptionItem } from './learnUserData';

const KEY_QUEST_PROGRESS = '@learn_quest_progress';
const KEY_SUBSCRIPTION_DECISIONS = '@learn_subscription_cleanse_decisions';
const KEY_STREAK = '@learn_streak';
const KEY_SAVED_TOTAL = '@learn_saved_total';

export interface QuestProgressState {
  subscriptionCleanse: number;
  creditCardBasics: number;
  emergencyFund: number;
}

export type SubscriptionDecision = 'keep' | 'cut';

export async function getQuestProgress(): Promise<QuestProgressState> {
  try {
    const raw = await AsyncStorage.getItem(KEY_QUEST_PROGRESS);
    if (!raw) return { subscriptionCleanse: 0, creditCardBasics: 0, emergencyFund: 0 };
    return JSON.parse(raw);
  } catch {
    return { subscriptionCleanse: 0, creditCardBasics: 0, emergencyFund: 0 };
  }
}

export async function setQuestStep(
  questKey: keyof QuestProgressState,
  step: number
): Promise<void> {
  const current = await getQuestProgress();
  const next = { ...current, [questKey]: step };
  await AsyncStorage.setItem(KEY_QUEST_PROGRESS, JSON.stringify(next));
}

export async function getSubscriptionDecisions(): Promise<Record<string, SubscriptionDecision>> {
  try {
    const raw = await AsyncStorage.getItem(KEY_SUBSCRIPTION_DECISIONS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function setSubscriptionDecision(
  name: string,
  decision: SubscriptionDecision
): Promise<void> {
  const current = await getSubscriptionDecisions();
  const next = { ...current, [name]: decision };
  await AsyncStorage.setItem(KEY_SUBSCRIPTION_DECISIONS, JSON.stringify(next));
}

export async function getStreak(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(KEY_STREAK);
    return raw != null ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

export async function setStreak(value: number): Promise<void> {
  await AsyncStorage.setItem(KEY_STREAK, String(value));
}

export async function getSavedTotal(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(KEY_SAVED_TOTAL);
    return raw != null ? parseFloat(raw) : 0;
  } catch {
    return 0;
  }
}

export async function addToSavedTotal(amount: number): Promise<number> {
  const current = await getSavedTotal();
  const next = current + amount;
  await AsyncStorage.setItem(KEY_SAVED_TOTAL, String(next));
  return next;
}
