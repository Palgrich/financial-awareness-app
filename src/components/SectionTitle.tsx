import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SectionTitleProps {
  title: string;
  onPress?: () => void;
  actionLabel?: string;
  dark?: boolean;
}

export function SectionTitle({ title, onPress, actionLabel, dark }: SectionTitleProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.title, dark && styles.titleDark]}>{title}</Text>
      {actionLabel && onPress ? (
        <TouchableOpacity onPress={onPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.action, dark && styles.actionDark]}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0f172a',
  },
  titleDark: { color: '#f1f5f9' },
  action: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
  },
  actionDark: { color: '#60a5fa' },
});
