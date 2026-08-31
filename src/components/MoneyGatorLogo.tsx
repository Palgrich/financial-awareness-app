import React from 'react';
import { View, Text, StyleSheet, Platform, TextStyle } from 'react-native';

/**
 * MoneyGator header wordmark.
 *
 * Renders "🐊 MoneyGator" — the alligator emoji followed by the brand name in
 * white, Inter 800 (Inter_800ExtraBold), size 20 (per brand spec).
 *
 * The Inter typeface is loaded at app startup in App.tsx via
 * `@expo-google-fonts/inter` (useFonts), so `fontFamily: 'Inter_800ExtraBold'`
 * renders the exact weight. `fontWeight: '800'` is kept as a fallback for
 * platforms/states where the font has not finished loading.
 */
interface MoneyGatorLogoProps {
  /** Font size of the wordmark. Defaults to 20 (header size). */
  size?: number;
  /** Text color. Defaults to white. */
  color?: string;
  style?: TextStyle;
}

export function MoneyGatorLogo({ size = 20, color = '#FFFFFF', style }: MoneyGatorLogoProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.emoji, { fontSize: size }]} accessibilityElementsHidden>
        🐊
      </Text>
      <Text
        style={[styles.text, { fontSize: size, color }, style]}
        accessibilityLabel="MoneyGator"
      >
        MoneyGator
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    marginRight: 6,
  },
  text: {
    fontFamily: 'Inter_800ExtraBold',
    fontWeight: '800',
    letterSpacing: -0.2,
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
});
