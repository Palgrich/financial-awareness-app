import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { BudgetStackParamList } from './types';
import { BudgetScreen } from '../screens/BudgetScreen';

const Stack = createNativeStackNavigator<BudgetStackParamList>();

export function BudgetStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BudgetHome" component={BudgetScreen} />
    </Stack.Navigator>
  );
}
