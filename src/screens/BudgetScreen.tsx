import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppHeader, AppHeaderDark, BudgetWidget, LoadingSkeleton } from '../components';
import { useStore } from '../state/store';
import { getBudgetUsage, computeBudget } from '../domain/budget';

export function BudgetScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const appLoaded = useStore((s) => s.appLoaded);
  const dark = useStore((s) => s.preferences.darkMode);
  const transactions = useStore((s) => s.transactions);
  const budget = useStore((s) => s.budget);
  const monthlyIncome = useStore((s) => s.preferences.monthlyIncome);
  const now = new Date();
  const budgetData = budget ?? computeBudget(monthlyIncome);
  const usage = getBudgetUsage(
    transactions,
    budgetData,
    now.getFullYear(),
    now.getMonth()
  );

  if (!appLoaded) {
    return <LoadingSkeleton />;
  }

  const bg = dark ? '#0f172a' : '#f8fafc';

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: bg }]}>
      {dark ? (
        <AppHeaderDark title="Budget" subtitle="Needs, wants & savings" />
      ) : (
        <AppHeader title="Budget" subtitle="Needs, wants & savings" />
      )}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardWrap}>
          <BudgetWidget
            needsUsed={usage.needs}
            needsTarget={budgetData.needsTarget}
            wantsUsed={usage.wants}
            wantsTarget={budgetData.wantsTarget}
            savingsUsed={usage.savings}
            savingsTarget={budgetData.savingsTarget}
            onPress={() => navigation.getParent()?.navigate('Profile', { screen: 'BudgetSetup' })}
            dark={dark}
          />
        </View>
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
});
