import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../../theme/tokens';
import type { LearnUserData } from '../../data/learnUserData';

export type MissionVariant = 'subscription' | 'creditDue' | 'cashControl';

export interface TodaysMissionCardProps {
  data: LearnUserData;
  onCancelGuide?: (serviceName: string) => void;
  onIUseIt?: (serviceName: string) => void;
  onPayNow?: () => void;
}

function getMissionFromData(data: LearnUserData): {
  variant: MissionVariant;
  borderColor: string;
  tag: string;
  title: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
  serviceName?: string;
} {
  // Priority 1: Credit card due soon
  if (data.creditCardDue && data.creditCardDue.daysUntilDue <= 3) {
    return {
      variant: 'creditDue',
      borderColor: colors.status.high,
      tag: 'Urgent for you',
      title: `Payment due in ${data.creditCardDue.daysUntilDue} days`,
      subtitle: `$${data.creditCardDue.minimumDue.toFixed(2)} minimum · ${data.creditCardDue.cardName}`,
      primaryCta: 'Pay Now →',
    };
  }
  // Priority 2: Subscription load high — pick one unused
  if (data.subscriptionLoad === 'High' && data.subscriptions.length > 0) {
    const unused = data.subscriptions.find((s) =>
      s.lastUsed.includes('31') || s.lastUsed.includes('45') || s.lastUsed.includes('60')
    );
    const service = unused ?? data.subscriptions[0];
    return {
      variant: 'subscription',
      borderColor: colors.status.moderate,
      tag: "Today's Move",
      serviceName: service.name,
      title: `You haven't used ${service.name} in ${service.lastUsed}`,
      subtitle: `$${service.price.toFixed(2)}/month`,
      primaryCta: 'How to cancel →',
      secondaryCta: 'I use it',
    };
  }
  // Priority 3: Cash control moderate
  return {
    variant: 'cashControl',
    borderColor: '#3B82F6',
    tag: "Today's Move",
    title: 'Your spending is a bit higher than usual',
    subtitle: 'Small tweaks can free up cash without big sacrifices.',
    primaryCta: 'See quick wins →',
  };
}

export function TodaysMissionCard({
  data,
  onCancelGuide,
  onIUseIt,
  onPayNow,
}: TodaysMissionCardProps) {
  const mission = getMissionFromData(data);

  return (
    <View style={[styles.card, { borderLeftColor: mission.borderColor }]}>
      <View style={styles.tagRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{mission.tag}</Text>
        </View>
      </View>
      <Text style={styles.title}>{mission.title}</Text>
      {mission.subtitle ? (
        <Text style={styles.subtitle}>{mission.subtitle}</Text>
      ) : null}
      <View style={styles.actions}>
        {mission.primaryCta && (
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              mission.variant === 'creditDue' && styles.primaryBtnUrgent,
            ]}
            onPress={() => {
              if (mission.variant === 'creditDue') onPayNow?.();
              else if (mission.variant === 'subscription' && mission.serviceName)
                onCancelGuide?.(mission.serviceName);
              else return; // cashControl could navigate to Quick Wins
            }}
          >
            <Text
              style={[
                styles.primaryBtnText,
                mission.variant === 'creditDue' && styles.primaryBtnTextUrgent,
              ]}
            >
              {mission.primaryCta}
            </Text>
          </TouchableOpacity>
        )}
        {mission.secondaryCta && mission.serviceName && (
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => onIUseIt?.(mission.serviceName!)}
          >
            <Text style={styles.secondaryBtnText}>{mission.secondaryCta}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderLeftWidth: 5,
    ...(Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }) as object),
  },
  tagRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 },
  tag: {
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.muted,
    marginBottom: 16,
  },
  actions: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  primaryBtn: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  primaryBtnUrgent: { backgroundColor: colors.status.high },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  primaryBtnTextUrgent: { color: '#FFFFFF' },
  secondaryBtn: {
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
});
