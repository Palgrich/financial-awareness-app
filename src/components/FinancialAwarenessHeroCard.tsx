import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatCurrency } from '../utils/format';

const SEGMENT_COUNT = 5;

export interface FinancialAwarenessHeroCardProps {
  /** 0–100 score from awareness/score.ts */
  score: number;
  /** Label from getClarityLabel: "Strong" | "Moderate" | "Needs attention" */
  label: string;
  /** Cash / monthly spend ratio for display, or null */
  liquidityMultiple: number | null;
  /** Subscription cost as % of income, or null */
  subscriptionPercent: number | null;
  /** Net this month (income − expenses) */
  netThisMonth: number;
  onDetailsPress: () => void;
  dark?: boolean;
}

/** Number of segments to fill (0–5) from score 0–100. */
function filledSegments(score: number): number {
  if (score <= 0) return 0;
  return Math.min(SEGMENT_COUNT, Math.ceil(score / 20));
}

export function FinancialAwarenessHeroCard({
  score,
  label,
  liquidityMultiple,
  subscriptionPercent,
  netThisMonth,
  onDetailsPress,
  dark = false,
}: FinancialAwarenessHeroCardProps) {
  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';
  const linkColor = dark ? '#60a5fa' : '#1d4ed8';
  const segmentInactive = dark ? '#334155' : '#e2e8f0';
  const segmentActive = dark ? '#64748b' : '#475569';

  const filled = filledSegments(score);

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
      <View style={styles.segments}>
        {Array.from({ length: SEGMENT_COUNT }, (_, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              { backgroundColor: i < filled ? segmentActive : segmentInactive },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.whatAffectsIt, { color: mutedColor }]}>What affects it</Text>
      <View style={styles.metrics}>
        <Text style={[styles.metric, { color: mutedColor }]}>
          Liquidity: {liquidityMultiple !== null ? `${liquidityMultiple.toFixed(1)}×` : '—'}
        </Text>
        <Text style={[styles.metric, { color: mutedColor }]}>
          Subscriptions: {subscriptionPercent !== null ? `${Math.round(subscriptionPercent)}%` : '—'}
        </Text>
        <Text style={[styles.metric, { color: mutedColor }]}>
          Net: {netThisMonth >= 0 ? '+' : ''}{formatCurrency(netThisMonth)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    marginBottom: 12,
  },
  segments: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  whatAffectsIt: {
    fontSize: 11,
    marginBottom: 6,
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
