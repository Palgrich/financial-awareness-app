import React, { useState } from 'react';
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
import { ChevronLeft } from 'lucide-react-native';
import type { LearnStackParamList } from '../navigation/types';
import { colors } from '../theme/tokens';

type Route = RouteProp<LearnStackParamList, 'QuickWin'>;

const QUIZ_CONTENT: Record<string, { question: string; options: string[]; correct: number; insight: string }> = {
  creditScore: {
    question: 'What does a credit score tell lenders?',
    options: [
      'How much money you have in the bank',
      'How likely you are to pay back money you borrow',
      'How many jobs you have had',
      'How old you are',
    ],
    correct: 1,
    insight: 'A credit score is a number that shows how reliable you are at paying back debt. Higher scores can get you better rates.',
  },
  thirtyRule: {
    question: 'What is the 30% rule?',
    options: [
      'Spend 30% of your income on fun',
      'Try to spend no more than 30% of your income on housing',
      'Save 30% of every paycheck',
      'Invest 30% in stocks',
    ],
    correct: 1,
    insight: 'Keeping housing costs under 30% of your income leaves more room for savings and other needs.',
  },
  bankStatement: {
    question: 'Why should you check your bank statement?',
    options: [
      'Only to see your balance',
      'To spot mistakes, unknown charges, and track where your money goes',
      'To get rewards',
      'Banks require it',
    ],
    correct: 1,
    insight: 'Checking regularly helps you catch errors and subscriptions you forgot about.',
  },
};

export function QuickWinScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { id, type } = route.params;
  const [selected, setSelected] = useState<number | null>(null);
  const [showInsight, setShowInsight] = useState(false);

  const quiz = type === 'quiz' ? QUIZ_CONTENT[id] : null;

  const titles: Record<string, string> = {
    creditScore: 'What is a credit score?',
    thirtyRule: '30% rule explained',
    paymentReminder: 'Set a payment reminder',
    bankStatement: 'Read your bank statement',
  };
  const title = titles[id] ?? id;

  if (type === 'guide' && id === 'paymentReminder') {
    return (
      <View style={styles.container}>
        <View style={[styles.bg, { backgroundColor: '#F0F2F7' }]} />
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.guideIntro}>Quick steps to set a payment reminder:</Text>
          <View style={styles.guideStep}>
            <Text style={styles.guideStepNum}>1.</Text>
            <Text style={styles.guideStepText}>Open your phone’s Calendar or Reminders app.</Text>
          </View>
          <View style={styles.guideStep}>
            <Text style={styles.guideStepNum}>2.</Text>
            <Text style={styles.guideStepText}>Create a new reminder or event for your payment due date.</Text>
          </View>
          <View style={styles.guideStep}>
            <Text style={styles.guideStepNum}>3.</Text>
            <Text style={styles.guideStepText}>Set it to repeat every month so you never miss a due date.</Text>
          </View>
          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={styles.container}>
        <View style={[styles.bg, { backgroundColor: '#F0F2F7' }]} />
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Content coming soon.</Text>
        </View>
      </View>
    );
  }

  const handleOption = (index: number) => {
    setSelected(index);
    setShowInsight(true);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.bg, { backgroundColor: '#F0F2F7' }]} />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.quizQuestion}>{quiz.question}</Text>
        {quiz.options.map((opt, index) => (
          <Pressable
            key={index}
            style={[
              styles.quizOption,
              selected === index && styles.quizOptionSelected,
            ]}
            onPress={() => handleOption(index)}
          >
            <Text style={styles.quizOptionLetter}>
              {String.fromCharCode(65 + index)})
            </Text>
            <Text style={styles.quizOptionText}>{opt}</Text>
          </Pressable>
        ))}
        {showInsight && (
          <View style={styles.insightBox}>
            <Text style={styles.insightText}>{quiz.insight}</Text>
          </View>
        )}
        {showInsight && (
          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { ...StyleSheet.absoluteFillObject },
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
  scrollContent: { padding: 24 },
  quizQuestion: {
    fontSize: 18,
    fontWeight: '600',
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
  doneBtn: {
    backgroundColor: colors.accent.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  guideIntro: {
    fontSize: 17,
    color: '#0F172A',
    marginBottom: 20,
  },
  guideStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  guideStepNum: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent.primary,
    marginRight: 12,
  },
  guideStepText: { flex: 1, fontSize: 16, color: '#0F172A' },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { fontSize: 16, color: colors.text.muted },
});
