import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { colors, illustrations } from '../theme/tokens';
import { GlassCardContainer } from './GlassCardContainer';
import { IllustrationBackgroundLayer } from './IllustrationBackgroundLayer';
import { StatusBadge } from './StatusBadge';
import { WeeklySparkline } from './WeeklySparkline';
import { formatCurrency } from '../utils/format';
import type { CashControlStatus } from '../domain/cashControl';

const statusLabelMap: Record<CashControlStatus, string> = {
  good: 'Good',
  moderate: 'Moderate',
  high: 'High',
};

const statusColorMap: Record<CashControlStatus, string> = {
  good: colors.status.good,
  moderate: colors.status.moderate,
  high: colors.status.high,
};

export interface TopCategoryItem {
  name: string;
  emoji: string;
  amount: number;
  percent: number;
}

export interface CashControlCardProps {
  expensesThisMonth: number;
  expensesChangePct: number | null;
  balanceCurrent: number;
  balanceChangePct: number | null;
  status: CashControlStatus;
  filledSegments: number;
  /** 4-week spending for sparkline (W1–W4). When set, replaces segment bar. */
  weeklySpending?: number[];
  /** Top categories; show top 3 + "+ N more" link. */
  topCategories?: TopCategoryItem[];
  onPress?: () => void;
  onCategoriesPress?: () => void;
}

function formatDelta(pct: number | null): string {
  if (pct === null) return '';
  const sign = pct >= 0 ? '+' : '';
  return `vs last month: ${sign}${pct.toFixed(1)}%`;
}

export function CashControlCard({
  expensesThisMonth,
  expensesChangePct,
  balanceCurrent,
  balanceChangePct,
  status,
  filledSegments,
  weeklySpending,
  topCategories = [],
  onPress,
  onCategoriesPress,
}: CashControlCardProps) {
  const statusColor = statusColorMap[status];
  const statusLabel = statusLabelMap[status];
  const top3 = topCategories.slice(0, 3);
  const restCount = topCategories.length - 3;
  const maxPct = Math.max(...top3.map((c) => c.percent), 1);

  const content = (
    <>
      <IllustrationBackgroundLayer
        emoji={illustrations.cash}
        variant="card"
        glowColor={colors.glow.cash}
      />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Cash Control</Text>
          <StatusBadge label={statusLabel} statusColor={statusColor} />
        </View>

        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>Expenses (this month)</Text>
          <Text style={styles.metricValue}>
            {formatCurrency(expensesThisMonth)}
          </Text>
          {expensesChangePct !== null ? (
            <Text style={styles.delta}>{formatDelta(expensesChangePct)}</Text>
          ) : null}
        </View>

        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>Balance (current)</Text>
          <Text style={styles.metricValue}>{formatCurrency(balanceCurrent)}</Text>
          {balanceChangePct !== null ? (
            <Text style={styles.delta}>{formatDelta(balanceChangePct)}</Text>
          ) : null}
        </View>

        {weeklySpending && weeklySpending.length >= 2 ? (
          <View style={styles.sparklineRow}>
            <Text style={styles.sparklineLabel}>Spending by week</Text>
            <View style={styles.sparklineChartWrap}>
              <WeeklySparkline
                data={weeklySpending}
                color={statusColor}
                labels={['W1', 'W2', 'W3', 'W4']}
              />
            </View>
          </View>
        ) : null}

        {top3.length > 0 ? (
          <View style={styles.categoriesBlock}>
            <Text style={styles.categoriesTitle}>Top categories this month</Text>
            {top3.map((c) => (
              <View key={c.name} style={styles.categoryRow}>
                <Text style={styles.categoryEmoji}>{c.emoji}</Text>
                <Text style={styles.categoryName}>{c.name}</Text>
                <Text style={styles.categoryAmount}>${c.amount}</Text>
                <View style={styles.categoryBarWrap}>
                  <View
                    style={[
                      styles.categoryBar,
                      {
                        width: `${(c.percent / maxPct) * 100}%`,
                        backgroundColor: statusColor,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.categoryPct}>{c.percent}%</Text>
              </View>
            ))}
            {restCount > 0 && onCategoriesPress ? (
              <TouchableOpacity onPress={onCategoriesPress} style={styles.moreLink}>
                <Text style={styles.moreLinkText}>+ {restCount} more →</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        <View style={styles.ctaRow}>
          <Text style={styles.ctaText}>All transactions →</Text>
        </View>
      </View>
    </>
  );

  const wrapperStyle = styles.wrapper;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          wrapperStyle,
          pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] },
        ]}
      >
        <GlassCardContainer gradientKey="cash">
          {content}
        </GlassCardContainer>
      </Pressable>
    );
  }

  return (
    <View style={wrapperStyle}>
      <GlassCardContainer gradientKey="cash">
        {content}
      </GlassCardContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 28,
    overflow: 'hidden' as const,
  },
  content: {
    position: 'relative' as const,
    zIndex: 10,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    paddingRight: 16,
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  metricBlock: {
    marginBottom: 16,
  },
  metricLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '400',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  delta: {
    fontSize: 13,
    color: colors.text.muted,
    marginTop: 2,
  },
  sparklineRow: {
    marginBottom: 16,
  },
  sparklineLabel: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 4,
  },
  sparklineChartWrap: {
    paddingHorizontal: 8,
  },
  categoriesBlock: {
    marginBottom: 16,
  },
  categoriesTitle: {
    fontSize: 13,
    color: colors.text.muted,
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryEmoji: { fontSize: 14, marginRight: 6 },
  categoryName: {
    flex: 1,
    fontSize: 13,
    color: colors.text.primary,
  },
  categoryAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    marginRight: 8,
  },
  categoryBarWrap: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
    marginRight: 6,
  },
  categoryBar: {
    height: '100%',
    borderRadius: 3,
  },
  categoryPct: {
    fontSize: 12,
    color: colors.text.muted,
    width: 28,
    textAlign: 'right',
  },
  moreLink: { marginTop: 4 },
  moreLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent.primary,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  ctaText: {
    fontSize: 16,
    color: colors.accent.primary,
    fontWeight: '600',
  },
});
