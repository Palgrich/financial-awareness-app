import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import type { DriverInterpretation } from '../components';
import {
  AppHeader,
  AppHeaderDark,
  LoadingSkeleton,
  DonutChart,
  ScopeSelector,
  FloatingAIButton,
  FinancialAwarenessOverviewCard,
  FinancialHealthHeroCard,
  MetricCard,
} from '../components';
import { gradientColors, colors } from '../theme/tokens';
import type { StatusType } from '../theme/tokens';
import { useStore } from '../state/store';
import { formatCurrency } from '../utils/format';
import type { DashboardStackParamList } from '../navigation/types';
import type { Transaction } from '../types';
import {
  getExpensesForPeriod,
  getCategoryBreakdown,
  type ChartPeriod,
} from '../domain/spending';
import { getSubscriptionLoadPercent } from '../domain/subscriptions';
import { calculateFinancialClarity, getClarityLabel, getClaritySubtext } from '../awareness/score';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'DashboardHome'>;

function driverToStatusColor(d: DriverInterpretation): string {
  return d === 'Strong' ? colors.status.strong : d === 'Moderate' ? colors.status.moderate : colors.status.high;
}

function driverToSegments(d: DriverInterpretation): number {
  return d === 'Strong' ? 5 : d === 'Moderate' ? 3 : 2;
}

function toStatusType(s: string | DriverInterpretation): StatusType {
  const lower = (typeof s === 'string' ? s : s).toLowerCase();
  if (lower === 'strong' || lower === 'good') return 'strong';
  if (lower === 'moderate') return 'moderate';
  return 'high';
}

