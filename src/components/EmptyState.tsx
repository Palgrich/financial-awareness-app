import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: React.ReactNode;
  dark?: boolean;
}

export function EmptyState({ title, message, action, dark }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, dark && styles.titleDark]}>{title}</Text>
      {message ? <Text style={[styles.message, dark && styles.messageDark]}>{message}</Text> : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
  },
  titleDark: { color: '#f1f5f9' },
  message: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 24,
  },
  messageDark: { color: '#94a3b8' },
  action: {
    marginTop: 20,
  },
});
