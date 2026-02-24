import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/tokens';
import { GlassCardContainer } from '../GlassCardContainer';
import { IllustrationBackgroundLayer } from '../IllustrationBackgroundLayer';
import { StatusBadge } from '../StatusBadge';

const ILLUSTRATION_OPACITY = 0.22;

export type LessonProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface LessonRow {
  id: string;
  title: string;
  durationMin: number;
  progress: LessonProgressStatus;
}

function progressToLabel(p: LessonProgressStatus): string {
  if (p === 'completed') return 'Done';
  if (p === 'in_progress') return 'In progress';
  return 'Not started';
}

function progressToStatusColor(p: LessonProgressStatus): string {
  if (p === 'completed') return colors.status.good;
  if (p === 'in_progress') return colors.status.moderate;
  return colors.text.muted;
}

export interface LessonsCardProps {
  lessons: LessonRow[];
  onLessonPress: (lessonId: string) => void;
}

export function LessonsCard({ lessons, onLessonPress }: LessonsCardProps) {
  const content = (
    <>
      <IllustrationBackgroundLayer
        emoji="📘"
        variant="card"
        glowColor={colors.glow.credit}
        opacityOverride={ILLUSTRATION_OPACITY}
      />
      <View style={styles.content}>
        <Text style={styles.cardTitle}>Lessons</Text>
        {lessons.map((lesson, index) => (
          <Pressable
            key={lesson.id}
            style={({ pressed }) => [
              styles.row,
              index > 0 && styles.rowBorder,
              pressed && styles.rowPressed,
            ]}
            onPress={() => onLessonPress(lesson.id)}
          >
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{lesson.title}</Text>
              <Text style={styles.rowSub}>
                {lesson.durationMin} min · {progressToLabel(lesson.progress)}
              </Text>
            </View>
            <View style={styles.rowRight}>
              <StatusBadge
                label={progressToLabel(lesson.progress)}
                statusColor={progressToStatusColor(lesson.progress)}
              />
              <ChevronRight
                size={20}
                color={colors.text.muted}
                style={styles.chevron}
              />
            </View>
          </Pressable>
        ))}
      </View>
    </>
  );

  return (
    <View style={styles.wrapper}>
      <GlassCardContainer gradientKey="credit">{content}</GlassCardContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 28,
    overflow: 'hidden' as const,
  },
  content: {
    position: 'relative' as const,
    zIndex: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(15, 23, 42, 0.06)',
  },
  rowPressed: {
    opacity: 0.7,
  },
  rowLeft: { flex: 1, paddingRight: 12 },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  rowSub: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chevron: { marginLeft: 4 },
});
