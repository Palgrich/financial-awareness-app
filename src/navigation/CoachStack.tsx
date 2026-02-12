import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { CoachStackParamList } from './types';
import { CoachScreen } from '../screens/CoachScreen';

const Stack = createNativeStackNavigator<CoachStackParamList>();

export function CoachStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CoachHome" component={CoachScreen} />
    </Stack.Navigator>
  );
}
