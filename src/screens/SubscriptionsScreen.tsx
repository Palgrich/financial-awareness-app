import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { AppHeader, AppHeaderDark, FloatingAIButton } from '../components';
import { useTheme } from '../theme/useTheme';
import { formatCurrency, formatShortDate } from '../utils/format';
import type { DashboardStackParamList } from '../navigation/types';
import type { Subscription } from '../types';
import { mockSubscriptions } from '../data/mock/subscriptions';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'SubscriptionsHome'>;

export type SubSortMode = 'all' | 'by_bank' | 'by_price' | 'upcoming';

const GRADIENT_COLORS = ['#1E1B4B', '#3730A3', '#5B4FE8'] as const;

const BANK_DOT: Record<string, string> = {
  Chase: '#4A90D9',
  'Bank of America': '#E05C5C',
  Ally: '#F59E0B',
};
const DEFAULT_BANK_DOT = '#94A3B8';

const SUBSCRIPTION_EMOJI: Record<string, string> = {
  Netflix: '🎬',
  Spotify: '🎵',
  'Planet Fitness': '💪',
  iCloud: '☁️',
  'iCloud+ 200GB': '☁️',
  'Amazon Prime': '📦',
  Hulu: '📺',
  'HBO Max': '📺',
  'YouTube Premium': '▶️',
  Adobe: '🎨',
  'Adobe Creative Cloud': '🎨',
  Disney: '🏰',
  DisneyPlus: '🏰',
  'Disney+': '🏰',
};
const DEFAULT_EMOJI = '📱';

const accountIdToBank: Record<string, string> = {
  'chase-credit': 'Chase',
  'chase-checking': 'Chase',
  'boa-checking': 'Bank of America',
  'boa-savings': 'Bank of America',
  'ally-savings': 'Ally',
};

function nextBillingDate(lastCharge: string): string {
  const d = new Date(lastCharge + 'T00:00:00');
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split('T')[0];
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + 'T00:00:00');
  return Math.floor((d.getTime() - today.getTime()) / 86400000);
}

function getSubscriptionEmoji(merchant: string): string {
  return SUBSCRIPTION_EMOJI[merchant] ?? DEFAULT_EMOJI;
}

const MONTHLY_INCOME = 1240;
const TOTAL_MONTHLY = 286.85;
const ANNUAL = 3442;
const INCOME_PCT = 23;

