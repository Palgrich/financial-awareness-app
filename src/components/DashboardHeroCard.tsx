import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientColors } from '../theme/tokens';
import { SegmentProgressBar } from './SegmentProgressBar';
import { StatusBadge } from './StatusBadge';
import type { DriverInterpretation } from './FinancialAwarenessHeroCard';
import type { StatusType } from '../theme/tokens';

const DRIVER_ORDER: (keyof {
  cashStability: DriverInterpretation;
  spendingControl: DriverInterpretation;
  subscriptionLoad: DriverInterpretation;
  netFlow: DriverInterpretation;
})[] = ['cashStability', 'spendingControl', 'subscriptionLoad', 'netFlow'];

const DRIVER_LABELS: Record<string, string> = {
  cashStability: 'Cash stability',
  spendingControl: 'Spending control',
  subscriptionLoad: 'Subscription load',
  netFlow: 'Net flow',
};

function driverToStatus(d: DriverInterpretation): StatusType {
  if (d === 'Strong') return 'strong';
  if (d === 'Moderate') return 'moderate';
  return 'high';
}

function labelToStatus(label: string): StatusType {
  if (label === 'Strong') return 'strong';
  if (label === 'Moderate') return 'moderate';
  return 'high';
}

function scoreToFilledSegments(score: number): number {
  const segments = 5;
  return Math.min(segments, Math.max(0, Math.round((score / 100) * segments)));
}

export interface DashboardHeroCardProps {
  score: number;
  label: string;
  drivers: {
    cashStability: DriverInterpretation;
    spendingControl: DriverInterpretation;
    subscriptionLoad: DriverInterpretation;
    netFlow: DriverInterpretation;
  };
  onDetailsPress: () => void;
}

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
  },
  android: { elevation: 8 },
});

export function DashboardHeroCard({
  score,
  label,
  drivers,
  onDetailsPress,
}: DashboardHeroCardProps) {
  const filled = scoreToFilledSegments(score);

  return (
    <View style={[styles.wrapper, cardShadow]}>
      <LinearGradient
        colors={gradientColors.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.titleRow}>
          <Text style={styles.title}>Financial awareness</Text>
          <TouchableOpacity onPress={onDetailsPress} hitSlop={8}>
            <Text style={styles.detailsLink}>Details →</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.score}>{score} / 100</Text>
        <View style={styles.badgeWrap}>
          <StatusBadge label={label} status={labelToStatus(label)} />
        </View>
        <View style={styles.segmentWrap}>
          <SegmentProgressBar filled={filled} />
        </View>
        <Text style={styles.driversTitle}>What drives your score</Text>
        <View style={styles.driversList}>
          {DRIVER_ORDER.map((key) => (
            <View key={key} style={styles.driverRow}>
              <Text style={styles.driverLabel}>{DRIVER_LABELS[key]}</Text>
              <StatusBadge label={drivers[key]} status={driverToStatus(drivers[key])} />
            </View>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 28,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginTop: 16,
  },
  gradient: {
    padding: 24,
    paddingVertical: 28,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.2,
  },
  detailsLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  score: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  badgeWrap: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  segmentWrap: {
    marginBottom: 20,
  },
  driversTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
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
    borderBottomColor: 'rgba(255, 255, 255, 0.25)',
  },
  driverLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
