import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/tokens';

export interface PaydayStatusCardProps {
  /** Days until next payday */
  daysUntilPaycheck: number;
  /** Available balance until payday */
  availableBalance: number;
  /** Target daily spend to stay on track */
  targetDaily: number;
  /** Actual average daily spend (e.g. last 3 days) */
  actualDaily: number;
  onPress?: () => void;
}

/**
 * Returns status color for payday pace: good when on track, moderate/high when over.
 * TODO: Wire to backend; data is currently hardcoded in the screen.
 */
export function getPaydayStatusColor(
  actualDaily: number,
  targetDaily: number
): 'good' | 'moderate' | 'high' {
  if (targetDaily <= 0) return 'good';
  if (actualDaily <= targetDaily) return 'good';
  const ratio = actualDaily / targetDaily;
  return ratio >= 1.5 ? 'high' : 'moderate';
}

export function PaydayStatusCard({
  daysUntilPaycheck,
  availableBalance,
  targetDaily,
  actualDaily,
  onPress,
}: PaydayStatusCardProps) {
  const isOverPace = actualDaily > targetDaily;
  const statusColor = getPaydayStatusColor(actualDaily, targetDaily);
  const warningColor = statusColor === 'high' ? colors.status.high : colors.status.moderate;

  const content = (
    <>
      <View style={styles.iconChip}>
        <Text style={styles.iconChipEmoji}>💰</Text>
      </View>
      <View style={styles.center}>
        <Text style={styles.title}>{daysUntilPaycheck} days until payday</Text>
        <Text style={styles.subtitle}>${targetDaily}/day to stay on track</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.value}>${availableBalance} left</Text>
        {isOverPace ? (
          <Text style={[styles.warningLine, { color: warningColor }]}>
            ⚠️ ${actualDaily}/day
          </Text>
        ) : (
          <Text style={styles.mutedLine}>${actualDaily}/day</Text>
        )}
      </View>
    </>
  );

  return (
    <Pressable
      onPress={() => {
        // TODO: Optionally open Payday breakdown as modal/Alert; currently navigates to PaycheckBreakdown screen.
        if (onPress) onPress();
      }}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      {Platform.OS === 'ios' ? (
        <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
      ) : null}
      <View style={styles.glassOverlay} />
      <View style={styles.row}>
        {content}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 24,
    marginBottom: 16,
    minHeight: 72,
    justifyContent: 'center',
    ...(Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }) as object),
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  cardPressed: {
    opacity: 0.92,
  },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconChipEmoji: {
    fontSize: 22,
  },
  center: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.muted,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  warningLine: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  mutedLine: {
    fontSize: 13,
    color: colors.text.muted,
    marginTop: 2,
  },
});
