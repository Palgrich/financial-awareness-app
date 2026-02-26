import React, { useCallback, useMemo, useState } from 'react';
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Bell, Menu } from 'lucide-react-native';
import { AppHeader, AppHeaderDark } from '../components';
import {
  TodaysMissionCard,
  ChallengesCard,
  LearningPathsCard,
  LessonsCard,
} from '../components/learn';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { LearnStackParamList } from '../navigation/types';
import { learnUserData, type LearnUserData as LearnUserDataType } from '../data/learnUserData';
import { getQuestProgress, getStreak } from '../data/learnQuestStorage';
import type { QuestProgressState } from '../data/learnQuestStorage';
import { getLearnData, markLessonCompleted } from '../api/endpoints/learn';
import { queryKeys } from '../api/queryKeys';
import { colors } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import type { Challenge, LearningPath, Lesson } from '../types/domain';
import type { ChallengeRow, PathRow, LessonRow } from '../components/learn';

const LEARN_QUESTS = [
  {
    title: 'Subscription Cleanse',
    icon: '✂️',
    iconBg: '#EDE9FE',
    tag: '🔴 Urgent for you',
    tagBg: '#FEE2E2',
    tagColor: '#DC2626',
    steps: '0/4 steps',
    subtitle: 'Save ~$86/month',
  },
  {
    title: 'Credit Card Basics',
    icon: '💳',
    iconBg: '#DBEAFE',
    tag: '🔴 Urgent for you',
    tagBg: '#FEE2E2',
    tagColor: '#DC2626',
    steps: '0/5 steps',
    subtitle: 'Protect your credit score',
  },
  {
    title: 'Emergency Fund 101',
    icon: '🏦',
    iconBg: '#D1FAE5',
    tag: '⚪ Start when ready',
    tagBg: '#F3F4F6',
    tagColor: '#6B7280',
    steps: '0/3 steps',
    subtitle: 'Build a safety net',
  },
] as const;

const QUICK_WINS_INLINE = [
  { id: 'creditScore', emoji: '📊', title: 'What is a credit score?', type: 'quiz' as const },
  { id: 'thirtyRule', emoji: '💳', title: '30% rule explained', type: 'quiz' as const },
  { id: 'paymentReminder', emoji: '🔔', title: 'Set a payment reminder', type: 'guide' as const },
  { id: 'bankStatement', emoji: '🧾', title: 'Read your bank statement', type: 'quiz' as const },
];

const MONEY_FACTS = [
  'People who track their spending save an average of $200 more per month than those who don\'t.',
  'Paying just $10 extra on a $500 credit card balance saves $150 in interest.',
  'The average American has 4.5 subscriptions they don\'t actively use.',
  'Setting up autopay eliminates late fees for 90% of people who try it.',
  'People with 750+ credit scores pay $1,500 less on car loans on average.',
  'Having even $500 in emergency savings reduces financial stress significantly.',
  'Cancelling one unused $15/month subscription saves $180/year.',
];

const moneyFactStyles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
  },
});

function MoneyFactCard() {
  const { isDark, colors: themeColors } = useTheme();
  const dayIndex = new Date().getDay();
  const fact = MONEY_FACTS[dayIndex] ?? MONEY_FACTS[0];
  const cardBg = isDark ? themeColors.cardBackground : '#FFFBEB';
  const borderColor = isDark ? themeColors.borderColor : '#FDE68A';
  const textColor = themeColors.textPrimary;
  return (
    <View style={[moneyFactStyles.card, { backgroundColor: cardBg, borderColor }]}>
      <Text style={[moneyFactStyles.title, { color: textColor }]}>💡 Did you know?</Text>
      <View style={[moneyFactStyles.divider, { backgroundColor: borderColor }]} />
      <Text style={[moneyFactStyles.text, { color: textColor }]}>{fact}</Text>
    </View>
  );
}

type Nav = NativeStackNavigationProp<LearnStackParamList, 'LearnHome'>;

function toChallengeRows(challenges: Challenge[]): ChallengeRow[] {
  return challenges.map((c) => ({ id: c.id, title: c.title, status: c.status }));
}

function toPathRows(paths: LearningPath[]): PathRow[] {
  return paths.map((p) => ({ id: p.id, title: p.title, lessonCount: p.lessonsCount }));
}

function toLessonRows(lessons: Lesson[]): LessonRow[] {
  return lessons.map((l) => ({
    id: l.id,
    title: l.title,
    durationMin: l.minutes,
    progress: l.status === 'done' ? 'completed' : l.status,
  }));
}

