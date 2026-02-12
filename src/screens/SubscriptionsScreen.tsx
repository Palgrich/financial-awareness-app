import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppHeader, AppHeaderDark, Card, SectionTitle, ScopeSelector, SubscriptionCard, FloatingAIButton } from '../components';
import { useStore } from '../state/store';
import { formatCurrency } from '../utils/format';
import { getAnnualSubscriptionCost, getSubscriptionLoadPercent } from '../domain/subscriptions';
import type { DashboardStackParamList } from '../navigation/types';
import type { Subscription } from '../types';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'SubscriptionsHome'>;

export type SubSortMode = 'all' | 'by_bank' | 'by_price' | 'upcoming';

function nextBillingDate(lastCharge: string): string {
  const d = new Date(lastCharge + 'T00:00:00');
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split('T')[0];
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + 'T00:00:00');
  return Math.floor((d.getTime() - today.getTime()) / 86400000);
}

export function SubscriptionsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const subscriptions = useStore((s) => s.subscriptions);
  const accounts = useStore((s) => s.accounts);
  const institutions = useStore((s) => s.institutions);
  const selectedInstitutionId = useStore((s) => s.selectedInstitutionId);
  const dark = useStore((s) => s.preferences.darkMode);
  const monthlyIncome = useStore((s) => s.preferences.monthlyIncome);
  const [sortMode, setSortMode] = useState<SubSortMode>('all');

  const visibleAccountIds = useMemo(() => {
    const ids = new Set<string>();
    if (selectedInstitutionId === null) {
      accounts.forEach((a) => ids.add(a.id));
    } else {
      accounts.filter((a) => a.institutionId === selectedInstitutionId).forEach((a) => ids.add(a.id));
    }
    return ids;
  }, [accounts, selectedInstitutionId]);

  const scopedSubscriptions = useMemo(
    () => subscriptions.filter((s) => visibleAccountIds.has(s.accountId)),
    [subscriptions, visibleAccountIds]
  );

  const accountIdToBankName = useMemo(() => {
    const map: Record<string, string> = {};
    accounts.forEach((a) => {
      const inst = institutions.find((i) => i.id === a.institutionId);
      map[a.id] = inst?.name ?? 'Unknown';
    });
    return map;
  }, [accounts, institutions]);

  const accountIdToAccountName = useMemo(() => {
    const map: Record<string, string> = {};
    accounts.forEach((a) => (map[a.id] = a.name));
    return map;
  }, [accounts]);

  const active = useMemo(
    () => scopedSubscriptions.filter((s) => s.status === 'active' || s.status === 'trial'),
    [scopedSubscriptions]
  );
  const totalMonthly = active.reduce((sum, s) => sum + s.monthlyCost, 0);
  const annualCost = getAnnualSubscriptionCost(active);
  const subscriptionLoadPercent = getSubscriptionLoadPercent(totalMonthly, monthlyIncome);
  const uniqueBanks = useMemo(() => {
    const set = new Set(active.map((s) => accountIdToBankName[s.accountId]));
    return set.size;
  }, [active, accountIdToBankName]);

  const bankBreakdown = useMemo(() => {
    const byBank: Record<string, number> = {};
    active.forEach((s) => {
      const bank = accountIdToBankName[s.accountId];
      byBank[bank] = (byBank[bank] ?? 0) + s.monthlyCost;
    });
    return Object.entries(byBank)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  }, [active, accountIdToBankName]);

  const sortedOrGroupedList = useMemo(() => {
    const list = [...scopedSubscriptions];
    if (sortMode === 'by_price') {
      list.sort((a, b) => b.monthlyCost - a.monthlyCost);
      return { type: 'flat' as const, list };
    }
    if (sortMode === 'upcoming') {
      list.sort((a, b) => {
        const na = nextBillingDate(a.lastChargeDate);
        const nb = nextBillingDate(b.lastChargeDate);
        return na.localeCompare(nb);
      });
      return { type: 'flat' as const, list };
    }
    if (sortMode === 'by_bank') {
      const bankToSubs: Record<string, Subscription[]> = {};
      list.forEach((s) => {
        const bank = accountIdToBankName[s.accountId];
        if (!bankToSubs[bank]) bankToSubs[bank] = [];
        bankToSubs[bank].push(s);
      });
      const groups = Object.entries(bankToSubs)
        .map(([bankName, subs]) => ({
          bankName,
          subs,
          total: subs.reduce((sum, s) => sum + (s.status !== 'cancelled' ? s.monthlyCost : 0), 0),
        }))
        .sort((a, b) => b.total - a.total)
        .map(({ bankName, subs }) => ({ bankName, subs }));
      return { type: 'grouped' as const, groups };
    }
    return { type: 'flat' as const, list };
  }, [scopedSubscriptions, sortMode, accountIdToBankName]);

  const Header = dark ? AppHeaderDark : AppHeader;
  const bg = dark ? '#0f172a' : '#f8fafc';
  const cardBg = dark ? '#1e293b' : '#ffffff';
  const mutedColor = dark ? '#94a3b8' : '#64748b';
  const textColor = dark ? '#f1f5f9' : '#0f172a';

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: bg }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header title="Subscriptions" subtitle={active.length > 0 ? `${active.length} active` : undefined} />

        {active.length > 0 && (
          <View style={styles.awarenessBlock}>
            <Text style={[styles.awarenessMonthly, { color: textColor }]}>{formatCurrency(totalMonthly)} / month</Text>
            <Text style={[styles.awarenessSecondary, { color: mutedColor }]}>
              {formatCurrency(annualCost)} / year
              {subscriptionLoadPercent !== null ? ` · ${Math.round(subscriptionLoadPercent)}% income` : ''}
            </Text>
          </View>
        )}

        <View style={styles.scopeRow}>
          <ScopeSelector dark={dark} />
        </View>

        <Card dark={dark} style={styles.banner}>
          <Text style={[styles.bannerText, { color: dark ? '#cbd5e1' : '#475569' }]}>
            Subscriptions are inferred from recurring charges in your transactions. This is demo data.
          </Text>
        </Card>

        {bankBreakdown.length > 0 && (
          <>
            <SectionTitle title="Across banks" dark={dark} />
            <View style={[styles.bankBreakdownCard, { backgroundColor: cardBg, borderColor: dark ? '#475569' : '#e2e8f0' }]}>
              {bankBreakdown.map(({ name, total }) => {
                const maxTotal = bankBreakdown[0]?.total ?? 1;
                const pct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
                return (
                  <View key={name} style={styles.bankBreakdownRow}>
                    <View style={styles.bankBreakdownLabelRow}>
                      <Text style={[styles.bankBreakdownName, { color: textColor }]}>{name}</Text>
                      <Text style={[styles.bankBreakdownTotal, { color: mutedColor }]}>{formatCurrency(total)}/month</Text>
                    </View>
                    <View style={[styles.bankBreakdownBarBg, { backgroundColor: dark ? '#475569' : '#e2e8f0' }]}>
                      <View style={[styles.bankBreakdownBarFill, { width: `${pct}%`, backgroundColor: dark ? '#64748b' : '#94a3b8' }]} />
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        <View style={styles.sortRow}>
          <TouchableOpacity
            style={[styles.sortBtn, sortMode === 'all' && styles.sortBtnActive]}
            onPress={() => setSortMode('all')}
          >
            <Text style={[styles.sortText, { color: sortMode === 'all' ? (dark ? '#60a5fa' : '#2563eb') : mutedColor }]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortMode === 'by_bank' && styles.sortBtnActive]}
            onPress={() => setSortMode('by_bank')}
          >
            <Text style={[styles.sortText, { color: sortMode === 'by_bank' ? (dark ? '#60a5fa' : '#2563eb') : mutedColor }]}>By bank</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortMode === 'by_price' && styles.sortBtnActive]}
            onPress={() => setSortMode('by_price')}
          >
            <Text style={[styles.sortText, { color: sortMode === 'by_price' ? (dark ? '#60a5fa' : '#2563eb') : mutedColor }]}>By price</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortMode === 'upcoming' && styles.sortBtnActive]}
            onPress={() => setSortMode('upcoming')}
          >
            <Text style={[styles.sortText, { color: sortMode === 'upcoming' ? (dark ? '#60a5fa' : '#2563eb') : mutedColor }]}>Upcoming</Text>
          </TouchableOpacity>
        </View>

        <SectionTitle title={sortMode === 'by_bank' ? 'By bank' : 'Subscriptions'} dark={dark} />
        <View style={[styles.listCard, { backgroundColor: cardBg, borderColor: dark ? '#475569' : '#e2e8f0' }]}>
          {scopedSubscriptions.length === 0 ? (
            <Text style={[styles.empty, { color: mutedColor }]}>No subscriptions in this scope.</Text>
          ) : sortedOrGroupedList.type === 'grouped' ? (
            sortedOrGroupedList.groups.map(({ bankName: groupName, subs }) => (
              <View key={groupName}>
                <View style={[styles.groupHeader, { borderBottomColor: dark ? '#475569' : '#e2e8f0', backgroundColor: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}>
                  <Text style={[styles.groupHeaderText, { color: mutedColor }]}>{groupName}</Text>
                </View>
                {subs.map((sub) => (
                  <SubscriptionCard
                    key={sub.id}
                    merchant={sub.merchant}
                    monthlyCost={sub.monthlyCost}
                    nextBillingDate={nextBillingDate(sub.lastChargeDate)}
                    bankName={accountIdToBankName[sub.accountId]}
                    accountName={accountIdToAccountName[sub.accountId] ?? 'Unknown'}
                    status={sub.status}
                    isSoon={daysUntil(nextBillingDate(sub.lastChargeDate)) <= 5 && daysUntil(nextBillingDate(sub.lastChargeDate)) >= 0}
                    dark={dark}
                    onPress={() => navigation.navigate('SubscriptionDetail', { subscriptionId: sub.id })}
                  />
                ))}
              </View>
            ))
          ) : (
            sortedOrGroupedList.list.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                merchant={sub.merchant}
                monthlyCost={sub.monthlyCost}
                nextBillingDate={nextBillingDate(sub.lastChargeDate)}
                bankName={accountIdToBankName[sub.accountId]}
                accountName={accountIdToAccountName[sub.accountId] ?? 'Unknown'}
                status={sub.status}
                isSoon={daysUntil(nextBillingDate(sub.lastChargeDate)) <= 5 && daysUntil(nextBillingDate(sub.lastChargeDate)) >= 0}
                dark={dark}
                onPress={() => navigation.navigate('SubscriptionDetail', { subscriptionId: sub.id })}
              />
            ))
          )}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
      <FloatingAIButton onPress={() => navigation.navigate('CoachHome')} dark={dark} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  awarenessBlock: { paddingHorizontal: 16, marginBottom: 12 },
  awarenessMonthly: { fontSize: 18, fontWeight: '700' },
  awarenessSecondary: { fontSize: 13, marginTop: 2 },
  scopeRow: { paddingHorizontal: 16, marginBottom: 12 },
  banner: { marginHorizontal: 16, marginBottom: 16 },
  bannerText: { fontSize: 13 },
  bankBreakdownCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  bankBreakdownRow: {
    paddingVertical: 8,
  },
  bankBreakdownLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bankBreakdownName: { fontSize: 15, fontWeight: '500' },
  bankBreakdownTotal: { fontSize: 13 },
  bankBreakdownBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  bankBreakdownBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  sortRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  sortBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  sortBtnActive: {},
  sortText: { fontSize: 14, fontWeight: '500' },
  listCard: { marginHorizontal: 16, borderRadius: 10, overflow: 'hidden', borderWidth: 1 },
  groupHeader: { paddingVertical: 10, paddingHorizontal: 16, borderBottomWidth: 1, backgroundColor: 'rgba(0,0,0,0.03)' },
  groupHeaderText: { fontSize: 13, fontWeight: '600' },
  empty: { padding: 24, textAlign: 'center' },
});
