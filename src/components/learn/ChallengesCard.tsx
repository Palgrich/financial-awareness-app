import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/tokens';
import { GlassCardContainer } from '../GlassCardContainer';
import { IllustrationBackgroundLayer } from '../IllustrationBackgroundLayer';
import { StatusBadge } from '../StatusBadge';

const ILLUSTRATION_OPACITY = 0.14;

export type ChallengeStatusDisplay = 'todo' | 'in_progress' | 'done';

export interface ChallengeRow {
  id: string;
  title: string;
  status: ChallengeStatusDisplay;
}

function statusToLabel(s: ChallengeStatusDisplay): string {
  if (s === 'done') return 'Done';
  if (s === 'in_progress') return 'In progress';
  return 'To do';
}

function statusToStatusColor(s: ChallengeStatusDisplay): string {
  if (s === 'done') return colors.status.good;
  if (s === 'in_progress') return colors.status.moderate;
  return colors.text.muted;
}

export interface ChallengesCardProps {
  challenges: ChallengeRow[];
  onChallengePress: (challengeId: string) => void;
}

export function ChallengesCard({
  challenges,
  onChallengePress,
}: ChallengesCardProps) {
  const content = (
    <>
      <IllustrationBackgroundLayer
        emoji="🏁"
        variant="card"
        glowColor={colors.glow.cash}
        opacityOverride={ILLUSTRATION_OPACITY}
      />
      <View style={styles.content}>
        <Text style={styles.cardTitle}>Challenges</Text>
        {challenges.map((challenge, index) => (
          <Pressable
            key={challenge.id}
            style={({ pressed }) => [
              styles.row,
              index > 0 && styles.rowBorder,
              pressed && styles.rowPressed,
            ]}
            onPress={() => onChallengePress(challenge.id)}
          >
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{challenge.title}</Text>
              <Text style={styles.rowSub}>{statusToLabel(challenge.status)}</Text>
            </View>
            <View style={styles.rowRight}>
              <StatusBadge
                label={statusToLabel(challenge.status)}
                statusColor={statusToStatusColor(challenge.status)}
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
      <GlassCardContainer gradientKey="cash">{content}</GlassCardContainer>
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
