import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, PrimaryButton, SecondaryButton } from '../components';
import { useStore } from '../state/store';
import type { LearnStackParamList } from '../navigation/types';

type Route = RouteProp<LearnStackParamList, 'ChallengeDetail'>;

export function ChallengeDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { challengeId } = route.params;
  const challenges = useStore((s) => s.challenges);
  const setChallengeStatus = useStore((s) => s.setChallengeStatus);
  const dark = useStore((s) => s.preferences.darkMode);

  const challenge = challenges.find((c) => c.id === challengeId);

  if (!challenge) {
    return (
      <SafeAreaView style={[styles.container, dark && styles.containerDark]}>
        <Text style={[styles.error, { color: dark ? '#94a3b8' : '#64748b' }]}>Challenge not found.</Text>
      </SafeAreaView>
    );
  }

  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';

  return (
    <SafeAreaView style={[styles.container, dark && styles.containerDark]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{challenge.title}</Text>
        <Text style={[styles.difficulty, { color: mutedColor }]}>{challenge.difficulty}</Text>
      </View>
      <Card dark={dark} style={styles.card}>
        <Text style={[styles.desc, { color: mutedColor }]}>{challenge.description}</Text>
        <View style={styles.reward}>
          <Text style={[styles.rewardLabel, { color: mutedColor }]}>Reward</Text>
          <Text style={[styles.rewardText, { color: textColor }]}>{challenge.rewardText}</Text>
        </View>
      </Card>
      <View style={styles.actions}>
        {challenge.status === 'todo' && (
          <PrimaryButton
            title="Start challenge"
            onPress={() => {
              setChallengeStatus(challengeId, 'in_progress');
              navigation.goBack();
            }}
          />
        )}
        {challenge.status === 'in_progress' && (
          <>
            <PrimaryButton
              title="Mark as done"
              onPress={() => {
                setChallengeStatus(challengeId, 'done');
                navigation.goBack();
              }}
            />
            <View style={{ height: 12 }} />
            <SecondaryButton title="Back" onPress={() => navigation.goBack()} dark={dark} />
          </>
        )}
        {challenge.status === 'done' && (
          <SecondaryButton title="Back" onPress={() => navigation.goBack()} dark={dark} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  containerDark: { backgroundColor: '#0f172a' },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '600' },
  difficulty: { fontSize: 14, marginTop: 4, textTransform: 'capitalize' },
  card: { marginBottom: 24 },
  desc: { fontSize: 15 },
  reward: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  rewardLabel: { fontSize: 12 },
  rewardText: { fontSize: 16, fontWeight: '500', marginTop: 4 },
  actions: { marginTop: 8 },
  error: { padding: 16 },
});
