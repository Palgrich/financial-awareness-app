import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Text,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Menu } from 'lucide-react-native';
import {
  AppHeader,
  AppHeaderDark,
  FinancialPulseCard,
  FinancialWeatherCard,
  MetricCard,
  CashControlCard,
  PulseTiles,
  TodaysActionCard,
} from '../components';
import { colors } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DashboardStackParamList } from '../navigation/types';
import { useProgressStore } from '../state/progressStore';
import type { CashControlStatus } from '../domain/cashControl';
import { getMetrics } from '../api/endpoints/metrics';
import { queryKeys } from '../api/queryKeys';
import { getFinancialWeather } from '../utils/financialWeather';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'DashboardHome'>;

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return 'Good morning 👋';
  if (h >= 12 && h < 18) return 'Good afternoon 👋';
  return 'Good evening 👋';
}

function scoreToFilled(score: number): number {
  if (score <= 20) return 1;
  if (score <= 40) return 2;
  if (score <= 60) return 3;
  if (score <= 80) return 4;
  return 5;
}

function statusToType(s: string): 'good' | 'moderate' | 'high' | 'strong' {
  if (s === 'Strong' || s === 'Good') return s === 'Strong' ? 'strong' : 'good';
  if (s === 'Moderate') return 'moderate';
  return 'high';
}

/** Next lesson suggestion from userData (priority order). */
function getNextLesson(userData: ReturnType<typeof useProgressStore.getState>['userData']): {
  title: string;
  meta: string;
} | null {
  if (userData.subscriptionStatus === 'High') {
    return { title: 'Why subscriptions drain your wealth', meta: '2 min' };
  }
  if (userData.creditCardStatus !== 'Strong') {
    return { title: 'The 30% credit rule explained', meta: '2 min' };
  }
  if (userData.cashControlStatus === 'Moderate' || userData.cashControlStatus === 'High') {
    return { title: 'How to track your spending in 5 min', meta: '5 min' };
  }
  return { title: 'Why subscriptions drain your wealth', meta: '2 min' };
}

