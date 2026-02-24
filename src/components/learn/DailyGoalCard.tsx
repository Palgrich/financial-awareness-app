import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../../theme/tokens';
import { GlassCardContainer } from '../GlassCardContainer';
import { IllustrationBackgroundLayer } from '../IllustrationBackgroundLayer';
import { SegmentProgressBar } from '../SegmentProgressBar';

const ILLUSTRATION_OPACITY = 0.14;

export interface DailyGoalCardProps {
  streakDays: number;
  xp: number;
  minutesDone: number;
  minutesTarget: number;
  hasInProgress: boolean;
  onPress?: () => void;
}

export function DailyGoalCard({
  streakDays,
  xp,
  minutesDone,
  minutesTarget,
  hasInProgress,
  onPress,
}: DailyGoalCardProps) {
  const filledSegments =
    minutesTarget <= 0
      ? 0
      : Math.min(5, Math.round((minutesDone / minutesTarget) * 5));

  const content = (
    <>
      <IllustrationBackgroundLayer
        emoji="🎯"
        variant="card"
        glowColor={colors.glow.credit}
        opacityOverride={ILLUSTRATION_OPACITY}
      />
      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.badge}>
            <Text style={styles.badgeEmoji}>🔥</Text>
            <Text style={styles.badgeValue}>{streakDays}</Text>
            <Text style={styles.badgeLabel}>day streak</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeEmoji}>⭐</Text>
            <Text style={styles.badgeValue}>{xp}</Text>
            <Text style={styles.badgeLabel}>XP</Text>
          </View>
        </View>
        <View style={styles.goalBlock}>
          <Text style={styles.goalLabel}>Daily goal</Text>
          <View style={styles.segmentWrap}>
            <SegmentProgressBar
              filled={filledSegments}
              totalSegments={5}
              variant="default"
              color={colors.status.good}
            />
          </View>
          <Text style={styles.goalText}>
            {minutesDone} / {minutesTarget} min
          </Text>
        </View>
        <View style={styles.ctaRow}>
          <Text style={styles.ctaText}>
            {hasInProgress ? 'Continue →' : 'Start today →'}
          </Text>
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
        <GlassCardContainer gradientKey="credit">{content}</GlassCardContainer>
      </Pressable>
    );
  }

  return (
    <View style={wrapperStyle}>
      <GlassCardContainer gradientKey="credit">{content}</GlassCardContainer>
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
  },
  row: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 20,
  },
  badge: {
    alignItems: 'flex-start',
  },
  badgeEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  badgeValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
  },
  badgeLabel: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  goalBlock: {
    marginBottom: 16,
  },
  goalLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  segmentWrap: {
    marginBottom: 6,
  },
  goalText: {
    fontSize: 13,
    color: colors.text.muted,
  },
  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent.primary,
  },
});
