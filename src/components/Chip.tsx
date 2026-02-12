import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  dark?: boolean;
}

export function Chip({ label, selected, onPress, dark }: ChipProps) {
  const style = [
    styles.chip,
    selected && styles.chipSelected,
    dark && styles.chipDark,
    selected && dark && styles.chipSelectedDark,
  ];
  const textStyle = [
    styles.text,
    selected && styles.textSelected,
    dark && !selected && styles.textDark,
    selected && dark && styles.textSelectedDark,
  ];
  if (onPress) {
    return (
      <TouchableOpacity style={style} onPress={onPress} activeOpacity={0.7}>
        <Text style={textStyle}>{label}</Text>
      </TouchableOpacity>
    );
  }
  return (
    <View style={style}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chipSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  chipDark: {
    backgroundColor: '#475569',
    borderColor: '#64748b',
  },
  chipSelectedDark: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  textSelected: {
    color: '#ffffff',
  },
  textDark: {
    color: '#cbd5e1',
  },
  textSelectedDark: {
    color: '#ffffff',
  },
});
