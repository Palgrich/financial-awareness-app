import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export interface ImproveAwarenessCardProps {
  onSpendingByCategory: () => void;
  onSubscriptions: () => void;
  onCashFlow: () => void;
  dark?: boolean;
}

const ROWS: { label: string; key: keyof Pick<ImproveAwarenessCardProps, 'onSpendingByCategory' | 'onSubscriptions' | 'onCashFlow'> }[] = [
  { label: 'Spending by category →', key: 'onSpendingByCategory' },
  { label: 'Subscriptions →', key: 'onSubscriptions' },
  { label: 'Cash flow →', key: 'onCashFlow' },
];

export function ImproveAwarenessCard({
  onSpendingByCategory,
  onSubscriptions,
  onCashFlow,
  dark = false,
}: ImproveAwarenessCardProps) {
  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const linkColor = dark ? '#60a5fa' : '#1d4ed8';
  const borderColor = dark ? '#334155' : '#f1f5f9';

  const handlers = { onSpendingByCategory, onSubscriptions, onCashFlow };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>Improve your awareness</Text>
      {ROWS.map(({ label, key }, i) => (
        <TouchableOpacity
          key={key}
          style={[styles.row, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: borderColor }]}
          onPress={handlers[key]}
          activeOpacity={0.7}
        >
          <Text style={[styles.rowLabel, { color: linkColor }]}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    paddingVertical: 12,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
