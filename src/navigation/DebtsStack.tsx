import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DebtsStackParamList } from './types';
import { DebtsScreen } from '../screens/DebtsScreen';

const Stack = createNativeStackNavigator<DebtsStackParamList>();

export function DebtsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DebtsHome" component={DebtsScreen} />
    </Stack.Navigator>
  );
}
