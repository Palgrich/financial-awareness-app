import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { colors } from '../../theme/tokens';

export type QuestTag = 'urgent' | 'good_timing' | 'ready';

const TAG_CONFIG: Record<QuestTag, { label: string; dot: string }> = {
  urgent: { label: 'Urgent for you', dot: '🔴' },
  good_timing: { label: 'Good timing', dot: '🟡' },
  ready: { label: 'Start when ready', dot: '⚪' },
};

export interface QuestCardProps {
  emoji: string;
  title: string;
  tag: QuestTag;
  progressLabel: string;
  subtitle: string;
  onPress: () => void;
  /** Colored circle background (e.g. '#8B5CF6' for purple). When set, iconEmoji is shown inside the circle instead of emoji. */
  iconCircleColor?: string;
  /** Emoji inside the circle (e.g. '✂️', '💳', '🏦'). */
  iconEmoji?: string;
}

export function QuestCard({
  emoji,
  title,
  tag,
  progressLabel,
  subtitle,
  onPress,
  iconCircleColor,
  iconEmoji,
}: QuestCardProps) {
  const tagInfo = TAG_CONFIG[tag];
  const showCircle = iconCircleColor != null && iconEmoji != null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] },
      ]}
    >
      <View style={styles.header}>
        {showCircle ? (
          <View style={[styles.iconCircle, { backgroundColor: iconCircleColor }]}>
            <Text style={styles.iconCircleEmoji}>{iconEmoji}</Text>
          </View>
        ) : (
          <Text style={styles.emoji}>{emoji}</Text>
        )}
        <View style={styles.tag}>
          <Text style={styles.tagDot}>{tagInfo.dot}</Text>
          <Text style={styles.tagLabel}>{tagInfo.label}</Text>
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.progress}>{progressLabel}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    width: 200,
    ...(Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }) as object),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  emoji: { fontSize: 28 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleEmoji: { fontSize: 22 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagDot: { fontSize: 8 },
  tagLabel: { fontSize: 11, fontWeight: '600', color: colors.text.secondary },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 6,
  },
  progress: {
    fontSize: 13,
    color: colors.text.muted,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.accent.primary,
    fontWeight: '500',
  },
});
