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
import { AppHeader, AppHeaderDark, Chip } from '../components';
import { useTheme } from '../theme/useTheme';
import { formatCurrency } from '../utils/format';
import type { DashboardStackParamList, TransactionsStackParamList } from '../navigation/types';
import type { Transaction } from '../types';
import { mockTransactions } from '../data/mock/transactions';

type Nav =
  | NativeStackNavigationProp<TransactionsStackParamList, 'TransactionsHome'>
  | NativeStackNavigationProp<DashboardStackParamList, 'TransactionsHome'>;

const GRADIENT_COLORS = ['#1E1B4B', '#3730A3', '#5B4FE8'] as const;

const ACCOUNTS = [
  { bank: 'Chase', balance: 12450, dot: '#4A90D9' },
  { bank: 'Bank of America', balance: 14820, dot: '#E05C5C' },
  { bank: 'Wells Fargo', balance: 251, dot: '#F59E0B' },
] as const;

const CATEGORY_EMOJI: Record<string, string> = {
  Groceries: '🛒',
  Entertainment: '🎬',
  Income: '💼',
  Transportation: '🚗',
  Dining: '🍔',
  Health: '💊',
  Shopping: '🛍️',
  Utilities: '💡',
  Fees: '📋',
  Transfer: '↔️',
  Technology: '📱',
};

function formatDateGroupLabel(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? '📌';
}

const accountIdToBank: Record<string, string> = {
  'chase-credit': 'Chase',
  'chase-checking': 'Chase',
  'boa-checking': 'Bank of America',
  'boa-savings': 'Bank of America',
  'ally-savings': 'Wells Fargo',
};

export function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { isDark, colors } = useTheme();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filtered = useMemo(() => {
    const list = [...mockTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (filter === 'all') return list;
    return list.filter((t) => t.type === filter);
  }, [filter]);

  const byDate = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    filtered.forEach((t) => {
      const key = t.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return Array.from(map.entries()).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [filtered]);

  const totalBalance = ACCOUNTS.reduce((s, a) => s + a.balance, 0);
  const Header = isDark ? AppHeaderDark : AppHeader;
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const tileBorder = isDark ? { borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' } : {};
  const transactionCardBorder = isDark ? { borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' } : {};
  const rowDivider = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const iconCircleBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(91,79,232,0.1)';

  const onTransactionPress = (t: Transaction) => {
    (navigation as unknown as { navigate: (s: string, p?: { transactionId: string }) => void }).navigate(
      'TransactionDetail',
      { transactionId: t.id }
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <Header title="Cash" subtitle="Your accounts & spending" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
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
          <Text style={styles.totalBalanceLabel}>TOTAL BALANCE</Text>
          <Text style={styles.totalBalanceAmount}>
            ${Math.round(totalBalance).toLocaleString('en-US')}
          </Text>
          <View style={styles.accountsRow}>
            {ACCOUNTS.map((acc) => (
              <View key={acc.bank} style={styles.accountPill}>
                <View style={[styles.accountDot, { backgroundColor: acc.dot }]} />
                <Text style={styles.accountBankName} numberOfLines={1}>{acc.bank}</Text>
                <Text style={styles.accountBalance}>
                  ${Math.round(acc.balance).toLocaleString('en-US')}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.purpleDivider} />
          <View style={styles.actionItemRow}>
            <View style={styles.actionRedDot} />
            <View style={styles.actionTextBlock}>
              <Text style={styles.actionMainText}>
                Spending up 49% — Food & Dining is your top category
              </Text>
              <Text style={styles.actionCta}>See where money goes →</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Zone 2 — Spending tiles */}
        <View style={styles.tilesRow}>
          <View style={[styles.spendingTile, { backgroundColor: cardBg }, tileBorder]}>
            <Text style={[styles.tileLabel, { color: textMuted }]}>Spent this month</Text>
            <Text style={[styles.tileAmount, { color: textPrimary }]}>$961</Text>
            <Text style={styles.tileChangeRed}>↑ 49% vs last month</Text>
          </View>
          <View style={[styles.spendingTile, { backgroundColor: cardBg }, tileBorder]}>
            <Text style={[styles.tileLabel, { color: textMuted }]}>Daily spend</Text>
            <Text style={[styles.tileAmount, { color: textPrimary }]}>$67/day</Text>
            <Text style={styles.tileChangeRed}>↑ vs $43/day last month</Text>
          </View>
        </View>

        {/* Zone 3 — Filter tabs */}
        <View style={styles.chipsRow}>
          <Chip label="All" selected={filter === 'all'} onPress={() => setFilter('all')} dark={isDark} />
          <Chip label="Income" selected={filter === 'income'} onPress={() => setFilter('income')} dark={isDark} />
          <Chip label="Expenses" selected={filter === 'expense'} onPress={() => setFilter('expense')} dark={isDark} />
        </View>

        <Text style={[styles.sectionTitle, { color: textPrimary }]}>Transactions</Text>

        {byDate.map(([dateKey, txns]) => (
          <View key={dateKey} style={styles.dateGroup}>
            <Text style={[styles.dateHeader, { color: textMuted }]}>
              {formatDateGroupLabel(dateKey)}
            </Text>
            <View style={[styles.transactionCard, { backgroundColor: cardBg }, transactionCardBorder]}>
              {txns.map((t, i) => (
                <React.Fragment key={t.id}>
                  {i > 0 ? (
                    <View style={[styles.rowDivider, { backgroundColor: rowDivider }]} />
                  ) : null}
                  <TouchableOpacity
                    style={styles.transactionRow}
                    onPress={() => onTransactionPress(t)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.txIconCircle, { backgroundColor: iconCircleBg }]}>
                      <Text style={styles.txEmoji}>{getCategoryEmoji(t.category)}</Text>
                    </View>
                    <View style={styles.txContent}>
                      <Text style={[styles.txMerchant, { color: textPrimary }]} numberOfLines={1}>
                        {t.merchant}
                      </Text>
                      <Text style={[styles.txMeta, { color: textMuted }]} numberOfLines={1}>
                        {t.category} · {accountIdToBank[t.accountId] ?? t.accountId}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.txAmount,
                        t.type === 'income' ? styles.txAmountIncome : styles.txAmountExpense,
                      ]}
                    >
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </Text>
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
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
  totalBalanceLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  totalBalanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  accountsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  accountPill: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  accountDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 6,
  },
  accountBankName: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 2,
  },
  accountBalance: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  purpleDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginVertical: 16,
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
  tilesRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 8,
    marginBottom: 20,
  },
  spendingTile: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
  },
  tileLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  tileAmount: {
    fontSize: 20,
    fontWeight: '800',
  },
  tileChangeRed: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 20,
    marginBottom: 12,
  },
  dateGroup: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    paddingLeft: 4,
  },
  transactionCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  rowDivider: {
    height: 1,
    marginLeft: 16,
  },
  txIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txEmoji: { fontSize: 18 },
  txContent: { flex: 1, minWidth: 0 },
  txMerchant: {
    fontSize: 14,
    fontWeight: '600',
  },
  txMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  txAmountIncome: { color: '#22C55E' },
  txAmountExpense: { color: '#EF4444' },
});
