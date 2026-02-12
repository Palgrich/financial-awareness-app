import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppHeader, AppHeaderDark, StatTile, LoadingSkeleton, DonutChart, ScopeSelector, FloatingAIButton, FinancialAwarenessCard } from '../components';
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

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'DashboardHome'>;

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
  const recentTransactions = useMemo(() => {
    return [...visibleTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [visibleTransactions]);

  const accountIdToBankName = useMemo(() => {
    const map: Record<string, string> = {};
    visibleAccounts.forEach((a) => {
      const inst = institutions.find((i) => i.id === a.institutionId);
      map[a.id] = inst?.name ?? 'Unknown';
    });
    return map;
  }, [visibleAccounts, institutions]);

  const scopeLabel = selectedInstitutionId === null
    ? 'All accounts'
    : institutions.find((i) => i.id === selectedInstitutionId)?.name ?? 'All accounts';
  const netLine =
    data.net >= 0
      ? `This month net: +${formatCurrency(data.net)}`
      : `This month net: ${formatCurrency(data.net)}`;

  if (!appLoaded) {
    return <LoadingSkeleton />;
  }

  const bg = dark ? '#0f172a' : '#f8fafc';
  const cardBg = dark ? '#1e293b' : '#ffffff';
  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';

  const headerRight = (
    <TouchableOpacity
      onPress={() => navigation.navigate('Menu')}
      style={styles.headerIcon}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <Text style={styles.headerIconText}>☰</Text>
    </TouchableOpacity>
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
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: bg }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {dark ? (
          <AppHeaderDark title="Dashboard" subtitle="Your money at a glance" right={headerRight} />
        ) : (
          <AppHeader title="Dashboard" subtitle="Your money at a glance" right={headerRight} />
        )}

        <View style={styles.scopeRow}>
          <ScopeSelector dark={dark} />
        </View>
        <Text style={[styles.includedLabel, { color: mutedColor }]}>
          {scopeLabel}
        </Text>

        <View style={styles.statsRow}>
          <View style={[styles.statTileWrap, styles.cardBase, { backgroundColor: cardBg }, cardShadow]}>
            <StatTile
              dark={dark}
              label="Available cash"
              value={cashAccounts.length === 0 ? '—' : formatCurrency(availableCash)}
              subValue={cashAccounts.length === 0 ? 'No accounts' : `${cashAccounts.length} account${cashAccounts.length !== 1 ? 's' : ''}`}
              extraSubValue={cashAccounts.length > 0 ? netLine : undefined}
              valueSize="large"
              subValueMuted
              noBorder
            />
          </View>
          <View style={[styles.statTileWrap, styles.cardBase, { backgroundColor: cardBg }, cardShadow]}>
            <StatTile
              dark={dark}
              label="Expenses (this month)"
              value={formatCurrency(data.expenses)}
              valueSize="large"
              subValueMuted
              noBorder
            />
          </View>
        </View>

        <View style={[styles.cardBase, styles.awarenessCard, { backgroundColor: cardBg }, cardShadow]}>
          <FinancialAwarenessCard
            availableCash={availableCash}
            monthlySpend={data.expenses}
            subscriptionPercent={subscriptionLoadPercent}
            netThisMonth={data.net}
            dark={dark}
          />
        </View>

        <View style={[styles.cardBase, styles.donutCard, { backgroundColor: cardBg }, cardShadow]}>
          <View style={styles.periodRow}>
            <Text style={[styles.chartTitle, { color: textColor }]}>Spending by category</Text>
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
          <View style={styles.recentHeader}>
            <Text style={[styles.recentTitle, { color: textColor }]}>Recent transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionsHome')} hitSlop={8}>
              <Text style={[styles.viewAllLink, { color: dark ? '#60a5fa' : '#1d4ed8' }]}>View all →</Text>
            </TouchableOpacity>
          </View>
          {recentTransactions.length === 0 ? (
            <Text style={[styles.recentEmpty, { color: mutedColor }]}>No recent transactions</Text>
          ) : (
            recentTransactions.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.recentRow, { borderBottomColor: dark ? '#334155' : '#f1f5f9' }]}
                onPress={() => navigation.navigate('TransactionDetail', { transactionId: t.id })}
                activeOpacity={0.7}
              >
                <View style={styles.recentLeft}>
                  <Text style={[styles.recentMerchant, { color: textColor }]} numberOfLines={1}>{t.merchant}</Text>
                  <Text style={[styles.recentMeta, { color: mutedColor }]} numberOfLines={1}>
                    {t.category} · {accountIdToBankName[t.accountId]}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.recentAmount,
                    t.type === 'income' ? styles.amountIncome : styles.amountExpense,
                  ]}
                >
                  {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={[styles.cardBase, styles.subCard, { backgroundColor: cardBg }, cardShadow]}>
          <Text style={[styles.subTitle, { color: textColor }]}>Subscriptions</Text>
          <Text style={[styles.subMonthly, { color: textColor }]}>
            {formatCurrency(activeSubsTotal)} / month
          </Text>
          <Text style={[styles.subActive, { color: mutedColor }]}>
            {activeSubs.length} active
          </Text>
          <View style={styles.subViewAllRow}>
            <TouchableOpacity onPress={() => navigation.navigate('SubscriptionsHome')} hitSlop={8}>
              <Text style={[styles.viewAllLink, { color: dark ? '#60a5fa' : '#1d4ed8' }]}>View all →</Text>
            </TouchableOpacity>
          </View>
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
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  statTileWrap: { flex: 1, minWidth: 0 },
  cardBase: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
  awarenessCard: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 18,
  },
  donutCard: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 18,
  },
  periodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  periodToggle: { flexDirection: 'row', gap: 8 },
  periodBtn: { paddingVertical: 4 },
  periodBtnActive: {},
  periodText: { fontSize: 13 },
  chartTitle: { fontSize: 16, fontWeight: '600' },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  recentTitle: { fontSize: 14, fontWeight: '600' },
  viewAllLink: { fontSize: 14, fontWeight: '500' },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  recentLeft: { flex: 1, minWidth: 0, marginRight: 12 },
  recentMerchant: { fontSize: 15, fontWeight: '500' },
  recentMeta: { fontSize: 12, marginTop: 2 },
  recentAmount: { fontSize: 15, fontWeight: '600' },
  amountIncome: { color: '#16a34a' },
  amountExpense: { color: '#dc2626' },
  recentEmpty: { fontSize: 14, paddingVertical: 16 },
  viewAllBtn: { marginTop: 14 },
  headerIcon: { paddingHorizontal: 8 },
  headerIconText: { fontSize: 22, fontWeight: '300' },
  subCard: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 18,
  },
  subTitle: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  subMonthly: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subActive: { fontSize: 12, marginBottom: 12 },
  subViewAllRow: { alignItems: 'flex-end' },
});
