import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface FloatingAIButtonProps {
  onPress: () => void;
  dark?: boolean;
  style?: ViewStyle;
}

export function FloatingAIButton({ onPress, dark, style }: FloatingAIButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.fab,
        { backgroundColor: dark ? '#1e293b' : '#2563eb' },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>💬</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  icon: { fontSize: 26 },
});
