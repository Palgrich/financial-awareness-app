import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from './types';
import { ProfileScreen } from '../screens/ProfileScreen';
import { DebtsListScreen } from '../screens/DebtsListScreen';
import { AddDebtScreen } from '../screens/AddDebtScreen';
import { EditDebtScreen } from '../screens/EditDebtScreen';
import { BudgetSetupScreen } from '../screens/BudgetSetupScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="DebtsList" component={DebtsListScreen} />
      <Stack.Screen name="AddDebt" component={AddDebtScreen} />
      <Stack.Screen name="EditDebt" component={EditDebtScreen} />
      <Stack.Screen name="BudgetSetup" component={BudgetSetupScreen} />
    </Stack.Navigator>
  );
}
