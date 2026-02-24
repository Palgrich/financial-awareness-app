import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import type { DashboardStackParamList } from '../navigation/types';
import { useProgressStore } from '../state/progressStore';
import { colors } from '../theme/tokens';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'CreditCardDetails'>;

export function CreditCardDetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const userData = useProgressStore((s) => s.userData);
  const {
    cardName,
    currentCardBalance,
    creditLimit,
    utilizationPercent,
    minimumDue,
    nextDueDate,
    estimatedPayment,
    paymentHistory,
  } = userData;

  const utilStatus =
    utilizationPercent < 30 ? 'good' : utilizationPercent < 60 ? 'moderate' : 'high';
  const utilColor =
    utilStatus === 'good'
      ? colors.status.good
      : utilStatus === 'moderate'
        ? colors.status.moderate
        : colors.status.high;
  const onTimeCount = paymentHistory.filter(Boolean).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Card details</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.cardName}>{cardName}</Text>
        <Text style={styles.last4}>···· 4242</Text>
        <DetailRow label="Current balance" value={`$${currentCardBalance}`} />
        <DetailRow label="Credit limit" value={`$${creditLimit}`} />
        <View style={styles.utilSection}>
          <Text style={styles.utilLabel}>
            Utilization: {utilizationPercent}%{' '}
            {utilStatus === 'good' ? '✅' : utilStatus === 'moderate' ? '⚠️' : '🔴'}
          </Text>
          <View style={styles.utilBar}>
            <View
              style={[
                styles.utilFill,
                {
                  width: `${Math.min(100, utilizationPercent)}%`,
                  backgroundColor: utilColor,
                },
              ]}
            />
          </View>
        </View>
        <DetailRow label="Payment due" value={nextDueDate} />
        <DetailRow label="Minimum due" value={`$${minimumDue}`} />
        <DetailRow label="Estimated payment" value={`~$${estimatedPayment}`} />
        <View style={styles.historySection}>
          <Text style={styles.historyLabel}>Payment history (last 6 months)</Text>
          <View style={styles.dots}>
            {paymentHistory.slice(0, 6).map((onTime, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  onTime ? styles.dotOnTime : styles.dotLate,
                ]}
              />
            ))}
          </View>
          <Text style={styles.historySub}>
            {onTimeCount} months on time · Keep it up!
          </Text>
        </View>
        <TouchableOpacity style={styles.reminderBtn}>
          <Text style={styles.reminderText}>Set payment reminder</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: '#0F172A',
  },
  headerSpacer: { width: 32 },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 48 },
  cardName: { fontSize: 22, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  last4: { fontSize: 16, color: colors.text.muted, marginBottom: 24 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  detailLabel: { fontSize: 15, color: colors.text.muted },
  detailValue: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  utilSection: { marginTop: 16, marginBottom: 16 },
  utilLabel: { fontSize: 15, color: '#0F172A', marginBottom: 8 },
  utilBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  utilFill: { height: '100%', borderRadius: 5 },
  historySection: { marginTop: 24, marginBottom: 24 },
  historyLabel: { fontSize: 15, color: '#0F172A', marginBottom: 12 },
  dots: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dotOnTime: { backgroundColor: colors.status.good },
  dotLate: { backgroundColor: colors.status.high, opacity: 0.5 },
  historySub: { fontSize: 14, color: colors.text.muted },
  reminderBtn: {
    backgroundColor: colors.accent.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  reminderText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
