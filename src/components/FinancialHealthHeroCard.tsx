import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { colors, typography, illustrations } from '../theme/tokens';
import { GlassCardContainer } from './GlassCardContainer';
import { IllustrationBackgroundLayer } from './IllustrationBackgroundLayer';
import { StatusBadge } from './StatusBadge';

export interface FinancialHealthHeroCardProps {
  score: number;
  maxScore: number;
  status: string;
  statusColor: string;
  description: string;
  filledSegments: number;
  totalSegments: number;
  onPress?: () => void;
  /** Show "tap to see breakdown" hint with chevron next to badge. */
  showTapHint?: boolean;
  /** One-time subtle pulse to hint card is tappable (call onHintPulseDone when finished). */
  showPulse?: boolean;
  onHintPulseDone?: () => void;
}

export function FinancialHealthHeroCard({
  score,
  maxScore,
  status,
  statusColor,
  description,
  filledSegments,
  totalSegments,
  onPress,
  showTapHint = false,
  showPulse = false,
  onHintPulseDone,
}: FinancialHealthHeroCardProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!showPulse) return;
    scale.value = withSequence(
      withTiming(1.02, { duration: 600 }),
      withTiming(1, { duration: 600 }, () => {
        if (onHintPulseDone) runOnJS(onHintPulseDone)();
      })
    );
  }, [showPulse]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const content = (
    <>
      <IllustrationBackgroundLayer
        emoji={illustrations.hero}
        variant="hero"
        glowColor={colors.glow.hero}
      />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Financial Health</Text>
          <View style={styles.badgeRow}>
            {showTapHint ? (
              <Text style={styles.tapHint}>tap to see breakdown</Text>
            ) : null}
            <StatusBadge label={status} statusColor={statusColor} variant="hero" />
            {showTapHint ? (
              <ChevronRight size={18} color={colors.text.whiteSecondary} style={styles.chevron} />
            ) : null}
          </View>
        </View>
        <View style={styles.scoreRow}>
          <View style={styles.scoreWrap}>
            <Text style={styles.scoreMain}>{score}</Text>
            <Text style={styles.scoreSecondary}>/ {maxScore}</Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
      </View>
    </>
  );

  if (showPulse) {
    return (
      <Animated.View style={[styles.wrapper, animatedCardStyle]}>
        <GlassCardContainer gradientKey="hero" variant="hero" onPress={onPress}>
          {content}
        </GlassCardContainer>
      </Animated.View>
    );
  }

  return (
    <GlassCardContainer gradientKey="hero" variant="hero" onPress={onPress}>
      {content}
    </GlassCardContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: { borderRadius: 28, overflow: 'hidden' },
  content: {
    position: 'relative',
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tapHint: {
    fontSize: 11,
    color: colors.text.whiteSecondary,
    fontWeight: '500',
  },
  chevron: { marginLeft: 2 },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.whiteSubtle,
    letterSpacing: -0.3,
  },
  scoreRow: {
    marginBottom: 20,
  },
  scoreWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  scoreMain: {
    fontSize: 64,
    lineHeight: 68,
    fontWeight: '700',
    color: colors.text.white,
    letterSpacing: -0.5,
  },
  scoreSecondary: {
    fontSize: 30,
    lineHeight: 36,
    color: colors.text.whiteSecondary,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.text.whiteSecondary,
    fontWeight: '400',
    maxWidth: '70%',
  },
});
