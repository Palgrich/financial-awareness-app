import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppHeader, AppHeaderDark, Card } from '../components';
import { useStore } from '../state/store';
import { generateInsights } from '../insights/insightEngine';
import type { DashboardStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'Notifications'>;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  ctaLabel?: string;
  ctaRoute?: 'Subscriptions' | 'Learn';
}

export function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const dark = useStore((s) => s.preferences.darkMode);
  const accounts = useStore((s) => s.accounts);
  const transactions = useStore((s) => s.transactions);
  const subscriptions = useStore((s) => s.subscriptions);
  const selectedInstitutionId = useStore((s) => s.selectedInstitutionId);
  const monthlyIncome = useStore((s) => s.preferences.monthlyIncome);

  const visibleAccountIds = useMemo(() => {
    const ids = new Set<string>();
    if (selectedInstitutionId === null) accounts.forEach((a) => ids.add(a.id));
    else accounts.filter((a) => a.institutionId === selectedInstitutionId).forEach((a) => ids.add(a.id));
    return ids;
  }, [accounts, selectedInstitutionId]);

  const visibleTransactions = useMemo(() => {
    return transactions.filter((t) => visibleAccountIds.has(t.accountId));
  }, [transactions, visibleAccountIds]);

  const scopedSubscriptions = useMemo(
    () => subscriptions.filter((s) => visibleAccountIds.has(s.accountId)),
    [subscriptions, visibleAccountIds]
  );

  const behavioralInsights = useMemo(
    () =>
      generateInsights({
        visibleTransactions,
        visibleSubscriptions: scopedSubscriptions,
        monthlyIncome,
      }),
    [visibleTransactions, scopedSubscriptions, monthlyIncome]
  );

  const storeInsights = useStore((s) => s.insights);
  const subscriptionAndFeeInsights = useMemo(
    () =>
      storeInsights.filter(
        (i) =>
          i.relatedCategory === 'Fees' ||
          i.relatedCategory === 'Subscriptions' ||
          i.title.toLowerCase().includes('subscription') ||
          i.title.toLowerCase().includes('fee')
      ),
    [storeInsights]
  );

  const notifications: NotificationItem[] = useMemo(() => {
    const list: NotificationItem[] = [];
    behavioralInsights.forEach((b) => {
      list.push({
        id: `beh-${b.type}`,
        title: b.type.replace(/_/g, ' '),
        message: b.message,
        timestamp: 'This month',
        ctaLabel: b.type === 'high_subscription_load' ? 'View' : undefined,
        ctaRoute: b.type === 'high_subscription_load' ? 'Subscriptions' : undefined,
      });
    });
    subscriptionAndFeeInsights.forEach((i) => {
      list.push({
        id: i.id,
        title: i.title,
        message: i.message,
        timestamp: 'This month',
        ctaLabel: i.ctaLabel ?? undefined,
        ctaRoute: i.ctaRoute as 'Subscriptions' | 'Learn' | undefined,
      });
    });
    return list;
  }, [behavioralInsights, subscriptionAndFeeInsights]);

  const Header = dark ? AppHeaderDark : AppHeader;
  const bg = dark ? '#0f172a' : '#f8fafc';
  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: bg }]}>
      <Header title="Notifications" subtitle="Financial updates" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <Card dark={dark}>
            <Text style={[styles.empty, { color: mutedColor }]}>No notifications.</Text>
          </Card>
        ) : (
          notifications.map((n) => (
            <Card key={n.id} dark={dark} style={styles.card}>
              <Text style={[styles.title, { color: textColor }]}>{n.title}</Text>
              <Text style={[styles.message, { color: mutedColor }]}>{n.message}</Text>
              <Text style={[styles.timestamp, { color: mutedColor }]}>{n.timestamp}</Text>
              {n.ctaLabel && n.ctaRoute && (
                <TouchableOpacity
                  style={styles.cta}
                  onPress={() => {
                    if (n.ctaRoute === 'Subscriptions') navigation.navigate('SubscriptionsHome');
                    else if (n.ctaRoute === 'Learn') navigation.getParent()?.navigate('Learn', { screen: 'LearnHome' });
                  }}
                >
                  <Text style={[styles.ctaText, { color: mutedColor }]}>{n.ctaLabel}</Text>
                </TouchableOpacity>
              )}
            </Card>
          ))
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  card: { marginHorizontal: 16, marginBottom: 10 },
  title: { fontSize: 15, fontWeight: '600' },
  message: { fontSize: 13, marginTop: 2 },
  timestamp: { fontSize: 11, marginTop: 4 },
  cta: { marginTop: 8 },
  ctaText: { fontSize: 13, fontWeight: '500' },
  empty: { fontSize: 14 },
});
