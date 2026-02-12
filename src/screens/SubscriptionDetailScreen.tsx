import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, PrimaryButton, SecondaryButton } from '../components';
import { useStore } from '../state/store';
import { formatCurrency, formatDate } from '../utils/format';
import type { DashboardStackParamList } from '../navigation/types';

type Route = RouteProp<DashboardStackParamList, 'SubscriptionDetail'>;

export function SubscriptionDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { subscriptionId } = route.params;
  const subscriptions = useStore((s) => s.subscriptions);
  const accounts = useStore((s) => s.accounts);
  const institutions = useStore((s) => s.institutions);
  const markCancelled = useStore((s) => s.markSubscriptionCancelled);
  const dark = useStore((s) => s.preferences.darkMode);
  const sub = subscriptions.find((x) => x.id === subscriptionId);
  const bankName = sub
    ? (() => {
        const acc = accounts.find((a) => a.id === sub.accountId);
        return acc ? institutions.find((i) => i.id === acc.institutionId)?.name ?? 'Unknown' : 'Unknown';
      })()
    : '';

  if (!sub) {
    return (
      <SafeAreaView style={[styles.container, dark && styles.containerDark]}>
        <Text style={[styles.error, { color: dark ? '#94a3b8' : '#64748b' }]}>Subscription not found.</Text>
        <SecondaryButton title="Close" onPress={() => navigation.goBack()} dark={dark} />
      </SafeAreaView>
    );
  }

  const isCancelled = sub.status === 'cancelled';

  return (
    <SafeAreaView style={[styles.container, dark && styles.containerDark]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.merchant, { color: dark ? '#f1f5f9' : '#0f172a' }]}>{sub.merchant}</Text>
        <Text style={[styles.amount, { color: dark ? '#cbd5e1' : '#475569' }]}>{formatCurrency(sub.monthlyCost)}/month</Text>
      </View>
      <Card dark={dark} style={styles.card}>
        <Row label="Category" value={sub.category} dark={dark} />
        <Row label="Bank" value={bankName} dark={dark} />
        <Row label="Last charge" value={formatDate(sub.lastChargeDate)} dark={dark} />
        <Row label="Status" value={sub.status} dark={dark} />
      </Card>
      {!isCancelled && (
        <PrimaryButton
          title="Mark as cancelled"
          onPress={() => {
            markCancelled(sub.id);
            navigation.goBack();
          }}
        />
      )}
      <View style={styles.footer}>
        <SecondaryButton title="Close" onPress={() => navigation.goBack()} dark={dark} />
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
  amount: { fontSize: 18, marginTop: 4 },
  card: { marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  label: { fontSize: 14 },
  value: { fontSize: 16, fontWeight: '500' },
  footer: { marginTop: 16 },
  error: { padding: 16, textAlign: 'center' },
});
