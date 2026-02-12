import React, { useState, useRef, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppHeader, AppHeaderDark } from '../components';
import { useStore } from '../state/store';
import { getCoachResponse, type CoachMessage } from '../utils/coachResponses';
import { getBudgetUsage, computeBudget } from '../domain/budget';
import { getSubscriptionLoadPercent } from '../domain/subscriptions';
import { calculateFinancialClarity } from '../awareness/score';
import { getExpensesForPeriod, getCategoryBreakdown } from '../domain/spending';
import type { DashboardStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'CoachHome'>;

const INITIAL_BOT: CoachMessage = {
  id: 'welcome',
  isUser: false,
  text: 'Hi! I’m your AI assistant. Ask me about your spending, subscriptions, or account balances. Type your question below.',
};

export function CoachScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [messages, setMessages] = useState<CoachMessage[]>([INITIAL_BOT]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const dark = useStore((s) => s.preferences.darkMode);
  const debts = useStore((s) => s.debts);
  const accounts = useStore((s) => s.accounts);
  const transactions = useStore((s) => s.transactions);
  const selectedInstitutionId = useStore((s) => s.selectedInstitutionId);
  const budget = useStore((s) => s.budget);
  const preferences = useStore((s) => s.preferences);
  const subscriptions = useStore((s) => s.subscriptions);
  const institutions = useStore((s) => s.institutions);

  const visibleTransactions = useMemo(() => {
    const visibleIds = new Set(
      selectedInstitutionId === null
        ? accounts.map((a) => a.id)
        : accounts.filter((a) => a.institutionId === selectedInstitutionId).map((a) => a.id)
    );
    return transactions.filter((t) => visibleIds.has(t.accountId));
  }, [accounts, transactions, selectedInstitutionId]);

  const visibleAccountIds = useMemo(
    () =>
      new Set(
        selectedInstitutionId === null
          ? accounts.map((a) => a.id)
          : accounts.filter((a) => a.institutionId === selectedInstitutionId).map((a) => a.id)
      ),
    [accounts, selectedInstitutionId]
  );
  const scopedSubscriptions = useMemo(
    () => subscriptions.filter((s) => visibleAccountIds.has(s.accountId)),
    [subscriptions, visibleAccountIds]
  );
  const activeSubsTotal = useMemo(
    () =>
      scopedSubscriptions
        .filter((s) => s.status === 'active' || s.status === 'trial')
        .reduce((sum, s) => sum + s.monthlyCost, 0),
    [scopedSubscriptions]
  );
  const subscriptionLoadPercent = getSubscriptionLoadPercent(activeSubsTotal, preferences.monthlyIncome);
  const clarityResult = useMemo(
    () =>
      calculateFinancialClarity({
        institutions,
        accounts,
        visibleAccountIds,
        subscriptions,
        visibleTransactions,
        monthlyIncome: preferences.monthlyIncome,
      }),
    [institutions, accounts, visibleAccountIds, subscriptions, visibleTransactions, preferences.monthlyIncome]
  );
  const thisMonthExpenses = useMemo(
    () => getExpensesForPeriod(visibleTransactions, 'this_month'),
    [visibleTransactions]
  );
  const categoryBreakdown = useMemo(() => getCategoryBreakdown(thisMonthExpenses, 5), [thisMonthExpenses]);
  const topExpenseCategories = useMemo(
    () => categoryBreakdown.segments.filter((s) => s.name !== 'Other').map((s) => ({ name: s.name, amount: s.amount })),
    [categoryBreakdown]
  );

  const budgetData = budget ?? computeBudget(preferences.monthlyIncome);
  const now = new Date();
  const usage = getBudgetUsage(visibleTransactions, budgetData, now.getFullYear(), now.getMonth());
  const savingsProgress = preferences.savingsGoal > 0
    ? (usage.savings / preferences.savingsGoal) * 100
    : 100;
  const coachContext = {
    debts: debts.map((d) => ({ apr: d.apr, balance: d.balance, status: d.status })),
    monthlyIncome: preferences.monthlyIncome,
    budget: budgetData,
    needsUsed: usage.needs,
    wantsUsed: usage.wants,
    savingsUsed: usage.savings,
    savingsGoal: preferences.savingsGoal,
    savingsProgress,
    subscriptionLoadPercent: subscriptionLoadPercent ?? undefined,
    clarityScore: clarityResult.score,
    topExpenseCategories,
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: CoachMessage = { id: `u-${Date.now()}`, text: trimmed, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      const response = getCoachResponse(trimmed, coachContext);
      setMessages((prev) => [...prev, response]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 400);
  };

  const handleLessonCta = (lessonId: string) => {
    navigation.getParent()?.navigate('Learn', { screen: 'LessonDetail', params: { lessonId } });
  };
  const handleChallengeCta = (challengeId: string) => {
    navigation.getParent()?.navigate('Learn', { screen: 'ChallengeDetail', params: { challengeId } });
  };

  const Header = dark ? AppHeaderDark : AppHeader;
  const bg = dark ? '#0f172a' : '#f8fafc';
  const bubbleUser = dark ? '#2563eb' : '#2563eb';
  const bubbleBot = dark ? '#334155' : '#e2e8f0';
  const textUser = '#ffffff';
  const textBot = dark ? '#f1f5f9' : '#0f172a';

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: bg }]}>
      <Header title="AI" subtitle="Ask about your spending, subscriptions, or balances." />
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map((m) => (
          <View key={m.id} style={[styles.bubbleWrap, m.isUser && styles.bubbleWrapUser]}>
            <View style={[styles.bubble, m.isUser ? { backgroundColor: bubbleUser } : { backgroundColor: bubbleBot }]}>
              <Text style={[styles.bubbleText, { color: m.isUser ? textUser : textBot }]}>{m.text}</Text>
              {!m.isUser && (m as CoachMessage).lessonId && (
                <TouchableOpacity
                  style={styles.cta}
                  onPress={() => handleLessonCta((m as CoachMessage).lessonId!)}
                >
                  <Text style={styles.ctaText}>📚 Lesson: {(m as CoachMessage).lessonTitle}</Text>
                </TouchableOpacity>
              )}
              {!m.isUser && (m as CoachMessage).challengeId && (
                <TouchableOpacity
                  style={styles.cta}
                  onPress={() => handleChallengeCta((m as CoachMessage).challengeId!)}
                >
                  <Text style={styles.ctaText}>🎯 Challenge: {(m as CoachMessage).challengeTitle}</Text>
                </TouchableOpacity>
              )}
              {!m.isUser && (m as CoachMessage).budgetSetup && (
                <TouchableOpacity
                  style={styles.cta}
                  onPress={() => navigation.navigate('BudgetSetup')}
                >
                  <Text style={styles.ctaText}>Set budget</Text>
                </TouchableOpacity>
              )}
              {!m.isUser && (m as CoachMessage).addDebt && (
                <TouchableOpacity
                  style={styles.cta}
                  onPress={() => navigation.navigate('AddDebt')}
                >
                  <Text style={styles.ctaText}>Add debt</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
        <View style={[styles.inputRow, dark && styles.inputRowDark]}>
          <TextInput
            style={[styles.input, { color: dark ? '#f1f5f9' : '#0f172a' }]}
            placeholder="Ask a question..."
            placeholderTextColor={dark ? '#64748b' : '#94a3b8'}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => send(input)}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messages: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  bubbleWrap: { alignSelf: 'flex-start', maxWidth: '85%', marginBottom: 12 },
  bubbleWrapUser: { alignSelf: 'flex-end' },
  bubble: { padding: 14, borderRadius: 16, maxWidth: 320 },
  bubbleText: { fontSize: 15 },
  cta: { marginTop: 10, paddingVertical: 6 },
  ctaText: { fontSize: 14, fontWeight: '600', color: '#2563eb' },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 24, gap: 8, backgroundColor: '#f8fafc', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  inputRowDark: { backgroundColor: '#0f172a', borderTopColor: '#334155' },
  input: { flex: 1, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
  sendBtn: { backgroundColor: '#2563eb', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  sendText: { color: '#ffffff', fontWeight: '600', fontSize: 15 },
});
