import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { PrimaryButton } from '../components';
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

export function AddDebtScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const addDebt = useStore((s) => s.addDebt);
  const dark = useStore((s) => s.preferences.darkMode);

  const [name, setName] = useState('');
  const [type, setType] = useState<DebtType>('credit');
  const [balance, setBalance] = useState('');
  const [apr, setApr] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');
  const [dueDay, setDueDay] = useState('');

  const save = () => {
    const b = parseFloat(balance);
    if (!name.trim() || isNaN(b) || b < 0) return;
    addDebt({
      name: name.trim(),
      type,
      balance: b,
      apr: apr ? parseFloat(apr) : undefined,
      minimumPayment: minimumPayment ? parseFloat(minimumPayment) : undefined,
      dueDay: dueDay ? Math.min(31, Math.max(1, parseInt(dueDay, 10))) : undefined,
      status: 'active',
    });
    navigation.goBack();
  };

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
            <View
              key={t.value}
              style={[
                styles.typeChip,
                type === t.value && styles.typeChipActive,
                { borderColor: dark ? '#475569' : '#e2e8f0' },
              ]}
            >
              <Text
                style={[styles.typeText, { color: type === t.value ? '#2563eb' : textColor }]}
                onPress={() => setType(t.value)}
              >
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
        <Text style={[styles.label, { color: mutedColor }]}>APR % (optional)</Text>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: dark ? '#475569' : '#e2e8f0' }]}
          value={apr}
          onChangeText={setApr}
          keyboardType="decimal-pad"
          placeholder="e.g. 18.5"
          placeholderTextColor={mutedColor}
        />
        <Text style={[styles.label, { color: mutedColor }]}>Minimum payment (optional)</Text>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: dark ? '#475569' : '#e2e8f0' }]}
          value={minimumPayment}
          onChangeText={setMinimumPayment}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={mutedColor}
        />
        <Text style={[styles.label, { color: mutedColor }]}>Due day of month (1–31, optional)</Text>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: dark ? '#475569' : '#e2e8f0' }]}
          value={dueDay}
          onChangeText={setDueDay}
          keyboardType="number-pad"
          placeholder="e.g. 15"
          placeholderTextColor={mutedColor}
        />
        <PrimaryButton title="Save" onPress={save} disabled={!name.trim()} />
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
});
