import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppHeader, AppHeaderDark } from '../components';
import { useStore } from '../state/store';
import type { DashboardStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'Menu'>;

const ROWS: { label: string; screen: keyof DashboardStackParamList }[] = [
  { label: 'Notifications', screen: 'Notifications' },
  { label: 'Settings', screen: 'Settings' },
];

export function MenuScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const dark = useStore((s) => s.preferences.darkMode);
  const bg = dark ? '#0f172a' : '#f8fafc';
  const cardBg = dark ? '#1e293b' : '#ffffff';
  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';
  const borderColor = dark ? '#334155' : '#e2e8f0';

  const Header = dark ? AppHeaderDark : AppHeader;

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: bg }]}>
      <Header title="Menu" subtitle="Account and alerts" />
      <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
        {ROWS.map(({ label, screen }, i) => (
          <TouchableOpacity
            key={screen}
            style={[styles.row, i > 0 && styles.rowBorder, { borderTopColor: borderColor }]}
            onPress={() => {
              if (screen === 'Notifications') navigation.navigate('Notifications');
              else if (screen === 'Settings') navigation.navigate('Settings');
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.rowLabel, { color: textColor }]}>{label}</Text>
            <Text style={[styles.rowArrow, { color: mutedColor }]}>→</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  rowBorder: { borderTopWidth: StyleSheet.hairlineWidth },
  rowLabel: { fontSize: 16, fontWeight: '500' },
  rowArrow: { fontSize: 16 },
});
