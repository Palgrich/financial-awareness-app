import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatCurrency } from '../utils/format';
import type { Debt } from '../types';

interface DebtSnapshotCardProps {
  totalDebt: number;
  nextPayment?: { name: string; amount: number; dueDay: number };
  debtCount: number;
  onAddDebt: () => void;
  dark?: boolean;
}

export function DebtSnapshotCard({
  totalDebt,
  nextPayment,
  debtCount,
  onAddDebt,
  dark,
}: DebtSnapshotCardProps) {
  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';

  const now = new Date();
  const day = now.getDate();
  const daysLeft = nextPayment
    ? nextPayment.dueDay >= day
      ? nextPayment.dueDay - day
      : 30 - day + nextPayment.dueDay
    : null;

  return (
    <View style={[styles.card, dark && styles.cardDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Debt Snapshot</Text>
        <Text style={[styles.count, { color: mutedColor }]}>{debtCount} debt{debtCount !== 1 ? 's' : ''}</Text>
      </View>
      <Text style={[styles.total, { color: textColor }]}>{formatCurrency(totalDebt)}</Text>
      {nextPayment ? (
        <Text style={[styles.nextPayment, { color: mutedColor }]}>
          Next: {nextPayment.name} {formatCurrency(nextPayment.amount)}
          {daysLeft !== null && ` in ${daysLeft} days`}
        </Text>
      ) : (
        <Text style={[styles.nextPayment, { color: mutedColor }]}>No upcoming payments</Text>
      )}
      <TouchableOpacity style={styles.cta} onPress={onAddDebt}>
        <Text style={styles.ctaText}>Add debt</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardDark: {
    backgroundColor: '#334155',
    borderColor: '#475569',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '600' },
  count: { fontSize: 13 },
  total: { fontSize: 22, fontWeight: '600', marginTop: 8 },
  nextPayment: { fontSize: 13, marginTop: 4 },
  cta: { marginTop: 12 },
  ctaText: { fontSize: 14, fontWeight: '600', color: '#2563eb' },
});
