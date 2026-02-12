import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

export type TabParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  Budget: undefined;
  Debts: undefined;
  Subscriptions: undefined;
  Coach: undefined;
  Learn: undefined;
  Profile: undefined;
};

export type TransactionsStackParamList = {
  TransactionsHome: undefined;
  TransactionDetail: { transactionId: string };
};

export type BudgetStackParamList = {
  BudgetHome: undefined;
};

export type DebtsStackParamList = {
  DebtsHome: undefined;
};

export type DashboardStackParamList = {
  DashboardHome: undefined;
  Menu: undefined;
  SubscriptionsHome: undefined;
  SubscriptionDetail: { subscriptionId: string };
  Notifications: undefined;
  Settings: undefined;
  CoachHome: undefined;
  TransactionsHome: undefined;
  TransactionDetail: { transactionId: string };
  TransactionsByCategory: { category: string; period?: 'this_month' | 'last_30_days' };
  BudgetSetup: undefined;
  DebtsList: undefined;
  AddDebt: undefined;
  EditDebt: { debtId: string };
};

export type SubscriptionsStackParamList = {
  SubscriptionsHome: undefined;
  SubscriptionDetail: { subscriptionId: string };
};

export type CoachStackParamList = {
  CoachHome: undefined;
};

export type LearnStackParamList = {
  LearnHome: undefined;
  LessonDetail: { lessonId: string };
  ChallengeDetail: { challengeId: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  DebtsList: undefined;
  AddDebt: undefined;
  EditDebt: { debtId: string };
  BudgetSetup: undefined;
};

export type DashboardStackScreenProps<T extends keyof DashboardStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<DashboardStackParamList, T>,
  BottomTabScreenProps<TabParamList, 'Dashboard'>
>;

export type SubscriptionsStackScreenProps<T extends keyof SubscriptionsStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<SubscriptionsStackParamList, T>,
    BottomTabScreenProps<TabParamList, 'Subscriptions'>
  >;

export type LearnStackScreenProps<T extends keyof LearnStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<LearnStackParamList, T>,
  BottomTabScreenProps<TabParamList, 'Learn'>
>;

export type TransactionsStackScreenProps<T extends keyof TransactionsStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<TransactionsStackParamList, T>,
    BottomTabScreenProps<TabParamList, 'Transactions'>
  >;

export type BudgetStackScreenProps<T extends keyof BudgetStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<BudgetStackParamList, T>,
  BottomTabScreenProps<TabParamList, 'Budget'>
>;

export type DebtsStackScreenProps<T extends keyof DebtsStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<DebtsStackParamList, T>,
  BottomTabScreenProps<TabParamList, 'Debts'>
>;
