import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { LearnStackParamList } from './types';
import { LearnScreen } from '../screens/LearnScreen';
import { LessonDetailScreen } from '../screens/LessonDetailScreen';
import { ChallengeDetailScreen } from '../screens/ChallengeDetailScreen';

const Stack = createNativeStackNavigator<LearnStackParamList>();

export function LearnStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LearnHome" component={LearnScreen} />
      <Stack.Screen name="LessonDetail" component={LessonDetailScreen} />
      <Stack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
    </Stack.Navigator>
  );
}
