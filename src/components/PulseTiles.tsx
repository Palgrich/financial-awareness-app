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

const TILE_EMOJIS = { cash: '💰', learn: '📚', subscriptions: '🔄' } as const;

function formatMoney(n: number) {
  return `$${n.toLocaleString('en-US')}`;
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
        <Text style={styles.emoji}>{TILE_EMOJIS.cash}</Text>
        <Text style={[styles.tileLabel, { color: textMuted }]}>Cash</Text>
        <Text style={[styles.tileValue, { color: textPrimary }]}>
          {formatMoney(cash.balance)}
        </Text>
        <StatusDot status={cash.status} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tile, { backgroundColor: tileBg }]}
        onPress={onLearnPress}
        activeOpacity={0.7}
      >
        <Text style={styles.emoji}>{TILE_EMOJIS.learn}</Text>
        <Text style={[styles.tileLabel, { color: textMuted }]}>Learn</Text>
        <Text style={[styles.tileValue, { color: textPrimary }]}>
          {learn.completed} done · Keep going
        </Text>
        <StatusDot status={learn.status} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tile, { backgroundColor: tileBg }]}
        onPress={onSubscriptionsPress}
        activeOpacity={0.7}
      >
        <Text style={styles.emoji}>{TILE_EMOJIS.subscriptions}</Text>
        <Text style={[styles.tileLabel, { color: textMuted }]}>Subscriptions</Text>
        <Text style={[styles.tileValue, { color: textPrimary }]}>
          {formatMoney(subscriptions.monthly)}/mo · {subscriptions.count}
        </Text>
        <StatusDot status={subscriptions.status} />
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
  emoji: {
    fontSize: 20,
    marginBottom: 6,
  },
  tileLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  tileValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginTop: 4,
  },
});

export default PulseTiles;
