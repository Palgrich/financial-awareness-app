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
  FinancialHealthHeroCard,
  MetricCard,
  CashControlCard,
  PaydayStatusCard,
} from '../components';
import { gradientColors, colors } from '../theme/tokens';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DashboardStackParamList } from '../navigation/types';
import { useProgressStore } from '../state/progressStore';
import type { CashControlStatus } from '../domain/cashControl';
import { getMetrics } from '../api/endpoints/metrics';
import { queryKeys } from '../api/queryKeys';

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
  const [refreshing, setRefreshing] = useState(false);

  const queryClient = useQueryClient();
  const { data: metrics, isLoading: metricsLoading, isError: metricsError, refetch: refetchMetrics } = useQuery({
    queryKey: queryKeys.metrics(),
    queryFn: getMetrics,
  });

  const userData = useProgressStore((s) => s.userData);
  const healthCardHintSeen = useProgressStore((s) => s.healthCardHintSeen);
  const notificationsViewedAt = useProgressStore((s) => s.notificationsViewedAt);
  const loadHintSeen = useProgressStore((s) => s.loadHintSeen);
  const loadUserData = useProgressStore((s) => s.loadUserData);
  const loadNotificationsViewed = useProgressStore((s) => s.loadNotificationsViewed);
  const setHealthCardHintSeen = useProgressStore((s) => s.setHealthCardHintSeen);
  const setNotificationsViewed = useProgressStore((s) => s.setNotificationsViewed);

  const financialHealthScore = metrics?.financialHealth ?? 0;
  const heroStatus =
    financialHealthScore >= 80 ? 'Good' : financialHealthScore >= 60 ? 'Moderate' : 'High';
  const heroStatusColor =
    financialHealthScore >= 80 ? '#22C55E' : financialHealthScore >= 60 ? '#F59E0B' : '#EF4444';

  useEffect(() => {
    loadHintSeen();
    loadUserData();
    loadNotificationsViewed();
  }, [loadHintSeen, loadUserData, loadNotificationsViewed]);

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
        <Bell size={22} color="#0F172A" strokeWidth={2} />
        {hasUrgentNotifications ? (
          <View style={styles.bellBadge} />
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Menu')}
        style={styles.headerIcon}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Menu size={22} color="#0F172A" strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );

  const greeting = getGreeting();
  const nextLesson = useMemo(() => getNextLesson(userData), [userData]);
  const showPaycheckCard = userData.availableBalance < 800;
  const cashControlStatus: CashControlStatus =
    userData.cashControlStatus === 'Good'
      ? 'good'
      : userData.cashControlStatus === 'Moderate'
        ? 'moderate'
        : 'high';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={gradientColors.background}
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
          <View style={styles.errorCard}>
            <Text style={styles.errorCardTitle}>Can't load data</Text>
            <Text style={styles.errorCardSubtitle}>Pull to refresh or try again.</Text>
            <Pressable style={({ pressed }) => [styles.errorCardButton, pressed && styles.errorCardButtonPressed]} onPress={() => refetchMetrics()}>
              <Text style={styles.errorCardButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}
        <AppHeader
          greeting={greeting}
          title="Progress"
          subtitle="Your money clarity"
          right={headerRight}
        />
        <View style={styles.main}>
          <FinancialHealthHeroCard
            score={metricsLoading ? '--' : (metrics?.financialHealth ?? 0)}
            maxScore={100}
            status={heroStatus}
            statusColor={heroStatusColor}
            description="Your finances are stable with room to improve"
            filledSegments={scoreToFilled(financialHealthScore)}
            totalSegments={5}
            onPress={() => navigation.navigate('HealthBreakdown')}
            showTapHint
            showPulse={!healthCardHintSeen}
            onHintPulseDone={() => setHealthCardHintSeen()}
          />

          {showPaycheckCard ? (
            <PaydayStatusCard
              daysUntilPaycheck={userData.daysUntilPaycheck}
              availableBalance={userData.availableBalance}
              targetDaily={userData.dailyBudgetSafe}
              actualDaily={userData.avgDailySpendLast3Days}
              onPress={() => navigation.navigate('PaycheckBreakdown')}
            />
          ) : null}

          <CashControlCard
            expensesThisMonth={userData.expensesThisMonth}
            expensesChangePct={
              userData.expensesLastMonth > 0
                ? ((userData.expensesThisMonth - userData.expensesLastMonth) /
                    userData.expensesLastMonth) *
                  100
                : null
            }
            balanceCurrent={userData.currentBalance}
            balanceChangePct={null}
            status={cashControlStatus}
            filledSegments={scoreToFilled(metrics?.cashControlScore ?? 0)}
            weeklySpending={userData.weeklySpending}
            topCategories={userData.topCategories}
            onPress={() => navigation.navigate('TransactionsHome')}
            onCategoriesPress={() => navigation.navigate('TransactionsHome')}
          />

          <MetricCard
            title="Financial Awareness"
            value={
              metricsLoading
                ? '--'
                : `${userData.financialAwareness.lessonsCompleted} / ${userData.financialAwareness.totalLessons} lessons completed`
            }
            status={statusToType(userData.healthBreakdown.financialAwareness.status)}
            filledSegments={scoreToFilled(metrics?.awarenessScore ?? 0)}
            variant="awareness"
            levelSubtitle={userData.financialAwareness.levelName}
            nextLessonTitle={nextLesson?.title}
            nextLessonMeta={nextLesson?.meta}
            onNextLessonPress={() =>
              (navigation.getParent() as any)?.navigate('Learn', {
                screen: 'LearnHome',
              })
            }
          />

          <MetricCard
            title="Subscription Load"
            value={
              metricsLoading
                ? '--'
                : `$${userData.subscriptionMonthly.toFixed(2)} / month`
            }
            status={statusToType(userData.subscriptionStatus)}
            description={`${userData.subscriptionCount} active`}
            filledSegments={scoreToFilled(metrics?.subscriptionScore ?? 0)}
            variant="subscription"
            yearlyText={`That's $${userData.subscriptionYearly.toLocaleString()} / year`}
            secondaryActionLabel="See all subscriptions"
            primaryActionLabel="Start Cleanse"
            onSecondaryAction={() =>
              navigation.navigate('ProgressSubscriptionList')
            }
            onPrimaryAction={() =>
              (navigation.getParent() as any)?.navigate('Learn', {
                screen: 'QuestSubscriptionCleanse',
                params: { step: 1 },
              })
            }
          />

          <MetricCard
            title="Credit Card Payments"
            value={
              metricsLoading ? '--' : `$${userData.lastStatementBalance}`
            }
            status={statusToType(userData.creditCardStatus)}
            description="Last statement"
            filledSegments={scoreToFilled(metrics?.creditScore ?? 0)}
            variant="credit"
            actionLabel="Details"
            onPress={() => navigation.navigate('CreditCardDetails')}
            urgencyBanner={
              userData.daysUntilDue <= 7 && userData.daysUntilDue >= 0
                ? {
                    text: `Payment due in ${userData.daysUntilDue} days`,
                    secondLine: `$${userData.minimumDue.toFixed(2)} minimum due`,
                    onPayNow: () => {},
                  }
                : undefined
            }
            dueDateText={
              userData.daysUntilDue > 7
                ? `Next due date: ${userData.nextDueDate} · Estimated: ~$${userData.estimatedPayment}`
                : undefined
            }
            paymentHistory={userData.paymentHistory}
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
