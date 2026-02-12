import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, Platform } from 'react-native';
import type { TabParamList } from './types';
import { DashboardStack } from './DashboardStack';
import { TransactionsStack } from './TransactionsStack';
import { BudgetStack } from './BudgetStack';
import { DebtsStack } from './DebtsStack';
import { SubscriptionsStack } from './SubscriptionsStack';
import { CoachStack } from './CoachStack';
import { LearnStack } from './LearnStack';
import { ProfileStack } from './ProfileStack';
import { useStore } from '../state/store';

const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ name, focused, dark }: { name: string; focused: boolean; dark: boolean }) {
  const color = focused ? '#2563eb' : dark ? '#94a3b8' : '#64748b';
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.icon, { color }]}>{name}</Text>
    </View>
  );
}

export function TabNavigator() {
  const dark = useStore((s) => s.preferences.darkMode);
  const tabBarStyle = {
    backgroundColor: dark ? '#1e293b' : '#ffffff',
    borderTopColor: dark ? '#334155' : '#e2e8f0',
  };
  const tabBarActiveTintColor = '#2563eb';
  const tabBarInactiveTintColor = dark ? '#94a3b8' : '#64748b';
  const labelStyle = { fontSize: 11, fontWeight: '500' as const };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { ...styles.tabBar, ...tabBarStyle },
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarLabelStyle: labelStyle,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon name="📊" focused={focused} dark={dark} />,
        }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnStack}
        options={{
          tabBarLabel: 'Learn',
          tabBarIcon: ({ focused }) => <TabIcon name="📚" focused={focused} dark={dark} />,
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsStack}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Subscriptions"
        component={SubscriptionsStack}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Coach"
        component={CoachStack}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetStack}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Debts"
        component={DebtsStack}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    paddingTop: 8,
    height: Platform.OS === 'ios' ? 88 : 64,
  },
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22 },
});
