import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, SecondaryButton } from '../components';
import { useStore } from '../state/store';
import { formatCurrency, formatDate } from '../utils/format';
import type { DashboardStackParamList, TransactionsStackParamList } from '../navigation/types';

type Route = RouteProp<DashboardStackParamList | TransactionsStackParamList, 'TransactionDetail'>;

export function TransactionDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { transactionId } = route.params;
  const transactions = useStore((s) => s.transactions);
  const accounts = useStore((s) => s.accounts);
  const dark = useStore((s) => s.preferences.darkMode);
  const t = transactions.find((x) => x.id === transactionId);
  const accountName = t ? (accounts.find((a) => a.id === t.accountId)?.name ?? 'Unknown') : '';

  if (!t) {
    return (
      <SafeAreaView style={[styles.container, dark && styles.containerDark]}>
        <Text style={[styles.error, { color: dark ? '#94a3b8' : '#64748b' }]}>Transaction not found.</Text>
        <SecondaryButton title="Go back" onPress={() => navigation.goBack()} dark={dark} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, dark && styles.containerDark]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.merchant, { color: dark ? '#f1f5f9' : '#0f172a' }]}>{t.merchant}</Text>
        <Text style={[t.type === 'income' ? styles.amountIncome : styles.amountExpense, { marginTop: 4 }]}>
          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
        </Text>
      </View>
      <Card dark={dark} style={styles.card}>
        <Row label="Date" value={formatDate(t.date)} dark={dark} />
        <Row label="Category" value={t.category} dark={dark} />
        <Row label="Account" value={accountName} dark={dark} />
        {t.isRecurring != null && <Row label="Recurring" value={t.isRecurring ? 'Yes' : 'No'} dark={dark} />}
      </Card>
      <View style={styles.footer}>
        <SecondaryButton title="Back" onPress={() => navigation.goBack()} dark={dark} />
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, dark }: { label: string; value: string; dark: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: dark ? '#94a3b8' : '#64748b' }]}>{label}</Text>
      <Text style={[styles.value, { color: dark ? '#f1f5f9' : '#0f172a' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  containerDark: { backgroundColor: '#0f172a' },
  header: { alignItems: 'center', paddingVertical: 24 },
  merchant: { fontSize: 22, fontWeight: '600' },
  amountIncome: { fontSize: 28, fontWeight: '700', color: '#16a34a' },
  amountExpense: { fontSize: 28, fontWeight: '700', color: '#dc2626' },
  card: { marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  label: { fontSize: 14 },
  value: { fontSize: 16, fontWeight: '500' },
  footer: { marginTop: 24 },
  error: { padding: 16, textAlign: 'center' },
});
