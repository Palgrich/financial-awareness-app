import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import type { DashboardStackParamList } from '../navigation/types';
import { useProgressStore } from '../state/progressStore';
import { colors } from '../theme/tokens';
import type { HealthStatus } from '../data/progressUserData';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'HealthBreakdown'>;

const STATUS_ICON: Record<HealthStatus, string> = {
  Strong: '✅',
  Good: '✅',
  Moderate: '⚠️',
  High: '🔴',
};

const BIGGEST_OPPORTUNITY = 'Fix your subscriptions to reach 90+';

export function HealthBreakdownScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const userData = useProgressStore((s) => s.userData);
  const { financialHealthScore, healthBreakdown } = userData;

  const totalMax =
    healthBreakdown.creditCardPayments.max +
    healthBreakdown.cashControl.max +
    healthBreakdown.financialAwareness.max +
    healthBreakdown.subscriptionLoad.max;

  const scoreLabel =
    financialHealthScore >= 90
      ? 'Great'
      : financialHealthScore >= 75
        ? 'Room to improve'
        : 'Keep going';

  const rows: { key: keyof typeof healthBreakdown; label: string }[] = [
    { key: 'creditCardPayments', label: 'Credit Card Payments' },
    { key: 'cashControl', label: 'Cash Control' },
    { key: 'financialAwareness', label: 'Financial Awareness' },
    { key: 'subscriptionLoad', label: 'Subscription Load' },
  ];

  const goToLearnQuest = (screen: string, params?: object) => {
    navigation.goBack();
    (navigation.getParent() as any)?.navigate('Learn', { screen, params });
  };

  const onRowPress = (key: keyof typeof healthBreakdown) => {
    navigation.goBack();
    const status = healthBreakdown[key].status;
    if (key === 'subscriptionLoad' && (status === 'High' || status === 'Moderate')) {
      (navigation.getParent() as any)?.navigate('Learn', {
        screen: 'QuestSubscriptionCleanse',
        params: { step: 1 },
      });
    } else if (key === 'creditCardPayments' && status !== 'Strong') {
      (navigation.getParent() as any)?.navigate('Learn', { screen: 'LearnHome' });
    } else if (key === 'financialAwareness') {
      (navigation.getParent() as any)?.navigate('Learn', { screen: 'LearnHome' });
    } else if (key === 'cashControl') {
      (navigation.getParent() as any)?.navigate('Learn', { screen: 'LearnHome' });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>What makes up your score</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Financial Health Score</Text>
        <View style={styles.divider} />
        <View style={styles.scoreRow}>
          <Text style={styles.scoreMain}>
            {financialHealthScore} / {totalMax}
          </Text>
          <Text style={styles.scoreSub}>· {scoreLabel}</Text>
        </View>
        {rows.map(({ key, label }) => {
          const item = healthBreakdown[key];
          return (
            <TouchableOpacity
              key={key}
              style={styles.row}
              onPress={() => onRowPress(key)}
              activeOpacity={0.7}
            >
              <Text style={styles.rowLabel}>{label}</Text>
              <Text style={styles.rowScore}>
                {item.score} / {item.max}
              </Text>
              <Text style={styles.rowBadge}>{STATUS_ICON[item.status]} {item.status}</Text>
            </TouchableOpacity>
          );
        })}
        <View style={styles.divider} />
        <Text style={styles.opportunityLabel}>Biggest opportunity:</Text>
        <Text style={styles.opportunityText}>"{BIGGEST_OPPORTUNITY}"</Text>
        <TouchableOpacity
          style={styles.cta}
          onPress={() => goToLearnQuest('QuestSubscriptionCleanse', { step: 1 })}
        >
          <Text style={styles.ctaText}>Start Subscription Cleanse →</Text>
        </TouchableOpacity>
      </ScrollView>
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
  screenTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginVertical: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 20,
  },
  scoreMain: { fontSize: 28, fontWeight: '700', color: '#0F172A' },
  scoreSub: { fontSize: 16, color: colors.text.muted },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  rowLabel: { fontSize: 15, color: '#0F172A', flex: 1 },
  rowScore: { fontSize: 15, fontWeight: '600', color: '#0F172A', marginRight: 12 },
  rowBadge: { fontSize: 14, color: colors.text.secondary },
  opportunityLabel: {
    fontSize: 14,
    color: colors.text.muted,
    marginBottom: 4,
  },
  opportunityText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 24,
  },
  cta: {
    backgroundColor: colors.accent.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
