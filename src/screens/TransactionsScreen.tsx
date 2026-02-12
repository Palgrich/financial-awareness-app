import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppHeader, AppHeaderDark, Chip, ListRow, LoadingSkeleton, SectionTitle, ScopeSelector } from '../components';
import { useStore } from '../state/store';
import { formatCurrency, formatShortDate } from '../utils/format';
import type { DashboardStackParamList, TransactionsStackParamList } from '../navigation/types';

type Nav =
  | NativeStackNavigationProp<DashboardStackParamList, 'TransactionsHome'>
  | NativeStackNavigationProp<TransactionsStackParamList, 'TransactionsHome'>;

const LIST_LIMIT = 100;

export function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const appLoaded = useStore((s) => s.appLoaded);
  const dark = useStore((s) => s.preferences.darkMode);
  const accounts = useStore((s) => s.accounts);
  const institutions = useStore((s) => s.institutions);
  const transactions = useStore((s) => s.transactions);
  const selectedInstitutionId = useStore((s) => s.selectedInstitutionId);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const accountIdToBankName = useMemo(() => {
    const map: Record<string, string> = {};
    accounts.forEach((a) => {
      const inst = institutions.find((i) => i.id === a.institutionId);
      map[a.id] = inst?.name ?? 'Unknown';
    });
    return map;
  }, [accounts, institutions]);

  const visibleTransactions = useMemo(() => {
    const visibleIds = new Set(
      selectedInstitutionId === null
        ? accounts.map((a) => a.id)
        : accounts.filter((a) => a.institutionId === selectedInstitutionId).map((a) => a.id)
    );
    return transactions.filter((t) => visibleIds.has(t.accountId));
  }, [accounts, transactions, selectedInstitutionId]);

  const filtered = useMemo(() => {
    const list = [...visibleTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (filter === 'all') return list.slice(0, LIST_LIMIT);
    return list.filter((t) => t.type === filter).slice(0, LIST_LIMIT);
  }, [visibleTransactions, filter]);

  if (!appLoaded) {
    return <LoadingSkeleton />;
  }

  const bg = dark ? '#0f172a' : '#f8fafc';
  const cardBg = dark ? '#1e293b' : '#ffffff';
  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: bg }]}>
      {dark ? (
        <AppHeaderDark title="Transactions" subtitle="Income and expenses" />
      ) : (
        <AppHeader title="Transactions" subtitle="Income and expenses" />
      )}
      <View style={styles.scopeRow}>
        <ScopeSelector dark={dark} />
      </View>
      <View style={styles.chips}>
        <Chip label="All" selected={filter === 'all'} onPress={() => setFilter('all')} dark={dark} />
        <Chip label="Income" selected={filter === 'income'} onPress={() => setFilter('income')} dark={dark} />
        <Chip label="Expenses" selected={filter === 'expense'} onPress={() => setFilter('expense')} dark={dark} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionTitle title="Recent" dark={dark} />
        <View style={[styles.listCard, { backgroundColor: cardBg, borderColor: dark ? '#475569' : '#e2e8f0' }]}>
          {filtered.length === 0 ? (
            <Text style={[styles.emptyText, { color: mutedColor, padding: 16 }]}>
              No transactions to show.
            </Text>
          ) : (
            filtered.map((t) => (
              <ListRow
                key={t.id}
                dark={dark}
                title={t.merchant}
                subtitle={`${formatShortDate(t.date)} · ${t.category}`}
                bottomLabel={accountIdToBankName[t.accountId]}
                right={
                  <Text
                    style={[
                      styles.amount,
                      t.type === 'income' ? styles.amountIncome : styles.amountExpense,
                      dark && styles.amountDark,
                    ]}
                  >
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </Text>
                }
                onPress={() => navigation.navigate('TransactionDetail', { transactionId: t.id })}
              />
            ))
          )}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scopeRow: { paddingHorizontal: 16, marginBottom: 8 },
  chips: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  listCard: { marginHorizontal: 16, borderRadius: 12, overflow: 'hidden', borderWidth: 1 },
  emptyText: { fontSize: 14 },
  amount: { fontSize: 15, fontWeight: '600' },
  amountIncome: { color: '#16a34a' },
  amountExpense: { color: '#dc2626' },
  amountDark: { color: '#f1f5f9' },
});
