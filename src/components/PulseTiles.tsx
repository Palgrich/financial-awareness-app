import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/useTheme';

const STATUS_DOT_COLORS = {
  good: '#22C55E',
  moderate: '#F59E0B',
  high: '#EF4444',
} as const;

export type TileStatus = 'good' | 'moderate' | 'high';

export interface PulseTilesProps {
  cash: { balance: number; status: TileStatus };
  learn: { completed: number; status: TileStatus };
  subscriptions: { monthly: number; count: number; status: TileStatus };
  onCashPress: () => void;
  onLearnPress: () => void;
  onSubscriptionsPress: () => void;
}

function StatusDot({ status }: { status: TileStatus }) {
  const color = STATUS_DOT_COLORS[status];
  return <View style={[styles.dot, { backgroundColor: color }]} />;
}

function formatMoney(n: number) {
  return `$${n.toFixed(0)}`;
}

export function PulseTiles({
  cash,
  learn,
  subscriptions,
  onCashPress,
  onLearnPress,
  onSubscriptionsPress,
}: PulseTilesProps) {
  const { isDark, colors: themeColors } = useTheme();
  const tileBg = isDark ? '#1E293B' : '#FFFFFF';
  const textPrimary = themeColors.textPrimary;
  const textMuted = themeColors.textMuted;

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.tile, { backgroundColor: tileBg }]}
        onPress={onCashPress}
        activeOpacity={0.7}
      >
        <View style={styles.tileHeader}>
          <Text style={styles.emoji}>💰</Text>
          <StatusDot status={cash.status} />
        </View>
        <Text style={[styles.tileLabel, { color: textMuted }]}>Cash</Text>
        <Text style={[styles.tileValue, { color: textPrimary }]}>
          {formatMoney(cash.balance)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tile, { backgroundColor: tileBg }]}
        onPress={onLearnPress}
        activeOpacity={0.7}
      >
        <View style={styles.tileHeader}>
          <Text style={styles.emoji}>📚</Text>
          <StatusDot status={learn.status} />
        </View>
        <Text style={[styles.tileLabel, { color: textMuted }]}>Learn</Text>
        <Text style={[styles.tileValue, { color: textPrimary }]}>
          {learn.completed} done · Keep going
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tile, { backgroundColor: tileBg }]}
        onPress={onSubscriptionsPress}
        activeOpacity={0.7}
      >
        <View style={styles.tileHeader}>
          <Text style={styles.emoji}>🔄</Text>
          <StatusDot status={subscriptions.status} />
        </View>
        <Text style={[styles.tileLabel, { color: textMuted }]}>Subscriptions</Text>
        <Text style={[styles.tileValue, { color: textPrimary }]}>
          {formatMoney(subscriptions.monthly)}/mo · {subscriptions.count}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  tile: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    minWidth: 0,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  emoji: {
    fontSize: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tileLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  tileValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PulseTiles;
