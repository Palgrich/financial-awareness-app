import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { PrimaryButton } from '../components';
import { useStore } from '../state/store';
import { computeBudget } from '../domain/budget';

export function BudgetSetupScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const preferences = useStore((s) => s.preferences);
  const budget = useStore((s) => s.budget);
  const setBudget = useStore((s) => s.setBudget);
  const dark = useStore((s) => s.preferences.darkMode);

  const [income, setIncome] = useState(
    String(budget?.monthlyIncome ?? preferences.monthlyIncome)
  );
  const [needsOverride, setNeedsOverride] = useState('');
  const [wantsOverride, setWantsOverride] = useState('');
  const [savingsOverride, setSavingsOverride] = useState('');

  const incomeNum = parseFloat(income) || 0;
  const computed = computeBudget(incomeNum);
  const needs = needsOverride ? parseFloat(needsOverride) || 0 : computed.needsTarget;
  const wants = wantsOverride ? parseFloat(wantsOverride) || 0 : computed.wantsTarget;
  const savings = savingsOverride ? parseFloat(savingsOverride) || 0 : computed.savingsTarget;

  const save = () => {
    if (incomeNum <= 0) return;
    setBudget({
      monthlyIncome: incomeNum,
      needsTarget: needs,
      wantsTarget: wants,
      savingsTarget: savings,
    });
    navigation.goBack();
  };

  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: dark ? '#0f172a' : '#f8fafc' }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: textColor }]}>Budget Setup</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
          50% needs, 30% wants, 20% savings. Override any target below.
        </Text>
        <Text style={[styles.label, { color: mutedColor }]}>Monthly income</Text>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: dark ? '#475569' : '#e2e8f0' }]}
          value={income}
          onChangeText={setIncome}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={mutedColor}
        />
        <Text style={[styles.label, { color: mutedColor }]}>Needs target (50% default)</Text>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: dark ? '#475569' : '#e2e8f0' }]}
          value={needsOverride || (incomeNum > 0 ? String(Math.round(computed.needsTarget)) : '')}
          onChangeText={setNeedsOverride}
          keyboardType="decimal-pad"
          placeholder={incomeNum > 0 ? String(Math.round(computed.needsTarget)) : 'Auto'}
          placeholderTextColor={mutedColor}
        />
        <Text style={[styles.label, { color: mutedColor }]}>Wants target (30% default)</Text>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: dark ? '#475569' : '#e2e8f0' }]}
          value={wantsOverride || (incomeNum > 0 ? String(Math.round(computed.wantsTarget)) : '')}
          onChangeText={setWantsOverride}
          keyboardType="decimal-pad"
          placeholder={incomeNum > 0 ? String(Math.round(computed.wantsTarget)) : 'Auto'}
          placeholderTextColor={mutedColor}
        />
        <Text style={[styles.label, { color: mutedColor }]}>Savings target (20% default)</Text>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: dark ? '#475569' : '#e2e8f0' }]}
          value={savingsOverride || (incomeNum > 0 ? String(Math.round(computed.savingsTarget)) : '')}
          onChangeText={setSavingsOverride}
          keyboardType="decimal-pad"
          placeholder={incomeNum > 0 ? String(Math.round(computed.savingsTarget)) : 'Auto'}
          placeholderTextColor={mutedColor}
        />
        <PrimaryButton title="Save budget" onPress={save} disabled={incomeNum <= 0} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 24 },
  title: { fontSize: 22, fontWeight: '600' },
  subtitle: { fontSize: 14, marginTop: 4, marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16 },
});
