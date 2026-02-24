import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { illustration } from '../theme/tokens';

export interface IllustrationBackgroundLayerProps {
  emoji: string;
  variant?: 'hero' | 'card';
  glowColor: string;
  /** Override opacity for subtler integration (e.g. 0.2 for Learn cards). */
  opacityOverride?: number;
}

const heroSize = 200;
const cardSize = 170;

export function IllustrationBackgroundLayer({
  emoji,
  variant = 'card',
  glowColor,
  opacityOverride,
}: IllustrationBackgroundLayerProps) {
  const isHero = variant === 'hero';
  const size = isHero ? heroSize : cardSize;
  const opacity =
    opacityOverride ?? (isHero ? illustration.opacity.hero : illustration.opacity.card);
  const top = isHero ? -30 : -25;
  const right = isHero ? -40 : -35;

  return (
    <>
      {/* Ambient glow (simplified: colored circle with opacity; RN has no blur for views) */}
      <View
        style={[
          styles.glow,
          {
            top: top - 20,
            right: right - 20,
            width: isHero ? 250 : 180,
            height: isHero ? 250 : 180,
            backgroundColor: glowColor,
            opacity: 0.25,
          },
        ]}
      />
      <View
        style={[
          styles.illustration,
          {
            top,
            right,
            opacity,
          },
        ]}
      >
        <Text style={[styles.emoji, { fontSize: size }]}>{emoji}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    borderRadius: 9999,
    pointerEvents: 'none',
  },
  illustration: {
    position: 'absolute',
    pointerEvents: 'none',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    lineHeight: 1,
  },
});
