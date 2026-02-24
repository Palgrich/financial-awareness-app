import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { LearnStackParamList } from '../navigation/types';
import { getStreak } from '../data/learnQuestStorage';

type Route = RouteProp<LearnStackParamList, 'QuestCelebration'>;
type Nav = NativeStackNavigationProp<LearnStackParamList, 'QuestCelebration'>;

export function QuestCelebrationScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { savedAmount, serviceName } = route.params;
  const [streak, setStreak] = React.useState(0);

  useEffect(() => {
    getStreak().then(setStreak);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bg} />
      <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>Nice work!</Text>
        <Text style={styles.saved}>
          +${savedAmount.toFixed(0)} back in your pocket this year
        </Text>
        {serviceName ? (
          <Text style={styles.service}>You cancelled {serviceName}.</Text>
        ) : null}
        <View style={styles.streakPill}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakText}>{streak} day streak</Text>
        </View>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate('LearnHome')}
        >
          <Text style={styles.backBtnText}>Back to Learn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F0F2F7',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  saved: {
    fontSize: 22,
    fontWeight: '600',
    color: '#22C55E',
    marginBottom: 8,
    textAlign: 'center',
  },
  service: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    marginBottom: 32,
  },
  streakEmoji: { fontSize: 18 },
  streakText: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  backBtn: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  backBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
