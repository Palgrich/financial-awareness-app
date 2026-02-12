import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, AppHeaderDark, ListRow, EmptyState } from '../components';
import { useStore } from '../state/store';
import { formatCurrency, formatShortDate } from '../utils/format';
import type { DashboardStackParamList } from '../navigation/types';
import { getExpensesForPeriod } from '../domain/spending';

type Route = RouteProp<DashboardStackParamList, 'TransactionsByCategory'>;

export function TransactionsByCategoryScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { category, period } = route.params;
  const accounts = useStore((s) => s.accounts);
  const transactions = useStore((s) => s.transactions);
  const selectedInstitutionId = useStore((s) => s.selectedInstitutionId);
  const dark = useStore((s) => s.preferences.darkMode);

  const visibleTransactions = useMemo(() => {
    const visibleIds = new Set(
      selectedInstitutionId === null
        ? accounts.map((a) => a.id)
        : accounts.filter((a) => a.institutionId === selectedInstitutionId).map((a) => a.id)
    );
    return transactions.filter((t) => visibleIds.has(t.accountId));
  }, [accounts, transactions, selectedInstitutionId]);

  const filtered = useMemo(() => {
    const expenses =
      period === 'last_30_days'
        ? getExpensesForPeriod(visibleTransactions, 'last_30_days')
        : period === 'this_month'
          ? getExpensesForPeriod(visibleTransactions, 'this_month')
          : visibleTransactions.filter((t) => t.type === 'expense');
    return expenses.filter((t) => t.category === category);
  }, [visibleTransactions, category, period]);

  const total = filtered.reduce((s, t) => s + Math.abs(t.amount), 0);
  const periodLabel =
    period === 'this_month' ? 'This month' : period === 'last_30_days' ? 'Last 30 days' : '';
  const subtitle = [periodLabel, `${formatCurrency(total)} total`].filter(Boolean).join(' · ');

  const Header = dark ? AppHeaderDark : AppHeader;

  return (
    <SafeAreaView style={[styles.container, dark && styles.containerDark]} edges={['top']}>
      <Header title={category} subtitle={subtitle} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {filtered.length === 0 ? (
          <EmptyState
            title="No transactions"
            message={`No expenses in ${category}${periodLabel ? ` for ${periodLabel.toLowerCase()}` : ''}.`}
            dark={dark}
          />
        ) : (
          filtered.map((t) => (
            <ListRow
              key={t.id}
              dark={dark}
              title={t.merchant}
              subtitle={formatShortDate(t.date)}
              right={
                <Text style={[styles.amount, { color: dark ? '#f1f5f9' : '#0f172a' }]}>
                  -{formatCurrency(Math.abs(t.amount))}
                </Text>
              }
              onPress={() => (navigation as any).navigate('TransactionDetail', { transactionId: t.id })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  containerDark: { backgroundColor: '#0f172a' },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  amount: { fontSize: 15, fontWeight: '600' },
});
