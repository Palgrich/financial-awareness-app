import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import type { DashboardStackParamList } from '../navigation/types';
import { useProgressStore } from '../state/progressStore';
import { colors } from '../theme/tokens';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'ProgressSubscriptionList'>;

export function ProgressSubscriptionListScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const userData = useProgressStore((s) => s.userData);
  const setSubscriptionKeep = useProgressStore((s) => s.setSubscriptionKeep);
  const applySubscriptionCuts = useProgressStore((s) => s.applySubscriptionCuts);

  const toCut = useMemo(
    () => userData.subscriptions.filter((s) => s.keep === false).map((s) => s.name),
    [userData.subscriptions]
  );
  const savedMonthly = useMemo(
    () =>
      userData.subscriptions
        .filter((s) => s.keep === false)
        .reduce((sum, s) => sum + s.price, 0),
    [userData.subscriptions]
  );

  const handleApply = () => {
    if (toCut.length > 0) applySubscriptionCuts(toCut);
    navigation.goBack();
    (navigation.getParent() as any)?.navigate('Learn', {
      screen: 'QuestCelebration',
      params: { savedAmount: Math.round(savedMonthly * 12 * 100) / 100 },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscriptions</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {userData.subscriptions.map((sub) => (
          <View key={sub.name} style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.name}>{sub.name}</Text>
              <Text style={styles.meta}>
                ${sub.price.toFixed(2)}/month · {sub.lastUsed}
              </Text>
            </View>
            <View style={styles.actions}>
              <Pressable
                style={[
                  styles.toggleBtn,
                  sub.keep === true && styles.toggleKeep,
                ]}
                onPress={() =>
                  setSubscriptionKeep(sub.name, sub.keep === true ? null : true)
                }
              >
                <Text
                  style={[
                    styles.toggleText,
                    sub.keep === true && styles.toggleTextKeep,
                  ]}
                >
                  Keep
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.toggleBtn,
                  sub.keep === false && styles.toggleCut,
                ]}
                onPress={() =>
                  setSubscriptionKeep(sub.name, sub.keep === false ? null : false)
                }
              >
                <Text
                  style={[
                    styles.toggleText,
                    sub.keep === false && styles.toggleTextCut,
                  ]}
                >
                  Cut
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {toCut.length} marked to cut · saves ${savedMonthly.toFixed(2)}/month
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.cta, toCut.length === 0 && styles.ctaDisabled]}
          onPress={handleApply}
          disabled={toCut.length === 0}
        >
          <Text style={styles.ctaText}>Apply changes →</Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  rowLeft: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  meta: { fontSize: 13, color: colors.text.muted, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8 },
  toggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  toggleKeep: { backgroundColor: 'rgba(34, 197, 94, 0.15)' },
  toggleCut: { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
  toggleText: { fontSize: 14, fontWeight: '600', color: colors.text.secondary },
  toggleTextKeep: { color: colors.status.good },
  toggleTextCut: { color: colors.status.high },
  summary: { marginTop: 16, marginBottom: 24 },
  summaryText: { fontSize: 15, color: colors.text.muted },
  cta: {
    backgroundColor: colors.accent.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaDisabled: { backgroundColor: colors.text.muted, opacity: 0.7 },
  ctaText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
