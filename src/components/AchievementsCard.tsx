import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AchievementBadge } from './AchievementBadge';
import type { Achievement } from '../domain/achievements';

interface AchievementsCardProps {
  achievements: Achievement[];
  unlocked: number;
  total: number;
  onSeeAll?: () => void;
  dark?: boolean;
}

/**
 * Summary card for the home screen — replaces the old composite health/pulse
 * score with a progress-driven achievements strip.
 */
export function AchievementsCard({ achievements, unlocked, total, onSeeAll, dark }: AchievementsCardProps) {
  const textPrimary = dark ? '#F8FAFC' : '#0F172A';
  const textMuted = dark ? '#94A3B8' : '#64748B';
  const cardBg = dark ? '#1E293B' : '#FFFFFF';
  const cardBorder = dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)';

  // Show unlocked first, then the closest to unlocking, up to 5 badges.
  const preview = useMemo(() => {
    const unlockedList = achievements.filter((a) => a.unlocked);
    const lockedByClosest = achievements
      .filter((a) => !a.unlocked)
      .sort((a, b) => b.progress / b.target - a.progress / a.target);
    return [...unlockedList, ...lockedByClosest].slice(0, 5);
  }, [achievements]);

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: textPrimary }]}>Achievements</Text>
          <Text style={[styles.subtitle, { color: textMuted }]}>
            {unlocked} of {total} unlocked
          </Text>
        </View>
        {onSeeAll ? (
          <TouchableOpacity onPress={onSeeAll} hitSlop={8} activeOpacity={0.7}>
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.badgeRow}>
        {preview.map((a) => (
          <AchievementBadge key={a.id} achievement={a} dark={dark} size={52} />
        ))}
      </View>

      <View style={[styles.progressTrack, { backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.08)' }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${total > 0 ? (unlocked / total) * 100 : 0}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: { fontSize: 17, fontWeight: '700' },
  subtitle: { fontSize: 13, marginTop: 2 },
  seeAll: { fontSize: 14, fontWeight: '600', color: '#5B4FE8' },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#5B4FE8',
  },
});
