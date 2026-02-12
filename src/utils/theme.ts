/**
 * 8pt grid spacing system
 * Use multiples of 8 for padding, margins, gaps
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/**
 * Typography scale (readable, institutional)
 */
export const typography = {
  title: { fontSize: 24, fontWeight: '600' as const },
  titleSmall: { fontSize: 20, fontWeight: '600' as const },
  subtitle: { fontSize: 18, fontWeight: '500' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodySmall: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  label: { fontSize: 14, fontWeight: '500' as const },
  button: { fontSize: 16, fontWeight: '600' as const },
} as const;

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  full: 9999,
} as const;
