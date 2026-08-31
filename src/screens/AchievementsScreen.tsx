import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { AchievementBadge } from '../components';
import { useTheme } from '../theme/useTheme';
import { useAchievements } from '../state/useAchievements';
import type { Achievement, AchievementCategory } from '../domain/achievements';

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  learning: 'Learning',
  consistency: 'Consistency',
  action: 'Action',
  mastery: 'Mastery',
};

const CATEGORY_ORDER: AchievementCategory[] = ['learning', 'consistency', 'action', 'mastery'];

export function AchievementsScreen() {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const { achievements, unlocked, total } = useAchievements();

  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const bg = isDark ? '#0F172A' : '#F8FAFC';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)';

  const grouped = useMemo(() => {
    const map: Record<AchievementCategory, Achievement[]> = {
      learning: [],
      consistency: [],
      action: [],
      mastery: [],
    };
    achievements.forEach((a) => map[a.category].push(a));
    return map;
  }, [achievements]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12} style={styles.backBtn}>
          <ChevronLeft size={26} color={textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>Achievements</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.summary, { color: textMuted }]}>
          {unlocked} of {total} unlocked
        </Text>

        {CATEGORY_ORDER.map((cat) => (
          <View key={cat} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>{CATEGORY_LABELS[cat]}</Text>
            {grouped[cat].map((a) => (
              <View key={a.id} style={[styles.row, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                <AchievementBadge achievement={a} dark={isDark} size={48} />
                <View style={styles.rowText}>
                  <Text style={[styles.rowTitle, { color: textPrimary }]}>{a.title}</Text>
                  <Text style={[styles.rowDesc, { color: textMuted }]}>{a.description}</Text>
                  {!a.unlocked ? (
                    <View style={styles.progressWrap}>
                      <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.08)' }]}>
                        <View style={[styles.progressFill, { width: `${(a.progress / a.target) * 100}%` }]} />
                      </View>
                      <Text style={[styles.progressText, { color: textMuted }]}>
                        {a.progress}/{a.target}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.unlockedTag}>Unlocked</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 16, paddingTop: 8 },
  summary: { fontSize: 14, marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 14,
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '600' },
  rowDesc: { fontSize: 13, marginTop: 2 },
  progressWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  progressTrack: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: '#5B4FE8' },
  progressText: { fontSize: 12, minWidth: 34, textAlign: 'right' },
  unlockedTag: { fontSize: 12, fontWeight: '700', color: '#22C55E', marginTop: 8 },
});