export function LearnScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<Nav>();
  const { isDark, colors: themeColors } = useTheme();
  const Header = isDark ? AppHeaderDark : AppHeader;
  const queryClient = useQueryClient();
  const { data: learnData, isLoading: learnLoading, isError: learnError, refetch: refetchLearn } = useQuery({
    queryKey: queryKeys.learn(),
    queryFn: getLearnData,
  });

  const markDoneMutation = useMutation({
    mutationFn: (lessonId: string) => markLessonCompleted(lessonId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.learn() }),
  });

  const challenges: ChallengeRow[] = useMemo(
    () => (learnLoading ? [] : toChallengeRows(learnData?.challenges ?? [])),
    [learnData?.challenges, learnLoading]
  );
  const paths: PathRow[] = useMemo(
    () => (learnLoading ? [] : toPathRows(learnData?.paths ?? [])),
    [learnData?.paths, learnLoading]
  );
  const lessons: LessonRow[] = useMemo(
    () => (learnLoading ? [] : toLessonRows(learnData?.lessons ?? [])),
    [learnData?.lessons, learnLoading]
  );

  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState<QuestProgressState>({
    subscriptionCleanse: 0,
    creditCardBasics: 0,
    emergencyFund: 0,
  });
  const [streak, setStreak] = useState(learnUserData.streak);

  const data: LearnUserDataType = {
    ...learnUserData,
    streak,
    questProgress: progress,
  };

  const loadStorage = useCallback(async () => {
    const [p, s] = await Promise.all([getQuestProgress(), getStreak()]);
    setProgress(p);
    setStreak(s > 0 ? s : learnUserData.streak);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.learn() }),
      loadStorage(),
    ]);
    setRefreshing(false);
  }, [queryClient, loadStorage]);

  useFocusEffect(
    useCallback(() => {
      loadStorage();
    }, [loadStorage])
  );

  const headerRight = (
    <View style={styles.headerRight}>
      <View style={[styles.streakPill, isDark && { backgroundColor: themeColors.cardBackground }]}>
        <Text style={styles.streakEmoji}>🔥</Text>
        <Text style={[styles.streakText, { color: themeColors.textPrimary }]}>{streak} day streak</Text>
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
        {learnError ? (
          <View style={[styles.errorCard, isDark && { backgroundColor: '#7F1D1D', borderColor: '#991B1B' }]}>
            <Text style={[styles.errorCardTitle, { color: themeColors.textPrimary }]}>Can't load data</Text>
            <Text style={[styles.errorCardSubtitle, { color: themeColors.textMuted }]}>Pull to refresh or try again.</Text>
            <Pressable style={({ pressed }) => [styles.errorCardButton, pressed && styles.errorCardButtonPressed]} onPress={() => refetchLearn()}>
              <Text style={styles.errorCardButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}
        <Header
          title="Learn"
          subtitle="Your personalized plan"
          right={headerRight}
        />
        <View style={styles.main}>
          <View style={styles.missionCardWrap}>
            <TodaysMissionCard
              data={data}
            onCancelGuide={(serviceName) => {
              navigation.navigate('QuestSubscriptionCleanse', {
                step: 1,
                serviceName,
              });
            }}
            onPayNow={() => {
              // Could navigate to payment flow or show modal
            }}
              onIUseIt={() => {}}
            />
          </View>

          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Your Quests</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.questsScrollContent}
          >
            {LEARN_QUESTS.map((quest, index) => (
              <TouchableOpacity
                key={quest.title}
                style={[
                  styles.questCard,
                  { backgroundColor: themeColors.cardBackground },
                  index === 0 && styles.questCardFirst,
                  index === LEARN_QUESTS.length - 1 && styles.questCardLast,
                ]}
                onPress={() => {
                  if (quest.title === 'Subscription Cleanse') {
                    navigation.navigate('QuestSubscriptionCleanse', { step: 1 });
                  }
                }}
                activeOpacity={0.9}
              >
                <View style={[styles.questIconCircle, { backgroundColor: quest.iconBg }]}>
                  <Text style={styles.questIconEmoji}>{quest.icon}</Text>
                </View>
                <Text style={[styles.questCardTitle, { color: themeColors.textPrimary }]}>{quest.title}</Text>
                <View style={[styles.questTag, { backgroundColor: quest.tagBg }]}>
                  <Text style={[styles.questTagText, { color: quest.tagColor }]}>
                    {quest.tag}
                  </Text>
                </View>
                <Text style={[styles.questSteps, { color: themeColors.textMuted }]}>{quest.steps}</Text>
                <Text style={[styles.questSubtitle, { color: colors.accent.primary }]}>{quest.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Quick Wins · 60 sec each</Text>
          <View style={styles.quickWinsGrid}>
            {QUICK_WINS_INLINE.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.quickWinCard, { backgroundColor: themeColors.cardBackground }]}
                onPress={() =>
                  navigation.navigate('QuickWin', { id: item.id, type: item.type })
                }
                activeOpacity={0.9}
              >
                <Text style={styles.quickWinEmoji}>{item.emoji}</Text>
                <Text style={[styles.quickWinTitle, { color: themeColors.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.quickWinArrow, { color: colors.accent.primary }]}>→</Text>
              </TouchableOpacity>
            ))}
          </View>

          <MoneyFactCard />
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
  streakText: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  headerIcon: { padding: 4 },
  main: {
    paddingHorizontal: 0,
    gap: 0,
    paddingTop: 24,
  },
  missionCardWrap: {
    marginHorizontal: 16,
  },
  learnSectionWrap: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 24,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  questsScrollContent: {
    paddingVertical: 4,
  },
  questCard: {
    width: 185,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  questCardFirst: {
    marginLeft: 16,
  },
  questCardLast: {
    marginRight: 16,
  },
  questIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questIconEmoji: {
    fontSize: 20,
  },
  questCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
    color: '#1a1a1a',
  },
  questTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  questTagText: {
    fontSize: 11,
  },
  questSteps: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  questSubtitle: {
    fontSize: 12,
    color: '#6C63FF',
    marginTop: 2,
  },
  quickWinsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginHorizontal: 16,
  },
  quickWinCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  quickWinEmoji: {
    fontSize: 28,
    marginBottom: 10,
  },
  quickWinTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  quickWinArrow: {
    fontSize: 18,
    color: '#6C63FF',
    alignSelf: 'flex-end',
  },
  errorCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  errorCardSubtitle: {
    fontSize: 14,
    color: colors.text.muted,
    marginBottom: 12,
  },
  errorCardButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  errorCardButtonPressed: { opacity: 0.8 },
  errorCardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.white,
  },
});
