import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatCurrency, formatShortDate } from '../utils/format';

interface SubscriptionCardProps {
  merchant: string;
  monthlyCost: number;
  nextBillingDate: string;
  bankName: string;
  accountName: string;
  status: 'active' | 'trial' | 'cancelled';
  isSoon?: boolean;
  dark?: boolean;
  onPress?: () => void;
}

export function SubscriptionCard({
  merchant,
  monthlyCost,
  nextBillingDate,
  bankName,
  accountName,
  status,
  isSoon,
  dark,
  onPress,
}: SubscriptionCardProps) {
  const bankAccountLine = `${bankName} · ${accountName}`;
  const showTrial = status === 'trial';
  const showSoon = isSoon && status !== 'cancelled';

  const content = (
    <>
      <View style={styles.main}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, dark && styles.titleDark]} numberOfLines={1}>
            {merchant}
          </Text>
          <View style={styles.badges}>
            {showTrial && (
              <View style={[styles.badge, styles.badgeTrial]}>
                <Text style={styles.badgeText}>Trial</Text>
              </View>
            )}
            {showSoon && (
              <View style={[styles.badge, styles.badgeSoon]}>
                <Text style={styles.badgeText}>Soon</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={[styles.bankAccount, { color: dark ? '#64748b' : '#94a3b8' }]} numberOfLines={1}>
          {bankAccountLine}
        </Text>
        <Text style={[styles.price, { color: dark ? '#e2e8f0' : '#0f172a' }]}>
          {formatCurrency(monthlyCost)}/mo
        </Text>
        <Text style={[styles.nextBilling, { color: dark ? '#64748b' : '#94a3b8' }]}>
          Next: {formatShortDate(nextBillingDate)}
        </Text>
      </View>
      {status === 'cancelled' && (
        <View style={styles.cancelledWrap}>
          <Text style={[styles.cancelledText, { color: dark ? '#64748b' : '#94a3b8' }]}>Cancelled</Text>
        </View>
      )}
    </>
  );

  const rowStyle = [
    styles.row,
    dark && styles.rowDark,
    status === 'cancelled' && styles.rowCancelled,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={rowStyle} onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  return <View style={rowStyle}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowDark: {
    backgroundColor: '#334155',
    borderBottomColor: '#475569',
  },
  rowCancelled: {
    opacity: 0.85,
  },
  main: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  title: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  titleDark: { color: '#f1f5f9' },
  bankAccount: { fontSize: 12, marginTop: 2 },
  price: { fontSize: 15, fontWeight: '600', marginTop: 4 },
  nextBilling: { fontSize: 12, marginTop: 2 },
  badges: { flexDirection: 'row', gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeTrial: { backgroundColor: 'rgba(59, 130, 246, 0.15)' },
  badgeSoon: { backgroundColor: 'rgba(245, 158, 11, 0.15)' },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#64748b' },
  cancelledWrap: { marginLeft: 8 },
  cancelledText: { fontSize: 12, fontStyle: 'italic' },
});
