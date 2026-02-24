import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { colors, illustrations, type CardType, type StatusType } from '../theme/tokens';
import { GlassCardContainer } from './GlassCardContainer';
import { IllustrationBackgroundLayer } from './IllustrationBackgroundLayer';
import { StatusBadge } from './StatusBadge';
import { SegmentProgressBar } from './SegmentProgressBar';

const glowByType: Record<CardType, string> = {
  awareness: colors.glow.awareness,
  spending: colors.glow.spending,
  subscription: colors.glow.subscription,
  cash: colors.glow.cash,
  credit: colors.glow.credit,
};

const statusColorMap: Record<StatusType, string> = {
  good: colors.status.good,
  moderate: colors.status.moderate,
  high: colors.status.high,
  strong: colors.status.strong,
};

const statusLabelMap: Record<StatusType, string> = {
  good: 'Good',
  moderate: 'Moderate',
  high: 'High',
  strong: 'Strong',
};

const illustrationByVariant: Record<CardType, string> = {
  awareness: illustrations.awareness,
  spending: illustrations.spending,
  subscription: illustrations.subscription,
  cash: illustrations.cash,
  credit: illustrations.credit,
};

export interface MetricCardProps {
  title: string;
  value: string;
  status: StatusType;
  description?: string;
  filledSegments: number;
  onPress?: () => void;
  variant?: CardType;
  actionLabel?: string;
  /** Financial Awareness: level subtitle under title */
  levelSubtitle?: string;
  /** Financial Awareness: next lesson row (replaces actionLabel when set) */
  nextLessonTitle?: string;
  nextLessonMeta?: string;
  onNextLessonPress?: () => void;
  /** Subscription: small text below value e.g. "That's $3,442 / year" */
  yearlyText?: string;
  /** Subscription: two actions */
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  /** Credit: urgency banner when payment due soon */
  urgencyBanner?: {
    text: string;
    /** e.g. "$47.00 minimum due" */
    secondLine?: string;
    onPayNow: () => void;
  };
  /** Credit: due date line below value */
  dueDateText?: string;
  /** Credit: last 6 months on-time (true = green dot, false = red) */
  paymentHistory?: boolean[];
}

