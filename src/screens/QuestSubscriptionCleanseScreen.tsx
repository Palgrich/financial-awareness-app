import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { LearnStackParamList } from '../navigation/types';
import { learnUserData } from '../data/learnUserData';
import {
  getSubscriptionDecisions,
  setSubscriptionDecision,
  setQuestStep,
  addToSavedTotal,
  setStreak,
  getStreak,
} from '../data/learnQuestStorage';
import type { SubscriptionDecision } from '../data/learnQuestStorage';
import { getCancellationGuide } from '../data/cancellationGuides';
import { colors } from '../theme/tokens';
import { ChevronLeft } from 'lucide-react-native';

type Route = RouteProp<LearnStackParamList, 'QuestSubscriptionCleanse'>;
type Nav = NativeStackNavigationProp<LearnStackParamList, 'QuestSubscriptionCleanse'>;

const QUIZ_QUESTION = 'Which is NOT a good reason to keep a subscription?';
const QUIZ_OPTIONS = [
  'I use it every week',
  'It costs less than $2/month',
  'I forgot I had it', // C - correct
  'My kid uses it',
];
const QUIZ_CORRECT_INDEX = 2; // C
const QUIZ_INSIGHT =
  'Most people have 2-3 subscriptions they forgot about. That\'s up to $600/year.';

export function QuestSubscriptionCleanseScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const step = route.params?.step ?? 1;
  const serviceNameParam = route.params?.serviceName;

  const [decisions, setDecisions] = useState<Record<string, SubscriptionDecision>>({});
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [showQuizInsight, setShowQuizInsight] = useState(false);

  const subscriptions = learnUserData.subscriptions;
  const monthlyTotal = learnUserData.subscriptionMonthly;
  const yearlyTotal = Math.round(monthlyTotal * 12 * 100) / 100;

  const loadDecisions = useCallback(async () => {
    const d = await getSubscriptionDecisions();
    setDecisions(d);
  }, []);

  useEffect(() => {
    loadDecisions();
  }, [loadDecisions]);

  const setDecision = useCallback(async (name: string, decision: SubscriptionDecision) => {
    await setSubscriptionDecision(name, decision);
    setDecisions((prev) => ({ ...prev, [name]: decision }));
  }, []);

  const cutNames = subscriptions
    .filter((s) => decisions[s.name] === 'cut')
    .map((s) => s.name);
  const top3Cut = cutNames.slice(0, 3);
  const top3CutSubs = subscriptions.filter((s) => top3Cut.includes(s.name));

  const showGuide = step === 3 && serviceNameParam != null;
  const guideSteps = showGuide ? getCancellationGuide(serviceNameParam) : [];

  const goNext = useCallback(
    async (nextStep: number, opts?: { serviceName?: string }) => {
      await setQuestStep('subscriptionCleanse', nextStep);
      navigation.setParams({
        step: nextStep,
        serviceName: opts?.serviceName,
      });
    },
    [navigation]
  );

  const handleStep1Done = useCallback(async () => {
    await setQuestStep('subscriptionCleanse', 2);
    navigation.setParams({ step: 2, serviceName: undefined });
  }, [navigation]);

  const handleQuizOption = useCallback((index: number) => {
    setQuizSelected(index);
    setShowQuizInsight(true);
  }, []);

  const handleQuizNext = useCallback(async () => {
    await setQuestStep('subscriptionCleanse', 3);
    navigation.setParams({ step: 3, serviceName: undefined });
  }, [navigation]);

  const handlePickCancel = useCallback(
    (name: string) => {
      navigation.setParams({ step: 3, serviceName: name });
    },
    [navigation]
  );

  const handleConfirmYes = useCallback(async () => {
    const sub = subscriptions.find((s) => s.name === serviceNameParam);
    const amount = sub ? Math.round(sub.price * 12 * 100) / 100 : 0;
    await setQuestStep('subscriptionCleanse', 4);
    await addToSavedTotal(amount);
    const currentStreak = await getStreak();
    await setStreak(currentStreak + 1);
    navigation.navigate('QuestCelebration', {
      savedAmount: amount,
      serviceName: serviceNameParam,
    });
  }, [serviceNameParam, subscriptions, navigation]);

  const handleRemindTomorrow = useCallback(() => {
    // TODO: expo-notifications schedule
    navigation.navigate('LearnHome');
  }, [navigation]);

  const handleBack = useCallback(() => {
    if (showGuide) {
      navigation.setParams({ step: 3, serviceName: undefined });
    } else {
      navigation.goBack();
    }
  }, [navigation, showGuide]);

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
        <ChevronLeft size={24} color="#0F172A" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Subscription Cleanse</Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  if (showGuide) {
    return (
      <View style={styles.container}>
        <View style={[styles.fill, { backgroundColor: '#F0F2F7' }]} />
        {renderHeader()}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.guideTitle}>How to cancel {serviceNameParam}</Text>
          {guideSteps.map((s) => (
            <View key={s.step} style={styles.guideStep}>
              <View style={styles.guideStepCircle}>
                <Text style={styles.guideStepNum}>{s.step}</Text>
              </View>
              <Text style={styles.guideStepText}>{s.text}</Text>
            </View>
          ))}
          <TouchableOpacity
            style={styles.alreadyDidBtn}
            onPress={() => handleConfirmYes()}
          >
            <Text style={styles.alreadyDidText}>I already did this</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              navigation.setParams({ step: 4, serviceName: serviceNameParam })
            }
          >
            <Text style={styles.primaryBtnText}>Done, take me to confirm →</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (step === 4 && serviceNameParam) {
    return (
      <View style={styles.container}>
        <View style={[styles.fill, { backgroundColor: '#F0F2F7' }]} />
        {renderHeader()}
        <View style={styles.stepContent}>
          <Text style={styles.step4Title}>Did you cancel {serviceNameParam}?</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleConfirmYes}>
            <Text style={styles.primaryBtnText}>Yes, I did it! 🎉</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleRemindTomorrow}>
            <Text style={styles.secondaryBtnText}>Not yet, remind me tomorrow</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (step === 1) {
    return (
      <View style={styles.container}>
        <View style={[styles.fill, { backgroundColor: '#F0F2F7' }]} />
        {renderHeader()}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              You're spending ${monthlyTotal.toFixed(2)}/month on {subscriptions.length}{' '}
              subscriptions.
            </Text>
            <Text style={styles.summarySubtitle}>
              That's ${yearlyTotal.toLocaleString()} a year.
            </Text>
          </View>
          <Text style={styles.listLabel}>Swipe or tap to sort</Text>
          {subscriptions.map((s) => (
            <View key={s.name} style={styles.subRow}>
              <View style={styles.subLogo} />
              <View style={styles.subInfo}>
                <Text style={styles.subName}>{s.name}</Text>
                <Text style={styles.subPrice}>${s.price.toFixed(2)}/month</Text>
              </View>
              <View style={styles.subActions}>
                <Pressable
                  style={[
                    styles.keepCutBtn,
                    decisions[s.name] === 'keep' && styles.keepCutBtnActive,
                    styles.keepBtn,
                  ]}
                  onPress={() => setDecision(s.name, 'keep')}
                >
                  <Text
                    style={[
                      styles.keepCutBtnText,
                      decisions[s.name] === 'keep' && styles.keepCutBtnTextActive,
                    ]}
                  >
                    Keep
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.keepCutBtn,
                    decisions[s.name] === 'cut' && styles.cutBtnActive,
                  ]}
                  onPress={() => setDecision(s.name, 'cut')}
                >
                  <Text
                    style={[
                      styles.keepCutBtnText,
                      decisions[s.name] === 'cut' && styles.cutBtnTextActive,
                    ]}
                  >
                    Cut
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.primaryBtn} onPress={handleStep1Done}>
            <Text style={styles.primaryBtnText}>I've sorted them →</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (step === 2) {
    return (
      <View style={styles.container}>
        <View style={[styles.fill, { backgroundColor: '#F0F2F7' }]} />
        {renderHeader()}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.quizTitle}>Quick Quiz</Text>
          <Text style={styles.quizQuestion}>{QUIZ_QUESTION}</Text>
          {QUIZ_OPTIONS.map((opt, index) => (
            <Pressable
              key={index}
              style={[
                styles.quizOption,
                quizSelected === index && styles.quizOptionSelected,
                quizSelected !== null &&
                  index === QUIZ_CORRECT_INDEX &&
                  styles.quizOptionCorrect,
              ]}
              onPress={() => handleQuizOption(index)}
            >
              <Text style={styles.quizOptionLetter}>
                {String.fromCharCode(65 + index)})
              </Text>
              <Text style={styles.quizOptionText}>{opt}</Text>
            </Pressable>
          ))}
          {showQuizInsight && (
            <View style={styles.insightBox}>
              <Text style={styles.insightText}>{QUIZ_INSIGHT}</Text>
            </View>
          )}
          {showQuizInsight && (
            <TouchableOpacity style={styles.primaryBtn} onPress={handleQuizNext}>
              <Text style={styles.primaryBtnText}>Next →</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }

  if (step === 3) {
    return (
      <View style={styles.container}>
        <View style={[styles.fill, { backgroundColor: '#F0F2F7' }]} />
        {renderHeader()}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.step3Title}>Pick one to cancel today</Text>
          <Text style={styles.step3Subtitle}>
            We'll show you exactly how. Tap one below.
          </Text>
          {top3CutSubs.length === 0 ? (
            <Text style={styles.noCut}>
              You didn't mark any as Cut. Go back and tap "Cut" on at least one
              subscription.
            </Text>
          ) : (
            top3CutSubs.map((s) => (
              <TouchableOpacity
                key={s.name}
                style={styles.pickCard}
                onPress={() => handlePickCancel(s.name)}
              >
                <Text style={styles.pickCardName}>{s.name}</Text>
                <Text style={styles.pickCardPrice}>
                  ${s.price.toFixed(2)}/month
                </Text>
                <Text style={styles.pickCardCta}>See how to cancel →</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fill: { ...StyleSheet.absoluteFillObject },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: '#0F172A',
  },
  headerSpacer: { width: 32 },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 48 },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent.primary,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  summarySubtitle: { fontSize: 16, color: colors.text.muted },
  listLabel: {
    fontSize: 14,
    color: colors.text.muted,
    marginBottom: 12,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  subLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginRight: 12,
  },
  subInfo: { flex: 1 },
  subName: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  subPrice: { fontSize: 14, color: colors.text.muted },
  subActions: { flexDirection: 'row', gap: 8 },
  keepCutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  keepCutBtnActive: {},
  keepBtn: {},
  cutBtnActive: { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
  keepCutBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  keepCutBtnTextActive: { color: colors.status.good },
  cutBtnTextActive: { color: colors.status.high },
  primaryBtn: {
    backgroundColor: colors.accent.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryBtnText: { fontSize: 16, fontWeight: '600', color: colors.text.primary },
  quizTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  quizQuestion: {
    fontSize: 17,
    color: '#0F172A',
    marginBottom: 20,
  },
  quizOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quizOptionSelected: { borderColor: colors.accent.primary },
  quizOptionCorrect: { borderColor: colors.status.good },
  quizOptionLetter: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.muted,
    marginRight: 12,
  },
  quizOptionText: { fontSize: 16, color: '#0F172A' },
  insightBox: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: 16,
    borderRadius: 14,
    marginTop: 16,
  },
  insightText: { fontSize: 15, color: '#0F172A' },
  step3Title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  step3Subtitle: {
    fontSize: 15,
    color: colors.text.muted,
    marginBottom: 20,
  },
  pickCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  pickCardName: { fontSize: 18, fontWeight: '600', color: '#0F172A' },
  pickCardPrice: { fontSize: 14, color: colors.text.muted, marginTop: 4 },
  pickCardCta: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent.primary,
    marginTop: 8,
  },
  noCut: {
    fontSize: 15,
    color: colors.text.muted,
    fontStyle: 'italic',
  },
  guideTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 20,
  },
  guideStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  guideStepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  guideStepNum: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  guideStepText: { flex: 1, fontSize: 16, color: '#0F172A' },
  alreadyDidBtn: {
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  alreadyDidText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent.primary,
  },
  stepContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  step4Title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 32,
  },
});
