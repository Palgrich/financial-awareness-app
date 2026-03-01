import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/tokens';
import { GlassCardContainer } from './GlassCardContainer';
import type { WeatherResult } from '../utils/financialWeather';

export interface FinancialWeatherCardProps {
  weather: WeatherResult;
  onPress?: () => void;
  onActionPress?: (actionId: string, index: number) => void;
  onSeeAll?: () => void;
}

export function FinancialWeatherCard({
  weather,
  onPress,
  onActionPress,
  onSeeAll,
}: FinancialWeatherCardProps) {
  const hasActions = weather.actions.length > 0;
  const primaryAction = hasActions ? weather.actions[0] : null;
  const hasMore = weather.actions.length > 1;
  const actionCount = weather.actions.length;

  const content = (
    <View style={styles.content}>
      <Text style={styles.emoji}>{weather.emoji}</Text>
      <Text style={styles.label}>{weather.label}</Text>
      <Text style={styles.description} numberOfLines={3}>
        {weather.description}
      </Text>
      {primaryAction ? (
        <>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>What to do now:</Text>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => onActionPress?.(primaryAction.id, 0)}
            activeOpacity={0.7}
          >
            <View style={styles.actionTextWrap}>
              <Text style={styles.actionText} numberOfLines={3}>
                {primaryAction.urgency === 'high'
                  ? '🔴 '
                  : primaryAction.urgency === 'medium'
                    ? '🟡 '
                    : ''}
                {primaryAction.text}
              </Text>
              <Text style={styles.actionCta}>
                {primaryAction.cta} →
              </Text>
            </View>
          </TouchableOpacity>
          {hasMore ? (
            <TouchableOpacity
              style={styles.seeAllRow}
              onPress={onSeeAll}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllText}>See all {actionCount} actions →</Text>
            </TouchableOpacity>
          ) : null}
        </>
      ) : null}
    </View>
  );

  return (
    <GlassCardContainer gradientKey="hero" variant="hero" onPress={onPress}>
      {content}
    </GlassCardContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    position: 'relative',
    zIndex: 10,
  },
  emoji: {
    fontSize: 64,
    lineHeight: 72,
    marginBottom: 6,
  },
  label: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.white,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.text.whiteSecondary,
    fontWeight: '400',
    maxWidth: '85%',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.whiteSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionRow: {
    paddingVertical: 5,
    paddingRight: 4,
  },
  actionTextWrap: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  actionText: {
    fontSize: 14,
    color: colors.text.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  actionCta: {
    fontSize: 13,
    color: '#F59E0B',
    fontWeight: '600',
  },
  seeAllRow: {
    marginTop: 5,
    alignItems: 'flex-end',
  },
  seeAllText: {
    fontSize: 13,
    color: colors.text.whiteSecondary,
  },
});