export function MetricCard({
  title,
  value,
  status,
  description,
  filledSegments,
  onPress,
  variant = 'awareness',
  actionLabel,
  levelSubtitle,
  nextLessonTitle,
  nextLessonMeta,
  onNextLessonPress,
  yearlyText,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  urgencyBanner,
  dueDateText,
  paymentHistory,
}: MetricCardProps) {
  const statusColor = statusColorMap[status];
  const cardType: CardType = variant;
  const illustration = illustrationByVariant[cardType];
  const glowColor = glowByType[cardType];
  const hasTwoActions =
    primaryActionLabel != null && secondaryActionLabel != null;

  const content = (
    <>
      <IllustrationBackgroundLayer
        emoji={illustration}
        variant="card"
        glowColor={glowColor}
      />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleWrap}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            {levelSubtitle ? (
              <Text style={styles.levelSubtitle}>{levelSubtitle}</Text>
            ) : null}
          </View>
          <StatusBadge label={statusLabelMap[status]} statusColor={statusColor} />
        </View>
        {description && !urgencyBanner ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
        {urgencyBanner ? (
          <View style={styles.urgencyBanner}>
            <Text style={styles.urgencyText}>🔴 {urgencyBanner.text}</Text>
            {urgencyBanner.secondLine ? (
              <Text style={styles.urgencySecondLine}>{urgencyBanner.secondLine}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.payNowBtn}
              onPress={urgencyBanner.onPayNow}
            >
              <Text style={styles.payNowBtnText}>Pay Now →</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {urgencyBanner ? (
          <Text style={styles.lastStatementRow}>
            <Text style={styles.lastStatementLabel}>Last statement balance: </Text>
            <Text style={styles.lastStatementValue}>{value}</Text>
          </Text>
        ) : (
          <Text style={styles.value}>{value}</Text>
        )}
        {yearlyText ? (
          <Text style={styles.yearlyText}>{yearlyText}</Text>
        ) : null}
        {dueDateText && !urgencyBanner ? (
          <Text style={styles.dueDateText}>{dueDateText}</Text>
        ) : null}
        {paymentHistory && paymentHistory.length > 0 ? (
          <View style={styles.dotsRow}>
            {paymentHistory.slice(0, 6).map((onTime, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  onTime ? styles.dotOnTime : styles.dotLate,
                ]}
              />
            ))}
            <Text style={styles.dotsLabel}>
              {paymentHistory.filter(Boolean).length} months on time · Keep it up!
            </Text>
          </View>
        ) : null}
        {!(paymentHistory && paymentHistory.length > 0) ? (
          <View style={styles.progressRow}>
            <SegmentProgressBar
              filled={filledSegments}
              totalSegments={5}
              variant="default"
              color={statusColor}
            />
          </View>
        ) : null}
        {nextLessonTitle && onNextLessonPress ? (
          <TouchableOpacity
            style={styles.nextLessonRow}
            onPress={onNextLessonPress}
            activeOpacity={0.7}
          >
            <Text style={styles.nextLessonIcon}>▶</Text>
            <Text style={styles.nextLessonTitle} numberOfLines={1}>
              {nextLessonTitle}
            </Text>
            {nextLessonMeta ? (
              <Text style={styles.nextLessonMeta}> · {nextLessonMeta}</Text>
            ) : null}
            <Text style={styles.nextLessonArrow}> →</Text>
          </TouchableOpacity>
        ) : hasTwoActions ? (
          <View style={styles.twoActionsRow}>
            <TouchableOpacity
              onPress={onSecondaryAction}
              style={styles.secondaryActionBtn}
            >
              <Text style={styles.secondaryActionText}>
                {secondaryActionLabel}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPrimaryAction}
              style={styles.primaryActionBtn}
            >
              <Text style={styles.primaryActionText}>{primaryActionLabel} →</Text>
            </TouchableOpacity>
          </View>
        ) : actionLabel ? (
          <View style={styles.ctaRow}>
            <Text style={styles.ctaText}>{actionLabel} →</Text>
          </View>
        ) : null}
      </View>
    </>
  );

  const wrapperStyle = styles.wrapper;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          wrapperStyle,
          pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] },
        ]}
      >
        <GlassCardContainer gradientKey={cardType}>
          {content}
        </GlassCardContainer>
      </Pressable>
    );
  }

  return (
    <View style={wrapperStyle}>
      <GlassCardContainer gradientKey={cardType}>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleWrap: { flex: 1, paddingRight: 16 },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  levelSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '400',
    marginBottom: 6,
  },
  value: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  yearlyText: {
    fontSize: 13,
    color: colors.text.muted,
    marginBottom: 12,
  },
  dueDateText: {
    fontSize: 13,
    color: colors.text.muted,
    marginBottom: 8,
  },
  urgencyBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  urgencyText: { fontSize: 14, color: '#0F172A' },
  urgencySecondLine: {
    fontSize: 14,
    color: '#0F172A',
    marginTop: 4,
    marginBottom: 8,
  },
  lastStatementRow: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },
  lastStatementLabel: {
    color: '#888',
  },
  lastStatementValue: {
    color: '#0F172A',
    fontWeight: '500',
  },
  payNowBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.status.high,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  payNowBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotOnTime: { backgroundColor: colors.status.good },
  dotLate: { backgroundColor: colors.status.high, opacity: 0.5 },
  dotsLabel: { fontSize: 12, color: colors.text.muted },
  progressRow: {
    marginBottom: 16,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  ctaText: {
    fontSize: 16,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  nextLessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  nextLessonIcon: { fontSize: 12, color: colors.accent.primary, marginRight: 4 },
  nextLessonTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent.primary,
  },
  nextLessonMeta: { fontSize: 13, color: colors.text.muted },
  nextLessonArrow: { fontSize: 15, color: colors.accent.primary, fontWeight: '600' },
  twoActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryActionBtn: {},
  secondaryActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent.primary,
  },
  primaryActionBtn: {
    backgroundColor: colors.accent.secondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  primaryActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
