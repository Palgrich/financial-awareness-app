import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { DashboardStackParamList } from '../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton, SecondaryButton } from '../components';
import { useStore } from '../state/store';
import type { DebtType } from '../types';

const DEBT_TYPES: { value: DebtType; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'mortgage', label: 'Mortgage' },
  { value: 'credit', label: 'Credit' },
  { value: 'auto', label: 'Auto' },
  { value: 'personal', label: 'Personal' },
  { value: 'other', label: 'Other' },
];

type Route = RouteProp<DashboardStackParamList, 'EditDebt'>;

export function EditDebtScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { debtId } = route.params;
  const debts = useStore((s) => s.debts);
  const updateDebt = useStore((s) => s.updateDebt);
  const removeDebt = useStore((s) => s.removeDebt);
  const dark = useStore((s) => s.preferences.darkMode);

  const debt = debts.find((d) => d.id === debtId);

  const [name, setName] = useState('');
  const [type, setType] = useState<DebtType>('credit');
  const [balance, setBalance] = useState('');
  const [apr, setApr] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');
  const [dueDay, setDueDay] = useState('');
  const [status, setStatus] = useState<'active' | 'paused' | 'paid_off'>('active');

  useEffect(() => {
    if (debt) {
      setName(debt.name);
      setType(debt.type);
      setBalance(String(debt.balance));
      setApr(debt.apr != null ? String(debt.apr) : '');
      setMinimumPayment(debt.minimumPayment != null ? String(debt.minimumPayment) : '');
      setDueDay(debt.dueDay != null ? String(debt.dueDay) : '');
      setStatus(debt.status);
    }
  }, [debt]);

  const save = () => {
    if (!debt) return;
    const b = parseFloat(balance);
    if (!name.trim() || isNaN(b) || b < 0) return;
    updateDebt(debtId, {
      name: name.trim(),
      type,
      balance: b,
      apr: apr ? parseFloat(apr) : undefined,
      minimumPayment: minimumPayment ? parseFloat(minimumPayment) : undefined,
      dueDay: dueDay ? Math.min(31, Math.max(1, parseInt(dueDay, 10))) : undefined,
      status,
    });
    navigation.goBack();
  };

  const deleteDebt = () => {
    removeDebt(debtId);
    navigation.goBack();
  };

  if (!debt) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.error}>Debt not found.</Text>
      </View>
    );
  }

  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: dark ? '#0f172a' : '#f8fafc' }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.label, { color: mutedColor }]}>Name</Text>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: dark ? '#475569' : '#e2e8f0' }]}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Chase Credit Card"
          placeholderTextColor={mutedColor}
        />
        <Text style={[styles.label, { color: mutedColor }]}>Type</Text>
        <View style={styles.typeRow}>
          {DEBT_TYPES.map((t) => (
            <View key={t.value} style={[styles.typeChip, type === t.value && styles.typeChipActive, { borderColor: dark ? '#475569' : '#e2e8f0' }]}>
              <Text style={[styles.typeText, { color: type === t.value ? '#2563eb' : textColor }]} onPress={() => setType(t.value)}>
                {t.label}
              </Text>
            </View>
          ))}
        </View>
        <Text style={[styles.label, { color: mutedColor }]}>Balance</Text>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: dark ? '#475569' : '#e2e8f0' }]}
          value={balance}
          onChangeText={setBalance}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={mutedColor}
        />
        <Text style={[styles.label, { color: mutedColor }]}>APR %</Text>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: dark ? '#475569' : '#e2e8f0' }]}
          value={apr}
          onChangeText={setApr}
          keyboardType="decimal-pad"
          placeholder="e.g. 18.5"
          placeholderTextColor={mutedColor}
        />
        <Text style={[styles.label, { color: mutedColor }]}>Minimum payment</Text>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: dark ? '#475569' : '#e2e8f0' }]}
          value={minimumPayment}
          onChangeText={setMinimumPayment}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={mutedColor}
        />
        <Text style={[styles.label, { color: mutedColor }]}>Due day (1–31)</Text>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: dark ? '#475569' : '#e2e8f0' }]}
          value={dueDay}
          onChangeText={setDueDay}
          keyboardType="number-pad"
          placeholder="e.g. 15"
          placeholderTextColor={mutedColor}
        />
        <Text style={[styles.label, { color: mutedColor }]}>Status</Text>
        <View style={styles.statusRow}>
          {(['active', 'paused', 'paid_off'] as const).map((s) => (
            <View key={s} style={[styles.statusChip, status === s && styles.statusChipActive]}>
              <Text style={[styles.statusText, { color: status === s ? '#fff' : textColor }]} onPress={() => setStatus(s)}>
                {s.replace('_', ' ')}
              </Text>
            </View>
          ))}
        </View>
        <PrimaryButton title="Save" onPress={save} disabled={!name.trim()} />
        <SecondaryButton title="Delete debt" onPress={deleteDebt} dark={dark} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 24 },
  label: { fontSize: 14, marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  typeChipActive: { borderColor: '#2563eb' },
  typeText: { fontSize: 14 },
  statusRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  statusChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#e2e8f0' },
  statusChipActive: { backgroundColor: '#2563eb' },
  statusText: { fontSize: 14 },
  error: { padding: 16, textAlign: 'center' },
});
