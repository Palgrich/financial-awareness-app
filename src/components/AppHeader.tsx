import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
}

export function AppHeader({ title, subtitle, right, style }: AppHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 8,
  },
  left: { flex: 1 },
  right: {},
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
});

export function AppHeaderDark({ title, subtitle, right, style }: AppHeaderProps) {
  return (
    <View style={[stylesDark.container, style]}>
      <View style={stylesDark.left}>
        <Text style={stylesDark.title}>{title}</Text>
        {subtitle ? <Text style={stylesDark.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={stylesDark.right}>{right}</View> : null}
    </View>
  );
}

const stylesDark = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 8,
  },
  left: { flex: 1 },
  right: {},
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 2,
  },
});
