import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/tokens';
import { GlassCardContainer } from '../GlassCardContainer';
import { IllustrationBackgroundLayer } from '../IllustrationBackgroundLayer';

const ILLUSTRATION_OPACITY = 0.22;

export interface PathRow {
  id: string;
  title: string;
  lessonCount: number;
}

export interface LearningPathsCardProps {
  paths: PathRow[];
  onPathPress: (pathId: string) => void;
}

export function LearningPathsCard({ paths, onPathPress }: LearningPathsCardProps) {
  const content = (
    <>
      <IllustrationBackgroundLayer
        emoji="🗺️"
        variant="card"
        glowColor={colors.glow.awareness}
        opacityOverride={ILLUSTRATION_OPACITY}
      />
      <View style={styles.content}>
        <Text style={styles.cardTitle}>Learning paths</Text>
        {paths.map((path, index) => (
          <Pressable
            key={path.id}
            style={({ pressed }) => [
              styles.row,
              index > 0 && styles.rowBorder,
              pressed && styles.rowPressed,
            ]}
            onPress={() => onPathPress(path.id)}
          >
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{path.title}</Text>
              <Text style={styles.rowSub}>
                {path.lessonCount} lesson{path.lessonCount !== 1 ? 's' : ''}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.text.muted} />
          </Pressable>
        ))}
      </View>
    </>
  );

  return (
    <View style={styles.wrapper}>
      <GlassCardContainer gradientKey="awareness">
        {content}
      </GlassCardContainer>
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
  rowLeft: { flex: 1 },
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
});
