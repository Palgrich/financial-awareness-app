import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  dark?: boolean;
}

export function Card({ children, style, onPress, dark }: CardProps) {
  const containerStyle = [styles.card, dark && styles.cardDark];
  if (onPress) {
    return (
      <TouchableOpacity style={[containerStyle, style]} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[containerStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardDark: {
    backgroundColor: '#334155',
    borderColor: '#475569',
  },
});
