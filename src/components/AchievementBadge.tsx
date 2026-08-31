import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Achievement } from '../domain/achievements';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: number;
  dark?: boolean;
}

/** Circular achievement badge — full-color when unlocked, dimmed when locked. */
export function AchievementBadge({ achievement, size = 56, dark }: AchievementBadgeProps) {
  const { unlocked, emoji } = achievement;
  const bg = unlocked
    ? 'rgba(91,79,232,0.15)'
    : dark
      ? 'rgba(255,255,255,0.06)'
      : 'rgba(15,23,42,0.05)';
  const borderColor = unlocked ? '#5B4FE8' : 'transparent';

  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          borderColor,
          borderWidth: unlocked ? 2 : 0,
        },
      ]}
    >
      <Text style={[styles.emoji, { fontSize: size * 0.42 }, !unlocked && styles.locked]}>
        {emoji}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    textAlign: 'center',
  },
  locked: {
    opacity: 0.35,
  },
});
