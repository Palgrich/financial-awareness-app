import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export type DriverInterpretation = 'Strong' | 'Moderate' | 'Needs attention';

export interface DriverRow {
  label: string;
  interpretation: DriverInterpretation;
}

export interface FinancialAwarenessHeroCardProps {
  /** 0–100 score from awareness/score.ts */
  score: number;
  /** Label from getClarityLabel */
  label: string;
  /** Four driver rows: Cash stability, Spending control, Subscription load, Net flow */
  drivers: {
    cashStability: DriverInterpretation;
    spendingControl: DriverInterpretation;
    subscriptionLoad: DriverInterpretation;
    netFlow: DriverInterpretation;
  };
  onDetailsPress: () => void;
  dark?: boolean;
}

const DRIVER_ORDER: (keyof FinancialAwarenessHeroCardProps['drivers'])[] = [
  'cashStability',
  'spendingControl',
  'subscriptionLoad',
  'netFlow',
];

const DRIVER_LABELS: Record<keyof FinancialAwarenessHeroCardProps['drivers'], string> = {
  cashStability: 'Cash stability',
  spendingControl: 'Spending control',
  subscriptionLoad: 'Subscription load',
  netFlow: 'Net flow',
};

export function FinancialAwarenessHeroCard({
  score,
  label,
  drivers,
  onDetailsPress,
  dark = false,
}: FinancialAwarenessHeroCardProps) {
  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';
  const linkColor = dark ? '#60a5fa' : '#1d4ed8';

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
          <View key={key} style={[styles.driverRow, { borderBottomColor: dark ? '#334155' : '#f1f5f9' }]}>
            <Text style={[styles.driverLabel, { color: textColor }]}>{DRIVER_LABELS[key]}</Text>
            <Text style={[styles.driverInterpretation, { color: mutedColor }]}>
              {drivers[key]}
            </Text>
          </View>
        ))}
      </View>
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
});
