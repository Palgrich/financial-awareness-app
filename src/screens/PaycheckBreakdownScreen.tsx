import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import type { DashboardStackParamList } from '../navigation/types';
import { useProgressStore } from '../state/progressStore';
import { colors } from '../theme/tokens';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'PaycheckBreakdown'>;

export function PaycheckBreakdownScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const userData = useProgressStore((s) => s.userData);
  const {
    daysUntilPaycheck,
    availableBalance,
    dailyBudgetSafe,
    avgDailySpendLast3Days,
  } = userData;

  const daysUntilEmpty =
    avgDailySpendLast3Days > 0
      ? Math.floor(availableBalance / avgDailySpendLast3Days)
      : 999;
  const overPace = avgDailySpendLast3Days > dailyBudgetSafe;
  const overPct = dailyBudgetSafe > 0
    ? Math.min(100, (avgDailySpendLast3Days / dailyBudgetSafe) * 100)
    : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Paycheck Breakdown</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.content}>
        <Row label="Days until next paycheck" value={`${daysUntilPaycheck}`} />
        <Row label="Available balance" value={`$${availableBalance}`} />
        <Row label="Safe daily budget" value={`$${dailyBudgetSafe}/day`} />
        <Row
          label="Your average last 3 days"
          value={`$${avgDailySpendLast3Days}/day`}
        />
        <Row
          label="At this pace you'll run out in"
          value={daysUntilEmpty < 999 ? `${daysUntilEmpty} days` : '—'}
        />
        <View style={styles.barSection}>
          <Text style={styles.barLabel}>Spending pace vs safe budget</Text>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${Math.min(100, overPct)}%`,
                  backgroundColor: overPace ? colors.status.high : colors.status.good,
                },
              ]}
            />
          </View>
          {overPace && (
            <Text style={styles.barWarning}>You're over your safe daily budget</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.cta}
          onPress={() => navigation.navigate('TransactionsHome')}
        >
          <Text style={styles.ctaText}>See my spending →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: '#0F172A',
  },
  headerSpacer: { width: 32 },
  content: { padding: 24 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  rowLabel: { fontSize: 15, color: colors.text.muted },
  rowValue: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  barSection: { marginTop: 24, marginBottom: 24 },
  barLabel: { fontSize: 14, color: colors.text.muted, marginBottom: 8 },
  barTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  barWarning: {
    fontSize: 13,
    color: colors.status.high,
    marginTop: 6,
  },
  cta: {
    backgroundColor: colors.accent.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
