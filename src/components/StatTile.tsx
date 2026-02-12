import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatTileProps {
  label: string;
  value: string;
  subValue?: string;
  /** Optional second line below subValue (muted, smaller). */
  extraSubValue?: string;
  dark?: boolean;
  /** Use larger value typography (e.g. for primary metric). */
  valueSize?: 'default' | 'large';
  /** Slightly reduce subtitle opacity for hierarchy. */
  subValueMuted?: boolean;
  /** When true, no border (e.g. when used inside a shadowed card). */
  noBorder?: boolean;
}

export function StatTile({ label, value, subValue, extraSubValue, dark, valueSize = 'default', subValueMuted, noBorder }: StatTileProps) {
  return (
    <View style={[styles.tile, dark && styles.tileDark, noBorder && styles.tileNoBorder, noBorder && dark && styles.tileNoBorderDark]}>
      <Text style={[styles.label, dark && styles.labelDark]}>{label}</Text>
      <Text style={[styles.value, valueSize === 'large' && styles.valueLarge, dark && styles.valueDark]}>{value}</Text>
      {subValue ? <Text style={[styles.subValue, dark && styles.subValueDark, subValueMuted && styles.subValueMuted]}>{subValue}</Text> : null}
      {extraSubValue ? <Text style={[styles.extraSubValue, dark && styles.extraSubValueDark, subValueMuted && styles.subValueMuted]}>{extraSubValue}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 100,
  },
  tileDark: {
    backgroundColor: '#334155',
    borderColor: '#475569',
  },
  tileNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  tileNoBorderDark: {
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  labelDark: { color: '#94a3b8' },
  value: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
  },
  valueLarge: {
    fontSize: 24,
    fontWeight: '700',
  },
  valueDark: { color: '#f1f5f9' },
  subValue: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  subValueDark: { color: '#94a3b8' },
  subValueMuted: { opacity: 0.85 },
  extraSubValue: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  extraSubValueDark: { color: '#64748b' },
});