function useDashboardData(visibleTransactions: Transaction[]) {
  const thisMonth = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    return visibleTransactions.filter((t) => {
      const d = new Date(t.date + 'T00:00:00');
      return d.getFullYear() === y && d.getMonth() === m;
    });
  }, [visibleTransactions]);

  const income = thisMonth.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = thisMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const net = income - expenses;

  return {
    net,
    expenses,
    insights: useStore((s) => s.insights),
  };
}

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const appLoaded = useStore((s) => s.appLoaded);
  const dark = useStore((s) => s.preferences.darkMode);
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('this_month');
  const accounts = useStore((s) => s.accounts);
  const transactions = useStore((s) => s.transactions);
  const selectedInstitutionId = useStore((s) => s.selectedInstitutionId);
  const institutions = useStore((s) => s.institutions);

  const visibleAccounts = useMemo(() => {
    if (!selectedInstitutionId) return accounts;
    return accounts.filter((a) => a.institutionId === selectedInstitutionId);
  }, [accounts, selectedInstitutionId]);

  const visibleTransactions = useMemo(() => {
    const ids = new Set(visibleAccounts.map((a) => a.id));
    return transactions.filter((t) => ids.has(t.accountId));
  }, [transactions, visibleAccounts]);

  const chartExpenses = useMemo(
    () => getExpensesForPeriod(visibleTransactions, chartPeriod),
    [visibleTransactions, chartPeriod]
  );
  const breakdown = useMemo(() => getCategoryBreakdown(chartExpenses), [chartExpenses]);

  const data = useDashboardData(visibleTransactions);

  const cashAccounts = useMemo(
    () => visibleAccounts.filter((a) => a.type === 'checking' || a.type === 'savings'),
    [visibleAccounts]
  );
  const availableCash = useMemo(
    () => cashAccounts.reduce((sum, a) => sum + a.balance, 0),
    [cashAccounts]
  );

  const subscriptions = useStore((s) => s.subscriptions);
  const monthlyIncome = useStore((s) => s.preferences.monthlyIncome);
  const visibleAccountIds = useMemo(() => new Set(visibleAccounts.map((a) => a.id)), [visibleAccounts]);
  const scopedSubscriptions = useMemo(
    () => subscriptions.filter((s) => visibleAccountIds.has(s.accountId)),
    [subscriptions, visibleAccountIds]
  );
  const activeSubsTotal = useMemo(
    () =>
      scopedSubscriptions
        .filter((s) => s.status === 'active' || s.status === 'trial')
        .reduce((sum, s) => sum + s.monthlyCost, 0),
    [scopedSubscriptions]
  );
  const subscriptionLoadPercent = getSubscriptionLoadPercent(activeSubsTotal, monthlyIncome);
  const activeSubs = useMemo(
    () => scopedSubscriptions.filter((s) => s.status === 'active' || s.status === 'trial'),
    [scopedSubscriptions]
  );
  const clarityResult = useMemo(
    () =>
      calculateFinancialClarity({
        institutions,
        accounts,
        visibleAccountIds,
        subscriptions,
        visibleTransactions,
        monthlyIncome,
      }),
    [institutions, accounts, visibleAccountIds, subscriptions, visibleTransactions, monthlyIncome]
  );
  const liquidityMultiple =
    data.expenses > 0 ? availableCash / data.expenses : (availableCash > 0 ? null : null);

  const awarenessDrivers = useMemo((): {
    cashStability: DriverInterpretation;
    spendingControl: DriverInterpretation;
    subscriptionLoad: DriverInterpretation;
    netFlow: DriverInterpretation;
  } => {
    const cashStability: DriverInterpretation =
      liquidityMultiple === null
        ? 'Needs attention'
        : liquidityMultiple >= 3
          ? 'Strong'
          : liquidityMultiple >= 1
            ? 'Moderate'
            : 'Needs attention';
    const subscriptionLoad: DriverInterpretation =
      subscriptionLoadPercent === null
        ? 'Strong'
        : subscriptionLoadPercent <= 10
          ? 'Strong'
          : subscriptionLoadPercent <= 20
            ? 'Moderate'
            : 'Needs attention';
    const netFlow: DriverInterpretation =
      data.net > 0 ? 'Strong' : data.net === 0 ? 'Moderate' : 'Needs attention';
    const stability = clarityResult.breakdown.stability;
    const spendingControl: DriverInterpretation =
      stability >= 40 ? 'Strong' : stability >= 20 ? 'Moderate' : 'Needs attention';
    return { cashStability, spendingControl, subscriptionLoad, netFlow };
  }, [liquidityMultiple, subscriptionLoadPercent, data.net, clarityResult.breakdown.stability]);

  const scopeLabel = selectedInstitutionId === null
    ? 'All accounts'
    : institutions.find((i) => i.id === selectedInstitutionId)?.name ?? 'All accounts';

  if (!appLoaded) {
    return <LoadingSkeleton />;
  }

  const bg = dark ? '#0f172a' : '#f8fafc';
  const cardBg = dark ? '#1e293b' : '#ffffff';
  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';

  const headerRight = (
    <View style={styles.headerRight}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Notifications')}
        style={styles.headerIcon}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.headerIconText}>🔔</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Menu')}
        style={styles.headerIcon}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.headerIconText}>☰</Text>
      </TouchableOpacity>
    </View>
  );

  const cardShadow = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {!dark && (
        <LinearGradient
          colors={gradientColors.background}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      )}
      {dark && <View style={[StyleSheet.absoluteFill, { backgroundColor: bg }]} />}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {dark ? (
          <>
            <AppHeaderDark title="Dashboard" subtitle="Your money at a glance" right={headerRight} />
            <View style={styles.scopeRow}>
              <ScopeSelector dark={dark} />
            </View>
            <Text style={[styles.includedLabel, { color: mutedColor }]}>Included: {scopeLabel}</Text>
            <View style={[styles.cardBase, styles.overviewCard, { backgroundColor: cardBg }, cardShadow]}>
              <FinancialAwarenessOverviewCard
                score={clarityResult.score}
                label={getClarityLabel(clarityResult.score)}
                drivers={awarenessDrivers}
                cashDisplayValue={cashAccounts.length === 0 ? '—' : formatCurrency(availableCash)}
                cashSubtitle={cashAccounts.length === 0 ? 'No accounts' : `${cashAccounts.length} account${cashAccounts.length !== 1 ? 's' : ''}`}
                expensesThisMonth={data.expenses}
                subscriptionsMonthly={activeSubsTotal}
                subscriptionsActiveCount={activeSubs.length}
                onDetailsPress={() => navigation.navigate('Notifications')}
                onSpendingByCategory={() => {}}
                onSubscriptions={() => navigation.navigate('SubscriptionsHome')}
                onCashFlow={() => navigation.navigate('TransactionsHome')}
                dark={dark}
              />
            </View>
          </>
        ) : (
          <>
            <AppHeader title="Progress" subtitle="Your money clarity" right={headerRight} />
            <View style={styles.figmaMain}>
              <FinancialHealthHeroCard
                score={clarityResult.score}
                maxScore={100}
                status={getClarityLabel(clarityResult.score)}
                statusColor={driverToStatusColor(awarenessDrivers.netFlow)}
                description={getClaritySubtext(clarityResult, subscriptionLoadPercent)}
                filledSegments={Math.min(5, Math.round((clarityResult.score / 100) * 5))}
                totalSegments={5}
                onPress={() => navigation.navigate('Notifications')}
              />
              <MetricCard
                title="Financial awareness"
                value="What drives your score"
                status={toStatusType(getClarityLabel(clarityResult.score))}
                filledSegments={driverToSegments(awarenessDrivers.spendingControl)}
                variant="awareness"
                actionLabel="Learn more"
                onPress={() => navigation.navigate('Notifications')}
              />
              <MetricCard
                title="Spending control"
                value={formatCurrency(data.expenses)}
                status={toStatusType(awarenessDrivers.spendingControl)}
                description="Expenses this month"
                filledSegments={driverToSegments(awarenessDrivers.spendingControl)}
                variant="spending"
                actionLabel="All transactions"
                onPress={() => navigation.navigate('TransactionsHome')}
              />
              <MetricCard
                title="Subscription load"
                value={`${formatCurrency(activeSubsTotal)} / month`}
                status={toStatusType(awarenessDrivers.subscriptionLoad)}
                description={`${activeSubs.length} active`}
                filledSegments={driverToSegments(awarenessDrivers.subscriptionLoad)}
                variant="subscription"
                actionLabel="See all"
                onPress={() => navigation.navigate('SubscriptionsHome')}
              />
              <MetricCard
                title="Cash stability"
                value={cashAccounts.length === 0 ? '—' : formatCurrency(availableCash)}
                status={toStatusType(awarenessDrivers.cashStability)}
                description={`${cashAccounts.length} account${cashAccounts.length !== 1 ? 's' : ''}`}
                filledSegments={driverToSegments(awarenessDrivers.cashStability)}
                variant="cash"
                actionLabel="Accounts"
                onPress={() => navigation.navigate('TransactionsHome')}
              />
              <MetricCard
                title="Credit health"
                value="$0"
                status="strong"
                description="Last statement"
                filledSegments={5}
                variant="credit"
                actionLabel="Details"
              />
            </View>
          </>
        )}

        <View style={[styles.cardBase, styles.donutCard, { backgroundColor: cardBg }, cardShadow]}>
          <View style={styles.periodRow}>
            <Text style={[styles.chartTitle, { color: textColor }]}>Spending by category</Text>
            <View style={styles.periodRowRight}>
              <TouchableOpacity onPress={() => navigation.navigate('TransactionsHome')} hitSlop={8}>
                <Text style={[styles.viewAllLink, { color: dark ? '#60a5fa' : '#1d4ed8' }]}>Transactions →</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.periodToggleWrap}>
            <View style={styles.periodToggle}>
              <TouchableOpacity
                style={[styles.periodBtn, chartPeriod === 'this_month' && styles.periodBtnActive]}
                onPress={() => setChartPeriod('this_month')}
              >
                <Text style={[styles.periodText, { color: chartPeriod === 'this_month' ? (dark ? '#60a5fa' : '#1d4ed8') : mutedColor }]}>
                  This month
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.periodBtn, chartPeriod === 'last_30_days' && styles.periodBtnActive]}
                onPress={() => setChartPeriod('last_30_days')}
              >
                <Text style={[styles.periodText, { color: chartPeriod === 'last_30_days' ? (dark ? '#60a5fa' : '#1d4ed8') : mutedColor }]}>
                  Last 30 days
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <DonutChart
            data={breakdown.segments.map((s) => ({
              label: s.name,
              value: s.amount,
              category: s.name,
            }))}
            total={breakdown.total}
            onPressSlice={(cat) => {
              if (cat !== 'Other') {
                navigation.navigate('TransactionsByCategory', {
                  category: cat,
                  period: chartPeriod,
                });
              }
            }}
            dark={dark}
            showLegend={true}
            legendMaxItems={5}
          />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
      <FloatingAIButton onPress={() => navigation.navigate('CoachHome')} dark={dark} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  scopeRow: { paddingHorizontal: 16, marginBottom: 4 },
  includedLabel: { fontSize: 12, paddingHorizontal: 16, marginBottom: 16 },
  figmaMain: {
    paddingHorizontal: 24,
    gap: 20,
    paddingBottom: 20,
  },
  cardBase: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
  overviewCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
  },
  metricsCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 24,
    borderRadius: 28,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  metricBlock: {
    flex: 1,
    minWidth: 0,
  },
  metricLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  metricSub: {
    fontSize: 11,
    marginTop: 2,
  },
  improveTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  improveRow: {
    paddingVertical: 10,
  },
  improveRowLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  donutCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 28,
  },
  periodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  periodRowRight: {},
  periodToggleWrap: { marginBottom: 12 },
  periodToggle: { flexDirection: 'row', gap: 8 },
  periodBtn: { paddingVertical: 4 },
  periodBtnActive: {},
  periodText: { fontSize: 13 },
  chartTitle: { fontSize: 16, fontWeight: '600' },
  viewAllLink: { fontSize: 14, fontWeight: '500' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerIcon: { paddingHorizontal: 8 },
  headerIconText: { fontSize: 20 },
});
