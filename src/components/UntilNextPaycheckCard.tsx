import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export interface UntilNextPaycheckCardProps {
  daysUntilPaycheck: number;
  availableBalance: number;
  dailyBudgetSafe: number;
  avgDailySpendLast3Days: number;
  onPress: () => void;
}

export function UntilNextPaycheckCard({
  daysUntilPaycheck,
  availableBalance,
  dailyBudgetSafe,
  avgDailySpendLast3Days,
  onPress,
}: UntilNextPaycheckCardProps) {
  const overPace = avgDailySpendLast3Days > dailyBudgetSafe;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.95 }]}
    >
      <View style={styles.left}>
        <Text style={styles.emoji}>💰</Text>
        <View>
          <Text style={styles.daysText}>
            {daysUntilPaycheck} days until payday
          </Text>
          <Text style={styles.trackText}>
            ${dailyBudgetSafe}/day to stay on track
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.balanceText}>${availableBalance} left</Text>
        <Text style={[styles.paceText, overPace && styles.paceTextOver]}>
          {overPace
            ? `⚠️ $${avgDailySpendLast3Days}/day`
            : `$${dailyBudgetSafe}/day`}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emoji: { fontSize: 28 },
  daysText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  trackText: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  right: { alignItems: 'flex-end' },
  balanceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  paceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    marginTop: 2,
  },
  paceTextOver: {
    color: '#F59E0B',
  },
});
