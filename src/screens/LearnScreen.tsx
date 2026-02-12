import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppHeader, AppHeaderDark, Card, SectionTitle, ListRow } from '../components';
import { useStore } from '../state/store';
import type { LearnStackParamList } from '../navigation/types';
import type { LessonProgress } from '../state/store';

type Nav = NativeStackNavigationProp<LearnStackParamList, 'LearnHome'>;

const PATHS = [
  { id: 'fees', title: 'Avoid fees', lessonIds: ['l4', 'l5', 'l6'] },
  { id: 'savings', title: 'Build savings', lessonIds: ['l1', 'l2', 'l3', 'l12'] },
  { id: 'cds', title: 'Understand CDs', lessonIds: ['l7', 'l8', 'l9'] },
  { id: 'subs', title: 'Master subscriptions', lessonIds: ['l10'] },
];

function progressLabel(p: LessonProgress): string {
  if (p === 'completed') return 'Completed';
  if (p === 'in_progress') return 'In progress';
  return 'Not started';
}

export function LearnScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const lessons = useStore((s) => s.lessons);
  const challenges = useStore((s) => s.challenges);
  const lessonProgress = useStore((s) => s.lessonProgress);
  const dark = useStore((s) => s.preferences.darkMode);
  const streak = useStore((s) => s.streak);
  const xpTotal = useStore((s) => s.xpTotal);
  const todayLearnedMinutes = useStore((s) => s.todayLearnedMinutes);
  const dailyGoalMinutes = useStore((s) => s.dailyGoalMinutes);

  const Header = dark ? AppHeaderDark : AppHeader;
  const bg = dark ? '#0f172a' : '#f8fafc';
  const cardBg = dark ? '#1e293b' : '#ffffff';

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: bg }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header title="Learn" subtitle="Short lessons on banking and saving" />

        <View style={[styles.gamification, { backgroundColor: dark ? '#1e293b' : '#ffffff', borderColor: dark ? '#475569' : '#e2e8f0' }]}>
          <View style={styles.gamificationRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>🔥</Text>
              <Text style={[styles.badgeValue, { color: dark ? '#f1f5f9' : '#0f172a' }]}>{streak}</Text>
              <Text style={[styles.badgeLabel, { color: dark ? '#94a3b8' : '#64748b' }]}>day streak</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>⭐</Text>
              <Text style={[styles.badgeValue, { color: dark ? '#f1f5f9' : '#0f172a' }]}>{xpTotal}</Text>
              <Text style={[styles.badgeLabel, { color: dark ? '#94a3b8' : '#64748b' }]}>XP</Text>
            </View>
          </View>
          <View style={styles.dailyGoal}>
            <Text style={[styles.dailyGoalLabel, { color: dark ? '#94a3b8' : '#64748b' }]}>Daily goal</Text>
            <View style={[styles.dailyGoalBar, { backgroundColor: dark ? '#475569' : '#e2e8f0' }]}>
              <View
                style={[
                  styles.dailyGoalFill,
                  { width: `${Math.min(100, (todayLearnedMinutes / Math.max(1, dailyGoalMinutes)) * 100)}%` },
                ]}
              />
            </View>
            <Text style={[styles.dailyGoalText, { color: dark ? '#94a3b8' : '#64748b' }]}>
              {todayLearnedMinutes} / {dailyGoalMinutes} min
            </Text>
          </View>
        </View>

        <SectionTitle title="Learning paths" dark={dark} />
        {PATHS.map((path) => (
          <Card
            key={path.id}
            dark={dark}
            style={styles.pathCard}
            onPress={() => {
              const first = path.lessonIds[0];
              if (first) navigation.navigate('LessonDetail', { lessonId: first });
            }}
          >
            <Text style={[styles.pathTitle, { color: dark ? '#f1f5f9' : '#0f172a' }]}>{path.title}</Text>
            <Text style={[styles.pathSub, { color: dark ? '#94a3b8' : '#64748b' }]}>
              {path.lessonIds.length} lesson{path.lessonIds.length !== 1 ? 's' : ''}
            </Text>
          </Card>
        ))}

        <SectionTitle title="Lessons" dark={dark} />
        <View style={[styles.listCard, { backgroundColor: cardBg, borderColor: dark ? '#475569' : '#e2e8f0' }]}>
          {lessons.map((lesson) => {
            const progress = lessonProgress[lesson.id] ?? 'not_started';
            return (
              <ListRow
                key={lesson.id}
                dark={dark}
                title={lesson.title}
                subtitle={`${lesson.durationMin} min · ${progressLabel(progress)}`}
                right={
                  <Text style={[styles.progressChip, progress === 'completed' && styles.progressDone, { color: dark ? '#94a3b8' : '#64748b' }]}>
                    {progressLabel(progress)}
                  </Text>
                }
                onPress={() => navigation.navigate('LessonDetail', { lessonId: lesson.id })}
              />
            );
          })}
        </View>

        <SectionTitle title="Challenges" dark={dark} />
        <View style={[styles.listCard, { backgroundColor: cardBg, borderColor: dark ? '#475569' : '#e2e8f0' }]}>
          {challenges.map((c) => (
            <ListRow
              key={c.id}
              dark={dark}
              title={c.title}
              subtitle={c.status}
              onPress={() => navigation.navigate('ChallengeDetail', { challengeId: c.id })}
            />
          ))}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  pathCard: { marginHorizontal: 16, marginBottom: 8 },
  pathTitle: { fontSize: 17, fontWeight: '600' },
  pathSub: { fontSize: 13, marginTop: 4 },
  gamification: { marginHorizontal: 16, marginBottom: 16, padding: 16, borderRadius: 12, borderWidth: 1 },
  gamificationRow: { flexDirection: 'row', gap: 24, marginBottom: 12 },
  badge: { alignItems: 'center' },
  badgeEmoji: { fontSize: 24, marginBottom: 4 },
  badgeValue: { fontSize: 18, fontWeight: '600' },
  badgeLabel: { fontSize: 12 },
  dailyGoal: {},
  dailyGoalLabel: { fontSize: 12, marginBottom: 4 },
  dailyGoalBar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  dailyGoalFill: { height: '100%', backgroundColor: '#2563eb', borderRadius: 4 },
  dailyGoalText: { fontSize: 12, marginTop: 4 },
  listCard: { marginHorizontal: 16, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0' },
  progressChip: { fontSize: 12 },
  progressDone: { color: '#16a34a', fontWeight: '600' },
});
