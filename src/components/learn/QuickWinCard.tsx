import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { colors } from '../../theme/tokens';

export interface QuickWinCardProps {
  emoji: string;
  title: string;
  onPress: () => void;
}

export function QuickWinCard({ emoji, title, onPress }: QuickWinCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] },
      ]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <View style={styles.arrowRow}>
        <Text style={styles.arrow}>→</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    minHeight: 100,
    ...(Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }) as object),
  },
  emoji: { fontSize: 32, marginBottom: 8 },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  arrowRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  arrow: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6C63FF',
  },
});
