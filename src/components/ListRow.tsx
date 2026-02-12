import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ListRowProps {
  title: string;
  subtitle?: string;
  /** Small muted label below subtitle (e.g. bank name). */
  bottomLabel?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  dark?: boolean;
}

export function ListRow({ title, subtitle, bottomLabel, right, onPress, dark }: ListRowProps) {
  const content = (
    <>
      <View style={styles.main}>
        <Text style={[styles.title, dark && styles.titleDark]} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, dark && styles.subtitleDark]} numberOfLines={1}>{subtitle}</Text> : null}
        {bottomLabel ? <Text style={[styles.bottomLabel, dark && styles.bottomLabelDark]} numberOfLines={1}>{bottomLabel}</Text> : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </>
  );
  if (onPress) {
    return (
      <TouchableOpacity style={[styles.row, dark && styles.rowDark]} onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  return <View style={[styles.row, dark && styles.rowDark]}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowDark: {
    backgroundColor: '#334155',
    borderBottomColor: '#475569',
  },
  main: { flex: 1, minWidth: 0 },
  right: {},
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
  },
  titleDark: { color: '#f1f5f9' },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  subtitleDark: { color: '#94a3b8' },
  bottomLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  bottomLabelDark: { color: '#64748b' },
});
