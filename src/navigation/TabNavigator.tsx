import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { TabParamList } from './types';
import { DashboardStack } from './DashboardStack';
import { TransactionsStack } from './TransactionsStack';
import { BudgetStack } from './BudgetStack';
import { DebtsStack } from './DebtsStack';
import { SubscriptionsStack } from './SubscriptionsStack';
import { CoachStack } from './CoachStack';
import { LearnStack } from './LearnStack';
import { ProfileStack } from './ProfileStack';
import { LiquidGlassTabBar } from '../components/LiquidGlassTabBar';

const Tab = createBottomTabNavigator<TabParamList>();

/** Height reported to useBottomTabBarHeight: bar content + bottom padding + typical safe area so content is never covered. */
const TAB_BAR_REPORTED_HEIGHT = 82 + 12 + 34;

export function TabNavigator() {
  const tabBarStyle = {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    bottom: 0,
    height: TAB_BAR_REPORTED_HEIGHT,
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: 'transparent',
    backgroundColor: 'transparent',
  };

  return (
    <Tab.Navigator
      tabBar={(props) => <LiquidGlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Learn" component={LearnStack} />
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
