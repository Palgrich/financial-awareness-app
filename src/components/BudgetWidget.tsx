import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatCurrency } from '../utils/format';

interface BudgetWidgetProps {
  needsUsed: number;
  needsTarget: number;
  wantsUsed: number;
  wantsTarget: number;
  savingsUsed: number;
  savingsTarget: number;
  onPress?: () => void;
  dark?: boolean;
}

function Bar({ used, target, dark }: { used: number; target: number; dark?: boolean }) {
  const pct = target > 0 ? Math.min(150, (used / target) * 100) : 0;
  const isOver = pct > 100;
  return (
    <View style={styles.barWrap}>
      <View style={[styles.barBg, dark && styles.barBgDark]}>
        <View
          style={[
            styles.barFill,
            { width: `${Math.min(100, pct)}%` },
            isOver && styles.barOver,
          ]}
        />
      </View>
      <Text style={[styles.barPct, { color: dark ? '#94a3b8' : '#64748b' }]}>
        {target > 0 ? Math.round((used / target) * 100) : 0}%
      </Text>
    </View>
  );
}

export function BudgetWidget({
  needsUsed,
  needsTarget,
  wantsUsed,
  wantsTarget,
  savingsUsed,
  savingsTarget,
  onPress,
  dark,
}: BudgetWidgetProps) {
  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';

  return (
    <TouchableOpacity
      style={[styles.card, dark && styles.cardDark]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Budget Status</Text>
        {onPress && (
          <Text style={styles.cta}>Set up</Text>
        )}
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: mutedColor }]}>Needs 50%</Text>
        <Bar used={needsUsed} target={needsTarget} dark={dark} />
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: mutedColor }]}>Wants 30%</Text>
        <Bar used={wantsUsed} target={wantsTarget} dark={dark} />
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: mutedColor }]}>Savings 20%</Text>
        <Bar used={savingsUsed} target={savingsTarget} dark={dark} />
      </View>
    </TouchableOpacity>
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
  cardDark: { backgroundColor: '#334155', borderColor: '#475569' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  cta: { fontSize: 14, fontWeight: '600', color: '#2563eb' },
  row: { marginBottom: 10 },
  label: { fontSize: 13, marginBottom: 4 },
  barWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barBg: { flex: 1, height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' },
  barBgDark: { backgroundColor: '#475569' },
  barFill: { height: '100%', backgroundColor: '#2563eb', borderRadius: 4 },
  barOver: { backgroundColor: '#dc2626' },
  barPct: { fontSize: 12, minWidth: 36 },
});
