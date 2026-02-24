import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, PrimaryButton } from '../components';
import { useStore } from '../state/store';
import type { LessonProgress } from '../state/store';
import { useProgressStore } from '../state/progressStore';
import type { LearnStackParamList } from '../navigation/types';

type Route = RouteProp<LearnStackParamList, 'LessonDetail'>;

export function LessonDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { lessonId } = route.params;
  const lessons = useStore((s) => s.lessons);
  const lessonProgress = useStore((s) => s.lessonProgress);
  const setLessonProgress = useStore((s) => s.setLessonProgress);
  const updateXP = useStore((s) => s.updateXP);
  const dark = useStore((s) => s.preferences.darkMode);
  const progressCompleteLesson = useProgressStore((s) => s.completeLesson);
  const progressTotalLessons = useProgressStore((s) => s.userData.financialAwareness.totalLessons);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const lesson = lessons.find((l) => l.id === lessonId);
  const progress = lessonProgress[lessonId] ?? 'not_started';

  React.useEffect(() => {
    if (lesson && progress === 'not_started') setLessonProgress(lessonId, 'in_progress');
  }, [lessonId, lesson, progress, setLessonProgress]);

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
    ? lesson.quiz!.filter((q, i) => quizAnswers[q.id] === q.correctIndex).length
    : 0;
  const quizTotal = lesson.quiz?.length ?? 0;

  const markComplete = () => {
    setLessonProgress(lessonId, 'completed');
    updateXP(25, lessonId, lesson.durationMin);
    progressCompleteLesson(progressTotalLessons);
    navigation.goBack();
  };

  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';

  return (
    <SafeAreaView style={[styles.container, dark && styles.containerDark]} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>{lesson.title}</Text>
          <Text style={[styles.meta, { color: mutedColor }]}>
            {lesson.durationMin} min · {lesson.level}
          </Text>
          <Text style={[styles.summary, { color: mutedColor }]}>{lesson.summary}</Text>
        </View>

        {lesson.sections.map((sec, i) => (
          <View key={i} style={styles.section}>
            <Text style={[styles.sectionHeading, { color: textColor }]}>{sec.heading}</Text>
            {sec.bullets.map((b, j) => (
              <Text key={j} style={[styles.bullet, { color: mutedColor }]}>• {b}</Text>
            ))}
          </View>
        ))}

        <Card dark={dark} style={styles.takeaways}>
          <Text style={[styles.takeawaysTitle, { color: textColor }]}>Key takeaways</Text>
          <Text style={[styles.takeawaysText, { color: mutedColor }]}>
            {lesson.sections.map((s) => s.heading).join(' · ')}
          </Text>
        </Card>

        {hasQuiz && (
          <View style={styles.quiz}>
            <Text style={[styles.quizTitle, { color: textColor }]}>Quick quiz</Text>
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
                onPress={() => setQuizSubmitted(true)}
                disabled={!allQuizAnswered}
              />
            ) : (
              <Text style={[styles.quizScore, { color: mutedColor }]}>
                You got {quizCorrect} of {quizTotal} correct.
              </Text>
            )}
          </View>
        )}

        <PrimaryButton title={progress === 'completed' ? 'Done' : 'Mark complete'} onPress={markComplete} />
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
  error: { padding: 16 },
});