export function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<Nav>();
  const { isDark, colors: themeColors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const queryClient = useQueryClient();
  const { data: metrics, isLoading: metricsLoading, isError: metricsError, refetch: refetchMetrics } = useQuery({
    queryKey: queryKeys.metrics(),
    queryFn: getMetrics,
  });

  const userData = useProgressStore((s) => s.userData);
  const notificationsViewedAt = useProgressStore((s) => s.notificationsViewedAt);
  const loadUserData = useProgressStore((s) => s.loadUserData);
  const loadNotificationsViewed = useProgressStore((s) => s.loadNotificationsViewed);
  const setNotificationsViewed = useProgressStore((s) => s.setNotificationsViewed);

  const weather = useMemo(() => {
    const baseScores = {
      financialHealth: metrics?.financialHealth ?? userData.financialHealthScore,
      awarenessScore:
        metrics?.awarenessScore ?? userData.healthBreakdown.financialAwareness.score,
      cashControlScore: metrics?.cashControlScore ?? userData.healthBreakdown.cashControl.score,
      subscriptionScore:
        metrics?.subscriptionScore ?? userData.healthBreakdown.subscriptionLoad.score,
      creditScore:
        metrics?.creditScore ?? userData.healthBreakdown.creditCardPayments.score,
    };

    return getFinancialWeather({
      ...baseScores,
      subscriptionCount: userData.subscriptionCount,
      subscriptionMonthly: userData.subscriptionMonthly,
      spendingThisMonth: userData.expensesThisMonth,
      spendingLastMonth: userData.expensesLastMonth,
      creditPaymentDueDays: userData.daysUntilDue,
      creditPaymentAmount: userData.minimumDue,
      creditCardName: 'Chase Sapphire',
      daysUntilPayday: userData.daysUntilPaycheck,
      amountLeftUntilPayday: userData.availableBalance,
      dailyBudget: userData.dailyBudgetSafe,
      actualDailySpend: userData.avgDailySpendLast3Days,
    });
  }, [metrics, userData]);

  useEffect(() => {
    loadUserData();
    loadNotificationsViewed();
  }, [loadUserData, loadNotificationsViewed]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      new Promise((r) => setTimeout(r, 1500)),
      loadUserData(),
      queryClient.invalidateQueries({ queryKey: queryKeys.metrics() }),
    ]);
    setRefreshing(false);
  }, [loadUserData, queryClient]);

  const hasUrgentNotifications = useMemo(() => {
    const urgent = userData.notifications.some((n) => n.type === 'urgent');
    if (!urgent) return false;
    return notificationsViewedAt == null;
  }, [userData.notifications, notificationsViewedAt]);

  const headerRight = (
    <View style={styles.headerRight}>
      <TouchableOpacity
        onPress={() => {
          setNotificationsViewed();
          navigation.navigate('Notifications');
        }}
        style={styles.headerIcon}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Bell size={22} color={themeColors.textPrimary} strokeWidth={2} />
        {hasUrgentNotifications ? (
          <View style={styles.bellBadge} />
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Menu')}
        style={styles.headerIcon}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Menu size={22} color={themeColors.textPrimary} strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );

  const Header = isDark ? AppHeaderDark : AppHeader;
  const greeting = getGreeting();
  const nextLesson = useMemo(() => getNextLesson(userData), [userData]);
  const cashControlStatus: CashControlStatus =
    userData.cashControlStatus === 'Good'
      ? 'good'
      : userData.cashControlStatus === 'Moderate'
        ? 'moderate'
        : 'high';

  // FinancialPulseCard props
  const healthPercent = metrics?.financialHealth ?? 70;
  const pulseStatus =
    healthPercent < 40
      ? 'Critical'
      : healthPercent < 55
        ? 'At Risk'
        : healthPercent < 70
          ? 'Stable'
          : healthPercent < 85
            ? 'Good'
            : 'Thriving';
  const topAction = weather.actions[0];
  const totalActions = weather.actions.length;

  // PulseTiles props
  const learnData = undefined as
    | { lessons: Array<{ status: string; title?: string; minutes?: number }> }
    | undefined;
  const cashBalance = userData?.availableBalance ?? 27520;
  const cashStatus =
    cashBalance > 5000 ? 'good' : cashBalance > 1000 ? 'moderate' : 'high';
  const completedLessons =
    learnData?.lessons.filter((l) => l.status === 'done').length ?? 6;
  const learnStatus =
    completedLessons > 10 ? 'good' : completedLessons > 3 ? 'moderate' : 'high';
  const subScore = metrics?.subscriptionScore ?? 45;
  const subStatus =
    subScore >= 70 ? 'good' : subScore >= 50 ? 'moderate' : 'high';

  // TodaysActionCard props
  const firstIncompleteLesson = learnData?.lessons.find(
    (l) => l.status !== 'done'
  );
  const todayTitle =
    firstIncompleteLesson?.title ?? 'Review your subscriptions today';
  const todaySubtitle = firstIncompleteLesson
    ? `${firstIncompleteLesson.minutes} min read · Start now`
    : 'Tap to start';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={themeColors.backgroundGradient}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: tabBarHeight + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366F1"
          />
        }
      >
        {metricsError ? (
          <View style={[styles.errorCard, { backgroundColor: isDark ? '#7F1D1D' : undefined, borderColor: isDark ? '#991B1B' : undefined }]}>
            <Text style={[styles.errorCardTitle, { color: themeColors.textPrimary }]}>Can't load data</Text>
            <Text style={[styles.errorCardSubtitle, { color: themeColors.textMuted }]}>Pull to refresh or try again.</Text>
            <Pressable style={({ pressed }) => [styles.errorCardButton, pressed && styles.errorCardButtonPressed]} onPress={() => refetchMetrics()}>
              <Text style={styles.errorCardButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}
        <Header
          greeting={greeting}
          title="Progress"
          subtitle="Your money clarity"
          right={headerRight}
        />
        <View style={styles.main}>
          <FinancialPulseCard
            healthPercent={healthPercent}
            status={pulseStatus}
            description={weather.description}
            topAction={topAction}
            totalActions={totalActions}
            onSeeAll={() => {
              /* TODO: show all actions modal */
            }}
            onActionPress={() => {
              /* TODO: navigate based on action */
            }}
          />

          <PulseTiles
            cash={{ balance: cashBalance, status: cashStatus }}
            learn={{ completed: completedLessons, status: learnStatus }}
            subscriptions={{
              monthly: userData?.subscriptionMonthly ?? 287,
              count: userData?.subscriptionCount ?? 16,
              status: subStatus,
            }}
            onCashPress={() =>
              (navigation.getParent() as any)?.navigate('Transactions')
            }
            onLearnPress={() =>
              (navigation.getParent() as any)?.navigate('Learn')
            }
            onSubscriptionsPress={() =>
              (navigation.getParent() as any)?.navigate('Subscriptions')
            }
          />

          <TodaysActionCard
            title={todayTitle}
            subtitle={todaySubtitle}
            onPress={() =>
              (navigation.getParent() as any)?.navigate('Learn')
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 0 },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: { padding: 4, position: 'relative' },
  bellBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  main: {
    paddingHorizontal: 24,
    gap: 16,
    paddingTop: 24,
  },
  errorCard: {
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  errorCardSubtitle: {
    fontSize: 14,
    color: colors.text.muted,
    marginBottom: 12,
  },
  errorCardButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  errorCardButtonPressed: { opacity: 0.8 },
  errorCardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.white,
  },
});
