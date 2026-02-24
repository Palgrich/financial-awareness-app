import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { tokens, colors } from '../theme/tokens';

export interface SegmentProgressBarProps {
  /** Number of segments filled (0 to totalSegments) */
  filled: number;
  /** total segments (default 5) */
  totalSegments?: number;
  /** 'hero' = white segments on gradient; 'default' = colored with shadow */
  variant?: 'hero' | 'default';
  /** Fill color for default variant (e.g. status green/orange/red) */
  color?: string;
}

export function SegmentProgressBar({
  filled,
  totalSegments = tokens.progress.segments,
  variant = 'hero',
  color = colors.status.good,
}: SegmentProgressBarProps) {
  const isHero = variant === 'hero';
  const gap = isHero ? 8 : tokens.progress.gap;
  const emptyColor = isHero ? tokens.colors.progressHeroEmpty : colors.progressBar.empty;
  const filledColor = isHero ? tokens.colors.progressHeroFilled : color;

  const segmentShadow = !isHero && color
    ? Platform.select({
        ios: {
          shadowColor: color,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        },
        android: { elevation: 2 },
      })
    : undefined;

  return (
    <View style={[styles.container, { gap }]}>
      {[...Array(totalSegments)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            { backgroundColor: i < filled ? filledColor : emptyColor },
            i < filled && segmentShadow,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  segment: {
    flex: 1,
    height: tokens.progress.height,
    borderRadius: 999,
  },
});
