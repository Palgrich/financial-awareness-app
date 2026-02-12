import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppHeader, AppHeaderDark, ListRow, PrimaryButton } from '../components';
import { useStore } from '../state/store';
import { formatCurrency } from '../utils/format';
import type { DashboardStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'DebtsList'>;

export function DebtsListScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const debts = useStore((s) => s.debts);
  const dark = useStore((s) => s.preferences.darkMode);

  const Header = dark ? AppHeaderDark : AppHeader;
  const bg = dark ? '#0f172a' : '#f8fafc';

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: bg }]}>
      <Header title="Debts" subtitle="Track and manage your debt" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {debts.length === 0 ? (
          <Text style={[styles.empty, { color: dark ? '#94a3b8' : '#64748b' }]}>
            No debts added. Add your first debt to track it.
          </Text>
        ) : (
          debts.map((d) => (
            <ListRow
              key={d.id}
              dark={dark}
              title={d.name}
              subtitle={
                d.apr != null
                  ? `${formatCurrency(d.balance)} · ${d.apr}% APR`
                  : formatCurrency(d.balance)
              }
              right={
                <View style={[styles.badge, d.status === 'paid_off' && styles.badgePaidOff]}>
                  <Text style={styles.badgeText}>{d.status.replace('_', ' ')}</Text>
                </View>
              }
              onPress={() => navigation.navigate('EditDebt', { debtId: d.id })}
            />
          ))
        )}
        <PrimaryButton
          title="Add debt"
          onPress={() => navigation.navigate('AddDebt')}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 24 },
  empty: { padding: 24, textAlign: 'center', marginBottom: 16 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
  },
  badgePaidOff: { backgroundColor: '#dcfce7' },
  badgeText: { fontSize: 12, fontWeight: '500', color: '#475569' },
});
