import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DashboardStackParamList } from './types';
import { ProgressScreen } from '../screens/ProgressScreen';
import { TransactionDetailScreen } from '../screens/TransactionDetailScreen';
import { TransactionsByCategoryScreen } from '../screens/TransactionsByCategoryScreen';
import { SubscriptionsScreen } from '../screens/SubscriptionsScreen';
import { SubscriptionDetailScreen } from '../screens/SubscriptionDetailScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { CoachScreen } from '../screens/CoachScreen';
import { BudgetSetupScreen } from '../screens/BudgetSetupScreen';
import { DebtsListScreen } from '../screens/DebtsListScreen';
import { AddDebtScreen } from '../screens/AddDebtScreen';
import { EditDebtScreen } from '../screens/EditDebtScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { HealthBreakdownScreen } from '../screens/HealthBreakdownScreen';
import { PaycheckBreakdownScreen } from '../screens/PaycheckBreakdownScreen';
import { ProgressSubscriptionListScreen } from '../screens/ProgressSubscriptionListScreen';
import { CreditCardDetailsScreen } from '../screens/CreditCardDetailsScreen';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={ProgressScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="SubscriptionsHome" component={SubscriptionsScreen} />
      <Stack.Screen name="SubscriptionDetail" component={SubscriptionDetailScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="CoachHome" component={CoachScreen} />
      <Stack.Screen name="TransactionsHome" component={TransactionsScreen} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
      <Stack.Screen name="TransactionsByCategory" component={TransactionsByCategoryScreen} />
      <Stack.Screen name="BudgetSetup" component={BudgetSetupScreen} />
      <Stack.Screen name="DebtsList" component={DebtsListScreen} />
      <Stack.Screen name="AddDebt" component={AddDebtScreen} />
      <Stack.Screen name="EditDebt" component={EditDebtScreen} />
      <Stack.Screen name="HealthBreakdown" component={HealthBreakdownScreen} />
      <Stack.Screen name="PaycheckBreakdown" component={PaycheckBreakdownScreen} />
      <Stack.Screen name="ProgressSubscriptionList" component={ProgressSubscriptionListScreen} />
      <Stack.Screen name="CreditCardDetails" component={CreditCardDetailsScreen} />
    </Stack.Navigator>
  );
}
