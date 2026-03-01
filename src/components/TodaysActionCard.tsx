import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/useTheme';

export interface TodaysActionCardProps {
  title: string;
  subtitle: string;
  onPress: () => void;
}

const LIGHT_BG = '#F0EDFF';
const DARK_BG = '#1E1B4B';
const BUTTON_BG = '#5B4FE8';

export function TodaysActionCard({
  title,
  subtitle,
  onPress,
}: TodaysActionCardProps) {
  const { isDark, colors: themeColors } = useTheme();
  const backgroundColor = isDark ? DARK_BG : LIGHT_BG;
  const textPrimary = themeColors.textPrimary;
  const textMuted = themeColors.textMuted;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.textBlock}>
        <Text style={styles.label}>TODAY'S ACTION</Text>
        <Text style={[styles.title, { color: textPrimary }]} numberOfLines={2}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: textMuted }]} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <View style={styles.buttonWrap}>
        <View style={styles.circleButton}>
          <Text style={styles.arrow}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
  },
  textBlock: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#5B4FE8',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
  },
  buttonWrap: {
    alignSelf: 'center',
  },
  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BUTTON_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default TodaysActionCard;
