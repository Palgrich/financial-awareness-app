import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SubscriptionsStackParamList } from './types';
import { SubscriptionsScreen } from '../screens/SubscriptionsScreen';
import { SubscriptionDetailScreen } from '../screens/SubscriptionDetailScreen';

const Stack = createNativeStackNavigator<SubscriptionsStackParamList>();

export function SubscriptionsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
      }}
    >
      <Stack.Screen name="SubscriptionsHome" component={SubscriptionsScreen} />
      <Stack.Screen name="SubscriptionDetail" component={SubscriptionDetailScreen} />
    </Stack.Navigator>
  );
}
