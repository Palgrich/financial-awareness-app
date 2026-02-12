import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency } from '../utils/format';

export interface FinancialAwarenessCardProps {
  /** Available cash (checking + savings). */
  availableCash: number;
  /** This month's total spend (expenses). */
  monthlySpend: number;
  /** Subscription cost as % of monthly income, or null if no income. */
  subscriptionPercent: number | null;
  /** Net this month (income − expenses). */
  netThisMonth: number;
  dark?: boolean;
}

/**
 * Computes a 0–100 score from liquidity, subscription burden, and net position.
 * Each sub-score is 0–100; final score is the average, rounded.
 */
function computeScore(
  availableCash: number,
  monthlySpend: number,
  subscriptionPercent: number | null,
  netThisMonth: number
): number {
  const liquidityScore =
    monthlySpend > 0
      ? Math.min(100, Math.round((availableCash / monthlySpend) * 33))
      : availableCash > 0
        ? 100
        : 0;

  const subscriptionScore =
    subscriptionPercent !== null
      ? Math.max(0, 100 - Math.min(100, subscriptionPercent * 2))
      : 100;

  const netScore = netThisMonth >= 0 ? 100 : 0;

  const raw = (liquidityScore + subscriptionScore + netScore) / 3;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function FinancialAwarenessCard({
  availableCash,
  monthlySpend,
  subscriptionPercent,
  netThisMonth,
  dark = false,
}: FinancialAwarenessCardProps) {
  const score = useMemo(
    () => computeScore(availableCash, monthlySpend, subscriptionPercent, netThisMonth),
    [availableCash, monthlySpend, subscriptionPercent, netThisMonth]
  );

  const liquidityMultiple =
    monthlySpend > 0 ? availableCash / monthlySpend : (availableCash > 0 ? null : null);

  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';
  const barTrack = dark ? '#334155' : '#e2e8f0';
  const barFill = dark ? '#64748b' : '#475569';

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: mutedColor }]}>Financial Awareness</Text>
      <Text style={[styles.score, { color: textColor }]}>{score} / 100</Text>
      <View style={[styles.barTrack, { backgroundColor: barTrack }]}>
        <View
          style={[
            styles.barFill,
            { backgroundColor: barFill, width: `${score}%` },
          ]}
        />
      </View>
      <View style={styles.metrics}>
        <Text style={[styles.metric, { color: mutedColor }]}>
          Liquidity: {liquidityMultiple !== null ? `${liquidityMultiple.toFixed(1)}×` : '—'}
        </Text>
        <Text style={[styles.metric, { color: mutedColor }]}>
          Subscriptions: {subscriptionPercent !== null ? `${Math.round(subscriptionPercent)}% of income` : '—'}
        </Text>
        <Text style={[styles.metric, { color: mutedColor }]}>
          Net this month: {netThisMonth >= 0 ? '+' : ''}{formatCurrency(netThisMonth)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  score: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  barTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 14,
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metric: {
    fontSize: 11,
  },
});
