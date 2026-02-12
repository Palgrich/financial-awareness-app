import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppHeader, AppHeaderDark, DebtSnapshotCard, LoadingSkeleton } from '../components';
import { useStore } from '../state/store';
import { getTotalDebt, getNextPayment } from '../domain/debts';

export function DebtsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const appLoaded = useStore((s) => s.appLoaded);
  const dark = useStore((s) => s.preferences.darkMode);
  const debts = useStore((s) => s.debts);
  const totalDebt = getTotalDebt(debts);
  const nextPayment = getNextPayment(debts);
  const debtCount = debts.filter((d) => d.status !== 'paid_off').length;

  if (!appLoaded) {
    return <LoadingSkeleton />;
  }

  const bg = dark ? '#0f172a' : '#f8fafc';
  const mutedColor = dark ? '#94a3b8' : '#64748b';

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: bg }]}>
      {dark ? (
        <AppHeaderDark title="Debts" subtitle="Track and manage debt" />
      ) : (
        <AppHeader title="Debts" subtitle="Track and manage debt" />
      )}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardWrap}>
          <DebtSnapshotCard
            totalDebt={totalDebt}
            nextPayment={nextPayment}
            debtCount={debtCount}
            onAddDebt={() => navigation.getParent()?.navigate('Profile', { screen: 'AddDebt' })}
            dark={dark}
          />
        </View>
        <TouchableOpacity
          style={styles.seeAll}
          onPress={() => navigation.getParent()?.navigate('Profile', { screen: 'DebtsList' })}
        >
          <Text style={[styles.seeAllText, { color: mutedColor }]}>See all debts</Text>
        </TouchableOpacity>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  cardWrap: { marginHorizontal: 16, marginTop: 16 },
  seeAll: { marginHorizontal: 16, marginTop: 12, paddingVertical: 8 },
  seeAllText: { fontSize: 14, fontWeight: '500' },
});
