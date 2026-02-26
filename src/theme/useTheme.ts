import { useMemo } from 'react';
import { useStore } from '../state/store';
import { colors } from './tokens';
import { gradientColors } from './tokens';

export const lightColors = {
  background: colors.background.primaryStart,
  backgroundGradient: gradientColors.background,
  cardBackground: '#FFFFFF',
  textPrimary: colors.text.primary,
  textMuted: colors.text.muted,
  borderColor: 'rgba(15, 23, 42, 0.12)',
} as const;

export const darkColors = {
  background: '#0F172A',
  backgroundGradient: ['#0F172A', '#0F172A'] as [string, string],
  cardBackground: '#1E293B',
  textPrimary: '#F8FAFC',
  textMuted: '#94A3B8',
  borderColor: 'rgba(255, 255, 255, 0.1)',
} as const;

export type ThemeColors = typeof lightColors;

export function useTheme(): { isDark: boolean; colors: ThemeColors } {
  const darkMode = useStore((s) => s.preferences.darkMode);
  return useMemo(
    () => ({
      isDark: darkMode,
      colors: darkMode ? darkColors : lightColors,
    }),
    [darkMode]
  );
}
