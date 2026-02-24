import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatCurrency } from '../utils/format';

export type DriverInterpretation = 'Strong' | 'Moderate' | 'Needs attention';

export interface FinancialAwarenessOverviewCardProps {
  score: number;
  label: string;
  drivers: {
    cashStability: DriverInterpretation;
    spendingControl: DriverInterpretation;
    subscriptionLoad: DriverInterpretation;
    netFlow: DriverInterpretation;
  };
  cashDisplayValue: string;
  cashSubtitle: string;
  expensesThisMonth: number;
  subscriptionsMonthly: number;
  subscriptionsActiveCount: number;
  onDetailsPress: () => void;
  onSpendingByCategory: () => void;
  onSubscriptions: () => void;
  onCashFlow: () => void;
  dark?: boolean;
}

const DRIVER_ORDER: (keyof FinancialAwarenessOverviewCardProps['drivers'])[] = [
  'cashStability',
  'spendingControl',
  'subscriptionLoad',
  'netFlow',
];

const DRIVER_LABELS: Record<keyof FinancialAwarenessOverviewCardProps['drivers'], string> = {
  cashStability: 'Cash stability',
  spendingControl: 'Spending control',
  subscriptionLoad: 'Subscription load',
  netFlow: 'Net flow',
};

const IMPROVE_ROWS: { label: string; key: 'onSpendingByCategory' | 'onSubscriptions' | 'onCashFlow' }[] = [
  { label: 'Spending by category →', key: 'onSpendingByCategory' },
  { label: 'Subscriptions →', key: 'onSubscriptions' },
  { label: 'Cash flow →', key: 'onCashFlow' },
];

export function FinancialAwarenessOverviewCard({
  score,
  label,
  drivers,
  cashDisplayValue,
  cashSubtitle,
  expensesThisMonth,
  subscriptionsMonthly,
  subscriptionsActiveCount,
  onDetailsPress,
  onSpendingByCategory,
  onSubscriptions,
  onCashFlow,
  dark = false,
}: FinancialAwarenessOverviewCardProps) {
  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';
  const linkColor = dark ? '#60a5fa' : '#1d4ed8';
  const borderColor = dark ? '#334155' : '#f1f5f9';

  const handlers = { onSpendingByCategory, onSubscriptions, onCashFlow };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: mutedColor }]}>Financial awareness</Text>
        <TouchableOpacity onPress={onDetailsPress} hitSlop={8}>
          <Text style={[styles.detailsLink, { color: linkColor }]}>Details →</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.score, { color: textColor }]}>{score} / 100</Text>
      <Text style={[styles.label, { color: mutedColor }]}>{label}</Text>

      <Text style={[styles.driversTitle, { color: mutedColor }]}>What drives your score</Text>
      <View style={styles.driversList}>
        {DRIVER_ORDER.map((key) => (
          <View key={key} style={[styles.driverRow, { borderBottomColor: borderColor }]}>
            <Text style={[styles.driverLabel, { color: textColor }]}>{DRIVER_LABELS[key]}</Text>
            <Text style={[styles.driverInterpretation, { color: mutedColor }]}>{drivers[key]}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.metricsRow, { borderTopColor: borderColor }]}>
        <View style={styles.metricBlock}>
          <Text style={[styles.metricLabel, { color: mutedColor }]}>Available cash</Text>
          <Text style={[styles.metricValue, { color: textColor }]}>{cashDisplayValue}</Text>
          <Text style={[styles.metricSub, { color: mutedColor }]}>{cashSubtitle}</Text>
        </View>
        <View style={styles.metricBlock}>
          <Text style={[styles.metricLabel, { color: mutedColor }]}>Expenses (this month)</Text>
          <Text style={[styles.metricValue, { color: textColor }]}>{formatCurrency(expensesThisMonth)}</Text>
        </View>
        <View style={styles.metricBlock}>
          <Text style={[styles.metricLabel, { color: mutedColor }]}>Subscriptions</Text>
          <Text style={[styles.metricValue, { color: textColor }]}>{formatCurrency(subscriptionsMonthly)} / mo</Text>
          <Text style={[styles.metricSub, { color: mutedColor }]}>{subscriptionsActiveCount} active</Text>
        </View>
      </View>

      <Text style={[styles.improveTitle, { color: textColor }]}>Improve your awareness</Text>
      {IMPROVE_ROWS.map(({ label: rowLabel, key }, i) => (
        <TouchableOpacity
          key={key}
          style={[styles.improveRow, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: borderColor }]}
          onPress={handlers[key]}
          activeOpacity={0.7}
        >
          <Text style={[styles.improveRowLabel, { color: linkColor }]}>{rowLabel}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  detailsLink: {
    fontSize: 13,
    fontWeight: '500',
  },
  score: {
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    marginBottom: 20,
  },
  driversTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 10,
  },
  driversList: {},
  driverRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  driverLabel: {
    fontSize: 14,
  },
  driverInterpretation: {
    fontSize: 16,
    fontWeight: '500',
  },
  metricsRow: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
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
    marginTop: 20,
    marginBottom: 10,
  },
  improveRow: {
    paddingVertical: 10,
  },
  improveRowLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
