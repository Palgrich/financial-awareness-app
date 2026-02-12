import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Switch, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppHeader, AppHeaderDark, Card, SectionTitle, PrimaryButton, SecondaryButton } from '../components';
import { useStore } from '../state/store';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const preferences = useStore((s) => s.preferences);
  const setPreferences = useStore((s) => s.setPreferences);
  const resetDemoData = useStore((s) => s.resetDemoData);
  const dark = useStore((s) => s.preferences.darkMode);
  const navigation = useNavigation<any>();

  const [income, setIncome] = useState(String(preferences.monthlyIncome));
  const [savingsGoal, setSavingsGoal] = useState(String(preferences.savingsGoal));
  const dailyGoalMinutes = useStore((s) => s.dailyGoalMinutes);
  const setDailyGoalMinutes = useStore((s) => s.setDailyGoalMinutes);
  const [dailyGoal, setDailyGoal] = useState(String(dailyGoalMinutes));
  useEffect(() => setDailyGoal(String(dailyGoalMinutes)), [dailyGoalMinutes]);

  const saveNumbers = () => {
    const i = parseFloat(income);
    const s = parseFloat(savingsGoal);
    const d = parseInt(dailyGoal, 10);
    if (!Number.isNaN(i) && i >= 0) setPreferences({ monthlyIncome: i });
    if (!Number.isNaN(s) && s >= 0) setPreferences({ savingsGoal: s });
    if (!Number.isNaN(d) && d >= 1) setDailyGoalMinutes(d);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset demo data',
      'This will restore all transactions, subscriptions, and progress to the original demo state. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => resetDemoData() },
      ]
    );
  };

  const Header = dark ? AppHeaderDark : AppHeader;
  const bg = dark ? '#0f172a' : '#f8fafc';
  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: bg }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header title="Profile" subtitle="Settings and data" />

        <SectionTitle title="Preferences" dark={dark} />
        <Card dark={dark} style={styles.card}>
          <Text style={[styles.label, { color: mutedColor }]}>Currency</Text>
          <Text style={[styles.value, { color: textColor }]}>{preferences.currency}</Text>
        </Card>
        <Card dark={dark} style={styles.card}>
          <Text style={[styles.label, { color: mutedColor }]}>Monthly income (for coaching)</Text>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: dark ? '#475569' : '#e2e8f0' }]}
            value={income}
            onChangeText={setIncome}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={mutedColor}
            onBlur={saveNumbers}
          />
        </Card>
        <Card dark={dark} style={styles.card}>
          <Text style={[styles.label, { color: mutedColor }]}>Savings goal</Text>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: dark ? '#475569' : '#e2e8f0' }]}
            value={savingsGoal}
            onChangeText={setSavingsGoal}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={mutedColor}
            onBlur={saveNumbers}
          />
        </Card>
        <Card dark={dark} style={styles.card}>
          <Text style={[styles.label, { color: mutedColor }]}>Daily learn goal (min)</Text>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: dark ? '#475569' : '#e2e8f0' }]}
            value={dailyGoal}
            onChangeText={setDailyGoal}
            keyboardType="number-pad"
            placeholder="5"
            placeholderTextColor={mutedColor}
            onBlur={saveNumbers}
          />
        </Card>
        <Card dark={dark} style={styles.card}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: textColor }]}>Dark mode</Text>
            <Switch
              value={preferences.darkMode}
              onValueChange={(v) => setPreferences({ darkMode: v })}
              trackColor={{ false: '#cbd5e1', true: '#2563eb' }}
              thumbColor="#fff"
            />
          </View>
        </Card>

        <SectionTitle title="Budget" dark={dark} />
        <Card dark={dark} style={styles.card} onPress={() => navigation.navigate('BudgetSetup')}>
          <Text style={[styles.label, { color: mutedColor }]}>50/30/20 budget setup</Text>
          <Text style={[styles.value, { color: textColor }]}>Set up →</Text>
        </Card>

        <SectionTitle title="Debts" dark={dark} />
        <Card dark={dark} style={styles.card} onPress={() => navigation.navigate('DebtsList')}>
          <Text style={[styles.label, { color: mutedColor }]}>Track and manage debt</Text>
          <Text style={[styles.value, { color: textColor }]}>View debts →</Text>
        </Card>

        <SectionTitle title="Data" dark={dark} />
        <SecondaryButton title="Reset demo data" onPress={handleReset} dark={dark} />

        <SectionTitle title="About" dark={dark} />
        <Card dark={dark} style={styles.card}>
          <Text style={[styles.disclaimer, { color: mutedColor }]}>
            This app is for education only. It does not provide financial, legal, or tax advice. Use sample data only; no real bank connections.
          </Text>
        </Card>

        <View style={styles.fakeConnect}>
          <PrimaryButton
            title="Connect bank"
            onPress={() => Alert.alert('Demo mode', 'Using sample data. No real bank connection.')}
          />
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  card: { marginHorizontal: 16, marginBottom: 8 },
  label: { fontSize: 14, marginBottom: 4 },
  value: { fontSize: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  disclaimer: { fontSize: 13 },
  fakeConnect: { marginTop: 16, marginHorizontal: 16 },
});
