import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Bell, Menu } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppHeader, AppHeaderDark } from '../components';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { LearnStackParamList } from '../navigation/types';
import { useAuthStore } from '../state/authStore';
import { getStreak } from '../data/learnQuestStorage';
import { useTheme } from '../theme/useTheme';

type Nav = NativeStackNavigationProp<LearnStackParamList, 'LearnHome'>;

const GRADIENT_COLORS = ['#1E1B4B', '#3730A3', '#5B4FE8'] as const;

const todayLesson = {
  emoji: '💳',
  title: 'Why your credit card is costing you more than you think',
  description: 'Personalized for you — Chase Sapphire payment due in 2 days.',
  minutes: 2,
  category: 'Credit',
};

const learningPaths = [
  { id: '1', emoji: '💳', name: 'Credit', done: 2, total: 5, active: true },
  { id: '2', emoji: '🔄', name: 'Subscriptions', done: 0, total: 4, active: false },
  { id: '3', emoji: '💰', name: 'Spending', done: 3, total: 4, active: false },
  { id: '4', emoji: '🏦', name: 'Savings', done: 0, total: 4, active: false },
];

const quickWins = [
  { id: '1', emoji: '🔄', title: 'How subscriptions drain wealth', urgent: true },
  { id: '2', emoji: '📊', title: 'What is a credit score?', urgent: false },
  { id: '3', emoji: '🏦', title: 'Read your bank statement', urgent: false },
  { id: '4', emoji: '💡', title: '30% rule explained', urgent: false },
];

export function LearnScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<Nav>();
  const { isDark, colors: themeColors } = useTheme();
  const { user } = useAuthStore();
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const [streak, setStreak] = useState(3);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getStreak().then((s) => setStreak(s > 0 ? s : 3));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const s = await getStreak();
    setStreak(s > 0 ? s : 3);
    setRefreshing(false);
  }, []);

  const Header = isDark ? AppHeaderDark : AppHeader;
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const cardBorder = isDark ? { borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' as const } : {};

  const headerRight = (
    <View style={styles.headerRight}>
      <View style={[styles.streakPill, isDark && { backgroundColor: themeColors.cardBackground }]}>
        <Text style={styles.streakEmoji}>🔥</Text>
        <Text style={[styles.streakText, { color: textPrimary }]}>{streak} day streak</Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Notifications')}
        style={styles.headerIcon}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Bell size={22} color={themeColors.textPrimary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Menu')}
        style={styles.headerIcon}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Menu size={22} color={themeColors.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={StyleSheet.absoluteFill} collapsable={false}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: themeColors.background }]} />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: tabBarHeight + (insets.bottom || 24) },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366F1"
          />
        }
      >
        <Header title={`Hi, ${firstName} 👋`} right={headerRight} />

        <View style={styles.main}>
          {/* ZONE 1 — Today's lesson card */}
          <LinearGradient
            colors={[...GRADIENT_COLORS]}
            style={styles.lessonCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.decorativeCircleTopRight} />
            <View style={styles.decorativeCircleBottomLeft} />
            <View style={styles.lessonTopRow}>
              <Text style={styles.lessonLabel}>TODAY'S LESSON</Text>
              <View style={styles.lessonStreakBadge}>
                <Text style={styles.lessonStreakText}>🔥 Day {streak}</Text>
              </View>
            </View>
            <Text style={styles.lessonEmoji}>{todayLesson.emoji}</Text>
            <Text style={styles.lessonTitle}>{todayLesson.title}</Text>
            <Text style={styles.lessonDescription}>{todayLesson.description}</Text>
            <View style={styles.lessonFooter}>
              <Text style={styles.lessonMeta}>
                {todayLesson.minutes} min · {todayLesson.category}
              </Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => navigation.navigate('LessonDetail', { lessonId: 'today' })}
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonText}>Start →</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* ZONE 2 — Your path */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>Your path</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LearnHome')} activeOpacity={0.7}>
              <Text style={styles.seeAllLink}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pathScrollContent}
          >
            {learningPaths.map((path) => (
              <TouchableOpacity
                key={path.id}
                style={[
                  styles.pathCard,
                  {
                    backgroundColor: path.active ? 'rgba(91,79,232,0.1)' : cardBg,
                    borderWidth: 1,
                    borderColor: path.active ? 'rgba(91,79,232,0.4)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                  },
                ]}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 24 }}>{path.emoji}</Text>
                <Text style={[styles.pathName, { color: textPrimary }]} numberOfLines={1}>
                  {path.name}
                </Text>
                <View style={[styles.pathBarBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
                  <View
                    style={[
                      styles.pathBarFill,
                      { width: `${(path.done / path.total) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={[styles.pathDone, { color: textMuted }]}>
                  {path.done}/{path.total} done
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ZONE 3 — Quick wins grid */}
          <Text style={[styles.sectionTitleStandalone, { color: textPrimary }]}>
            Quick wins · 60 sec
          </Text>
          <View style={styles.quickWinsGrid}>
            {quickWins.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.quickWinCard,
                  { backgroundColor: cardBg },
                  cardBorder,
                  item.urgent && styles.quickWinCardUrgent,
                ]}
                onPress={() =>
                  navigation.navigate('QuickWin', { id: item.id, type: 'guide' })
                }
                activeOpacity={0.8}
              >
                {item.urgent ? (
                  <Text style={styles.quickWinUrgentTag}>⚡ URGENT FOR YOU</Text>
                ) : null}
                <Text style={styles.quickWinEmoji}>{item.emoji}</Text>
                <Text style={[styles.quickWinTitle, { color: textPrimary }]} numberOfLines={2}>
                  {item.title}
                </Text>
                <View style={styles.quickWinFooter}>
                  <Text style={[styles.quickWinDuration, { color: textMuted }]}>60 sec</Text>
                  <Text style={styles.quickWinArrow}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 0 },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  streakEmoji: { fontSize: 14 },
  streakText: { fontSize: 13, fontWeight: '600' },
  headerIcon: { padding: 4 },
  main: {
    paddingTop: 24,
  },
  lessonCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  decorativeCircleTopRight: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 80,
  },
  decorativeCircleBottomLeft: {
    position: 'absolute',
    bottom: -60,
    left: -20,
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 100,
  },
  lessonTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  lessonLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.2,
  },
  lessonStreakBadge: {
    backgroundColor: 'rgba(251,146,60,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  lessonStreakText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FB923C',
  },
  lessonEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 6,
  },
  lessonDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 16,
  },
  lessonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lessonMeta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3730A3',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  seeAllLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B4FE8',
  },
  pathScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 10,
    flexDirection: 'row',
  },
  pathCard: {
    width: 110,
    flexShrink: 0,
    borderRadius: 16,
    padding: 14,
  },
  pathEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  pathName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  pathBarBg: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  pathBarFill: {
    height: '100%',
    backgroundColor: '#5B4FE8',
    borderRadius: 2,
  },
  pathDone: {
    fontSize: 11,
  },
  sectionTitleStandalone: {
    fontSize: 17,
    fontWeight: '700',
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  quickWinsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginHorizontal: 16,
    paddingBottom: 24,
  },
  quickWinCard: {
    width: '47%',
    borderRadius: 16,
    padding: 14,
  },
  quickWinCardUrgent: {
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    backgroundColor: 'rgba(239,68,68,0.05)',
  },
  quickWinUrgentTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  quickWinEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickWinTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 8,
  },
  quickWinFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickWinDuration: {
    fontSize: 11,
  },
  quickWinArrow: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5B4FE8',
  },
});
