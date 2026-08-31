import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, PrimaryButton, SecondaryButton } from '../components';
import { useStore } from '../state/store';
import { useProgressStore } from '../state/progressStore';
import { useAchievementsStore } from '../state/achievementsStore';
import { practiceRouteFor } from '../domain/learn';
import type { LearnStackParamList } from '../navigation/types';

type Route = RouteProp<LearnStackParamList, 'LessonDetail'>;

export function LessonDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { lessonId, mode = 'lesson' } = route.params;
  const isReview = mode === 'review';

  const lessons = useStore((s) => s.lessons);
  const lessonProgress = useStore((s) => s.lessonProgress);
  const setLessonProgress = useStore((s) => s.setLessonProgress);
  const updateXP = useStore((s) => s.updateXP);
  const scheduleKnowledgeCheck = useStore((s) => s.scheduleKnowledgeCheck);
  const completeKnowledgeCheck = useStore((s) => s.completeKnowledgeCheck);
  const dark = useStore((s) => s.preferences.darkMode);
  const progressCompleteLesson = useProgressStore((s) => s.completeLesson);
  const progressTotalLessons = useProgressStore((s) => s.userData.financialAwareness.totalLessons);
  const recordQuiz = useAchievementsStore((s) => s.recordQuiz);
  const recordPractice = useAchievementsStore((s) => s.recordPractice);

  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [practiceDone, setPracticeDone] = useState(false);

  const lesson = lessons.find((l) => l.id === lessonId);
  const progress = lessonProgress[lessonId] ?? 'not_started';

  React.useEffect(() => {
    if (lesson && !isReview && progress === 'not_started') setLessonProgress(lessonId, 'in_progress');
  }, [lessonId, lesson, progress, isReview, setLessonProgress]);

  if (!lesson) {
    return (
      <SafeAreaView style={[styles.container, dark && styles.containerDark]}>
        <Text style={[styles.error, { color: dark ? '#94a3b8' : '#64748b' }]}>Lesson not found.</Text>
      </SafeAreaView>
    );
  }

  const hasQuiz = lesson.quiz && lesson.quiz.length > 0;
  const allQuizAnswered = hasQuiz ? lesson.quiz!.every((q) => quizAnswers[q.id] !== undefined) : true;
  const quizCorrect = hasQuiz && quizSubmitted
    ? lesson.quiz!.filter((q) => quizAnswers[q.id] === q.correctIndex).length
    : 0;
  const quizTotal = lesson.quiz?.length ?? 0;

  const submitQuiz = () => {
    setQuizSubmitted(true);
    const correct = lesson.quiz!.filter((q) => quizAnswers[q.id] === q.correctIndex).length;
    recordQuiz(correct, lesson.quiz!.length);
  };

  const openPractice = () => {
    if (!lesson.practice) return;
    setPracticeDone(true);
    recordPractice();
    const target = practiceRouteFor(lesson.practice.action);
    (navigation.getParent() as any)?.navigate(target);
  };

  const finishReview = () => {
    const passed = !hasQuiz || quizCorrect / quizTotal >= 0.6;
    completeKnowledgeCheck(lessonId, passed);
    navigation.goBack();
  };

  const markComplete = () => {
    setLessonProgress(lessonId, 'completed');
    updateXP(25, lessonId, lesson.durationMin);
    progressCompleteLesson(progressTotalLessons);
    scheduleKnowledgeCheck(lessonId);
    navigation.goBack();
  };

  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';

  return (
    <SafeAreaView style={[styles.container, dark && styles.containerDark]} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isReview ? (
          <View style={styles.reviewBanner}>
            <Text style={styles.reviewBannerText}>🔁 Knowledge check · {lesson.title}</Text>
          </View>
        ) : null}

        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>{lesson.title}</Text>
          <Text style={[styles.meta, { color: mutedColor }]}>
            {lesson.durationMin} min · {lesson.level}
          </Text>
          <Text style={[styles.summary, { color: mutedColor }]}>{lesson.summary}</Text>
        </View>

        {/* Theory is hidden in review mode — the check is quiz-only. */}
        {!isReview &&
          lesson.sections.map((sec, i) => (
            <View key={i} style={styles.section}>
              <Text style={[styles.sectionHeading, { color: textColor }]}>{sec.heading}</Text>
              {sec.bullets.map((b, j) => (
                <Text key={j} style={[styles.bullet, { color: mutedColor }]}>• {b}</Text>
              ))}
            </View>
          ))}

        {!isReview ? (
          <Card dark={dark} style={styles.takeaways}>
            <Text style={[styles.takeawaysTitle, { color: textColor }]}>Key takeaways</Text>
            <Text style={[styles.takeawaysText, { color: mutedColor }]}>
              {lesson.sections.map((s) => s.heading).join(' · ')}
            </Text>
          </Card>
        ) : null}

        {hasQuiz && (
          <View style={styles.quiz}>
            <Text style={[styles.quizTitle, { color: textColor }]}>{isReview ? 'Quick check' : 'Quick quiz'}</Text>
            {lesson.quiz!.map((q) => (
              <View key={q.id} style={styles.quizQuestion}>
                <Text style={[styles.quizQ, { color: textColor }]}>{q.question}</Text>
                {q.options.map((opt, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.quizOpt,
                      quizAnswers[q.id] === idx && styles.quizOptSelected,
                      quizSubmitted && idx === q.correctIndex && styles.quizOptCorrect,
                    ]}
                    onPress={() => !quizSubmitted && setQuizAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                  >
                    <Text style={[styles.quizOptText, { color: quizSubmitted && idx === q.correctIndex ? '#fff' : textColor }]} numberOfLines={2}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            {!quizSubmitted ? (
              <PrimaryButton
                title="Submit answers"
                onPress={submitQuiz}
                disabled={!allQuizAnswered}
              />
            ) : (
              <Text style={[styles.quizScore, { color: mutedColor }]}>
                You got {quizCorrect} of {quizTotal} correct.
              </Text>
            )}
          </View>
        )}

        {/* Practice step — a real financial action (skipped in review mode). */}
        {!isReview && lesson.practice ? (
          <View style={[styles.practice, { borderColor: practiceDone ? '#22C55E' : '#5B4FE8' }]}>
            <Text style={styles.practiceLabel}>PRACTICE</Text>
            <Text style={[styles.practiceTitle, { color: textColor }]}>{lesson.practice.title}</Text>
            <Text style={[styles.practiceDesc, { color: mutedColor }]}>{lesson.practice.description}</Text>
            {practiceDone ? (
              <Text style={styles.practiceDoneText}>✓ Nice — practice started</Text>
            ) : (
              <SecondaryButton title={lesson.practice.cta} onPress={openPractice} />
            )}
          </View>
        ) : null}

        {isReview ? (
          <PrimaryButton title="Finish review" onPress={finishReview} disabled={hasQuiz && !quizSubmitted} />
        ) : (
          <PrimaryButton title={progress === 'completed' ? 'Done' : 'Mark complete'} onPress={markComplete} />
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  containerDark: { backgroundColor: '#0f172a' },
  scroll: { flex: 1 },
  content: { padding: 16 },
  reviewBanner: {
    backgroundColor: 'rgba(91,79,232,0.12)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  reviewBannerText: { fontSize: 13, fontWeight: '600', color: '#5B4FE8' },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '600' },
  meta: { fontSize: 14, marginTop: 4 },
  summary: { fontSize: 15, marginTop: 8 },
  section: { marginBottom: 20 },
  sectionHeading: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  bullet: { fontSize: 15, marginLeft: 8, marginBottom: 4 },
  takeaways: { marginBottom: 24 },
  takeawaysTitle: { fontSize: 16, fontWeight: '600' },
  takeawaysText: { fontSize: 14, marginTop: 4 },
  quiz: { marginBottom: 24 },
  quizTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  quizQuestion: { marginBottom: 16 },
  quizQ: { fontSize: 15, marginBottom: 8 },
  quizOpt: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 6 },
  quizOptSelected: { borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.1)' },
  quizOptCorrect: { borderColor: '#16a34a', backgroundColor: '#16a34a' },
  quizOptText: { fontSize: 15 },
  quizScore: { marginTop: 12, fontSize: 15 },
  practice: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  practiceLabel: { fontSize: 11, fontWeight: '700', color: '#5B4FE8', letterSpacing: 1, marginBottom: 6 },
  practiceTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  practiceDesc: { fontSize: 14, marginBottom: 14, lineHeight: 20 },
  practiceDoneText: { fontSize: 14, fontWeight: '600', color: '#22C55E' },
  error: { padding: 16 },
});
