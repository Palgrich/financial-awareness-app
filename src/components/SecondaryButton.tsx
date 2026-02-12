import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  dark?: boolean;
}

export function SecondaryButton({ title, onPress, disabled, dark }: SecondaryButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, dark && styles.buttonDark, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, dark && styles.textDark]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonDark: {
    borderColor: '#60a5fa',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  textDark: {
    color: '#60a5fa',
  },
});
