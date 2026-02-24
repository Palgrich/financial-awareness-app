import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { LearnStackParamList } from './types';
import { LearnScreen } from '../screens/LearnScreen';
import { PathDetailScreen } from '../screens/PathDetailScreen';
import { LessonDetailScreen } from '../screens/LessonDetailScreen';
import { ChallengeDetailScreen } from '../screens/ChallengeDetailScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { QuestSubscriptionCleanseScreen } from '../screens/QuestSubscriptionCleanseScreen';
import { QuestCelebrationScreen } from '../screens/QuestCelebrationScreen';
import { QuickWinScreen } from '../screens/QuickWinScreen';

const Stack = createNativeStackNavigator<LearnStackParamList>();

export function LearnStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LearnHome" component={LearnScreen} />
      <Stack.Screen name="PathDetail" component={PathDetailScreen} />
      <Stack.Screen name="LessonDetail" component={LessonDetailScreen} />
      <Stack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen
        name="QuestSubscriptionCleanse"
        component={QuestSubscriptionCleanseScreen}
        initialParams={{ step: 1 }}
      />
      <Stack.Screen name="QuestCelebration" component={QuestCelebrationScreen} />
      <Stack.Screen name="QuickWin" component={QuickWinScreen} />
    </Stack.Navigator>
  );
}
