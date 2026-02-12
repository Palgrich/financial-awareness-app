import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { TransactionsStackParamList } from './types';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { TransactionDetailScreen } from '../screens/TransactionDetailScreen';

const Stack = createNativeStackNavigator<TransactionsStackParamList>();

export function TransactionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TransactionsHome" component={TransactionsScreen} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
    </Stack.Navigator>
  );
}
