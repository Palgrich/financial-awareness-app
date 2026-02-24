import React, { ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, gradientColors, overlayColors } from '../theme/tokens';
import type { CardType } from '../theme/tokens';

export interface GlassCardContainerProps {
  children: ReactNode;
  /** Gradient key: 'hero' | card type */
  gradientKey: 'hero' | CardType;
  variant?: 'default' | 'hero';
  onPress?: () => void;
}

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 40,
  },
  android: { elevation: 4 },
});

const heroShadow = Platform.select({
  ios: {
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 40,
  },
  android: { elevation: 6 },
});

export function GlassCardContainer({
  children,
  gradientKey,
  variant = 'default',
  onPress,
}: GlassCardContainerProps) {
  const isHero = variant === 'hero';
  const gradient = gradientKey === 'hero' ? gradientColors.hero : gradientColors[gradientKey];
  const overlayColor = overlayColors[gradientKey];

  const content = (
    <>
      {/* Glass surface highlight */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isHero ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)',
          },
        ]}
        pointerEvents="none"
      />
      {/* Overlay gradient (transparent → overlay color), behind content */}
      <LinearGradient
        colors={['transparent', overlayColor] as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, styles.overlay]}
        pointerEvents="none"
      />
      {children}
    </>
  );

  const cardStyle = [styles.card, isHero ? heroShadow : cardShadow];

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.98} onPress={onPress} style={cardStyle}>
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        {content}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  gradient: {
    padding: 24,
    minHeight: 1,
  },
  overlay: {
    borderRadius: 28,
  },
});
