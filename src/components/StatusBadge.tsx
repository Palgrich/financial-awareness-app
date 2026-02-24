import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens, colors, type StatusType } from '../theme/tokens';

const BG: Record<StatusType, string> = {
  good: tokens.colors.badgeGoodBg,
  strong: tokens.colors.badgeGoodBg,
  moderate: tokens.colors.badgeModerateBg,
  high: tokens.colors.badgeHighBg,
};

const TEXT: Record<StatusType, string> = {
  good: tokens.colors.statusGood,
  strong: tokens.colors.statusGood,
  moderate: tokens.colors.statusModerate,
  high: tokens.colors.statusHigh,
};

function statusColorToBg(hex: string): string {
  if (hex === colors.status.good || hex === colors.status.strong) return tokens.colors.badgeGoodBg;
  if (hex === colors.status.moderate) return tokens.colors.badgeModerateBg;
  if (hex === colors.status.high) return tokens.colors.badgeHighBg;
  if (hex === colors.text.muted) return 'rgba(100, 116, 139, 0.15)';
  return tokens.colors.badgeGoodBg;
}

export interface StatusBadgeProps {
  /** Display text (e.g. "Good", "Moderate") */
  label: string;
  /** Token-based status for default variant */
  status?: StatusType;
  /** Figma-style: explicit color for text (and bg when variant default) */
  statusColor?: string;
  /** hero = white-border pill on hero card */
  variant?: 'default' | 'hero';
}

export function StatusBadge({ label, status = 'good', statusColor, variant = 'default' }: StatusBadgeProps) {
  const isHero = variant === 'hero';
  const backgroundColor = isHero ? tokens.colors.badgeHeroGoodBg : (statusColor ? statusColorToBg(statusColor) : BG[status]);
  const textColor = statusColor ?? TEXT[status];
  const borderWidth = isHero ? 1 : 0;
  const borderColor = isHero ? colors.badge.border : 'transparent';

  return (
    <View style={[styles.badge, { backgroundColor, borderWidth, borderColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: tokens.radius.badge,
  },
  text: {
    fontWeight: '600',
    fontSize: 13,
  },
});
