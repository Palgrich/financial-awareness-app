import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/tokens';
import { StatusBadge } from '../StatusBadge';

export interface LearnRowProps {
  title: string;
  subtitle?: string;
  statusLabel?: string;
  statusColor?: string;
  onPress: () => void;
  showBorderTop?: boolean;
}

export function LearnRow({
  title,
  subtitle,
  statusLabel,
  statusColor,
  onPress,
  showBorderTop = false,
}: LearnRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        showBorderTop && styles.rowBorder,
        pressed && styles.rowPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.right}>
        {statusLabel != null && statusColor != null ? (
          <StatusBadge label={statusLabel} statusColor={statusColor} />
        ) : null}
        <ChevronRight size={20} color={colors.text.muted} style={styles.chevron} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(15, 23, 42, 0.06)',
  },
  rowPressed: { opacity: 0.7 },
  left: { flex: 1, paddingRight: 12 },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chevron: { marginLeft: 4 },
});