export function SubscriptionsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { isDark, colors } = useTheme();
  const [sortMode, setSortMode] = useState<SubSortMode>('all');

  const active = useMemo(
    () => mockSubscriptions.filter((s) => s.status === 'active' || s.status === 'trial'),
    []
  );
  const totalMonthly = useMemo(
    () => active.reduce((sum, s) => sum + s.monthlyCost, 0),
    [active]
  );
  const annualCost = totalMonthly * 12;
  const loadPercent = Math.round((totalMonthly / MONTHLY_INCOME) * 100);

  const bankBreakdown = useMemo(() => {
    const byBank: Record<string, number> = {};
    active.forEach((s) => {
      const bank = accountIdToBank[s.accountId] ?? 'Other';
      byBank[bank] = (byBank[bank] ?? 0) + s.monthlyCost;
    });
    return Object.entries(byBank)
      .map(([bank, amount]) => ({
        bank,
        amount,
        dot: BANK_DOT[bank] ?? DEFAULT_BANK_DOT,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
  }, [active]);

  const sortedOrGroupedList = useMemo(() => {
    const list = [...active];
    if (sortMode === 'by_price') {
      list.sort((a, b) => b.monthlyCost - a.monthlyCost);
      return { type: 'flat' as const, list };
    }
    if (sortMode === 'upcoming') {
      list.sort((a, b) => {
        const na = nextBillingDate(a.lastChargeDate);
        const nb = nextBillingDate(b.lastChargeDate);
        return na.localeCompare(nb);
      });
      return { type: 'flat' as const, list };
    }
    if (sortMode === 'by_bank') {
      const bankToSubs: Record<string, Subscription[]> = {};
      list.forEach((s) => {
        const bank = accountIdToBank[s.accountId] ?? 'Other';
        if (!bankToSubs[bank]) bankToSubs[bank] = [];
        bankToSubs[bank].push(s);
      });
      const groups = Object.entries(bankToSubs)
        .map(([bankName, subs]) => ({ bankName, subs }))
        .sort((a, b) => {
          const ta = a.subs.reduce((s, x) => s + x.monthlyCost, 0);
          const tb = b.subs.reduce((s, x) => s + x.monthlyCost, 0);
          return tb - ta;
        });
      return { type: 'grouped' as const, groups };
    }
    return { type: 'flat' as const, list };
  }, [active, sortMode]);

  const displayList = useMemo(() => {
    if (sortedOrGroupedList.type === 'flat') return sortedOrGroupedList.list;
    return sortedOrGroupedList.groups.flatMap((g) => g.subs);
  }, [sortedOrGroupedList]);

  const Header = isDark ? AppHeaderDark : AppHeader;
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const cardBorder = isDark ? { borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' } : {};
  const rowDivider = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const inactiveTabBg = isDark ? '#1E293B' : '#F1F5F9';

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <Header title="Subscriptions" subtitle="Your recurring charges" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Zone 1 — Purple card */}
        <LinearGradient
          colors={[...GRADIENT_COLORS]}
          style={styles.purpleCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.decorativeCircleTopRight} />
          <View style={styles.decorativeCircleBottomLeft} />
          <Text style={styles.totalLabel}>TOTAL MONTHLY</Text>
          <Text style={styles.totalAmount}>
            ${totalMonthly.toFixed(2)}
          </Text>
          <Text style={styles.totalSubtitle}>
            ${Math.round(annualCost).toLocaleString('en-US')}/year · {loadPercent}% of income
          </Text>
          <View style={styles.bankPillsRow}>
            {bankBreakdown.map((b) => (
              <View key={b.bank} style={styles.bankPill}>
                <View style={[styles.bankDot, { backgroundColor: b.dot }]} />
                <Text style={styles.bankName} numberOfLines={1}>{b.bank}</Text>
                <Text style={styles.bankAmount}>${Math.round(b.amount)}/mo</Text>
              </View>
            ))}
          </View>
          <View style={styles.purpleDivider} />
          <View style={styles.actionItemRow}>
            <View style={styles.actionRedDot} />
            <View style={styles.actionTextBlock}>
              <Text style={styles.actionMainText}>
                {active.length} subscriptions · ${Math.round(totalMonthly)}/mo is {loadPercent}% of income — too high
              </Text>
              <Text style={styles.actionCta}>Review and cut →</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
          style={styles.tabsScroll}
        >
          {(['all', 'by_bank', 'by_price', 'upcoming'] as const).map((mode) => {
            const label = mode === 'all' ? 'All' : mode === 'by_bank' ? 'By bank' : mode === 'by_price' ? 'By price' : 'Upcoming';
            const selected = sortMode === mode;
            return (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.tab,
                  { backgroundColor: selected ? '#5B4FE8' : inactiveTabBg },
                  !selected && isDark && styles.tabBorderDark,
                ]}
                onPress={() => setSortMode(mode)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: selected ? '#FFFFFF' : textMuted },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: textPrimary }]}>Active subscriptions</Text>

        <View style={[styles.listCard, { backgroundColor: cardBg }, cardBorder]}>
          {displayList.length === 0 ? (
            <Text style={[styles.empty, { color: textMuted }]}>No subscriptions.</Text>
          ) : (
            displayList.map((sub, i) => {
              const nextDate = nextBillingDate(sub.lastChargeDate);
              const days = daysUntil(nextDate);
              const dueSoon = days >= 0 && days <= 3;
              const bankName = accountIdToBank[sub.accountId] ?? 'Unknown';
              return (
                <React.Fragment key={sub.id}>
                  {i > 0 ? (
                    <View style={[styles.rowDivider, { backgroundColor: rowDivider }]} />
                  ) : null}
                  <TouchableOpacity
                    style={styles.subRow}
                    onPress={() => navigation.navigate('SubscriptionDetail', { subscriptionId: sub.id })}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.subIconCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(91,79,232,0.12)' }]}>
                      <Text style={styles.subEmoji}>{getSubscriptionEmoji(sub.merchant)}</Text>
                    </View>
                    <View style={styles.subContent}>
                      <Text style={[styles.subName, { color: textPrimary }]} numberOfLines={1}>
                        {sub.merchant}
                      </Text>
                      <Text style={[styles.subMeta, { color: textMuted }]} numberOfLines={1}>
                        {bankName} · Card
                      </Text>
                    </View>
                    <View style={styles.subRight}>
                      <Text style={[styles.subAmount, { color: textPrimary }]}>
                        {formatCurrency(sub.monthlyCost)}/mo
                      </Text>
                      <Text
                        style={[
                          styles.subNextDate,
                          { color: dueSoon ? '#EF4444' : textMuted },
                        ]}
                      >
                        {dueSoon ? `Due in ${days} days` : formatShortDate(nextDate)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </React.Fragment>
              );
            })
          )}
        </View>
      </ScrollView>
      <FloatingAIButton onPress={() => navigation.navigate('CoachHome')} dark={isDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  purpleCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  decorativeCircleTopRight: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 80,
  },
  decorativeCircleBottomLeft: {
    position: 'absolute',
    bottom: -60,
    left: -20,
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 100,
  },
  totalLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  totalSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 16,
  },
  bankPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bankPill: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  bankDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 6,
  },
  bankName: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 2,
  },
  bankAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  purpleDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginVertical: 14,
  },
  actionItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  actionRedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FCA5A5',
    marginTop: 6,
  },
  actionTextBlock: { flex: 1 },
  actionMainText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  actionCta: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FCD34D',
  },
  tabsScroll: { marginBottom: 16 },
  tabsScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
    flexDirection: 'row',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tabBorderDark: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 20,
    marginBottom: 12,
  },
  listCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  empty: {
    padding: 24,
    textAlign: 'center',
    fontSize: 14,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowDivider: {
    height: 1,
    marginLeft: 16,
  },
  subIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  subEmoji: { fontSize: 20 },
  subContent: { flex: 1, minWidth: 0 },
  subName: {
    fontSize: 15,
    fontWeight: '600',
  },
  subMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  subRight: { alignItems: 'flex-end' },
  subAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  subNextDate: {
    fontSize: 11,
    marginTop: 2,
  },
});
