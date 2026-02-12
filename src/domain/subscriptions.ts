/**
 * Subscription awareness calculations (scope = visible data passed in).
 */

import type { Subscription } from '../types';

/** Annual cost = monthly total (active + trial) × 12 */
export function getAnnualSubscriptionCost(subscriptions: Subscription[]): number {
  const active = subscriptions.filter((s) => s.status === 'active' || s.status === 'trial');
  const monthly = active.reduce((sum, s) => sum + s.monthlyCost, 0);
  return monthly * 12;
}

/** Load % = (monthly subscriptions / monthly income) × 100. Returns null if income is 0. */
export function getSubscriptionLoadPercent(
  monthlySubscriptionTotal: number,
  monthlyIncome: number
): number | null {
  if (monthlyIncome <= 0) return null;
  return (monthlySubscriptionTotal / monthlyIncome) * 100;
}
