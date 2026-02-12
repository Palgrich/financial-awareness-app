/**
 * Behavioral insight engine. Deterministic rules from scoped data.
 */

import type { Transaction, Subscription } from '../types';
import type { BehavioralInsight } from './insightTypes';
import { getExpensesForPeriod } from '../domain/spending';
import { getSubscriptionLoadPercent } from '../domain/subscriptions';

export interface InsightScope {
  visibleTransactions: Transaction[];
  visibleSubscriptions: Subscription[];
  monthlyIncome: number;
}

function thisMonthExpenses(transactions: Transaction[]): Transaction[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return transactions.filter((t) => {
    if (t.type !== 'expense') return false;
    const d = new Date(t.date + 'T00:00:00');
    return d.getFullYear() === y && d.getMonth() === m;
  });
}

function lastMonthExpenses(transactions: Transaction[]): Transaction[] {
  const now = new Date();
  now.setMonth(now.getMonth() - 1);
  const y = now.getFullYear();
  const m = now.getMonth();
  return transactions.filter((t) => {
    if (t.type !== 'expense') return false;
    const d = new Date(t.date + 'T00:00:00');
    return d.getFullYear() === y && d.getMonth() === m;
  });
}

function expenseTotal(expenses: Transaction[]): number {
  return expenses.reduce((s, t) => s + Math.abs(t.amount), 0);
}

function categoryTotal(expenses: Transaction[], category: string): number {
  return expenses
    .filter((t) => t.category.toLowerCase().includes(category.toLowerCase()))
    .reduce((s, t) => s + Math.abs(t.amount), 0);
}

/** Returns 1–3 insights, deterministic. */
export function generateInsights(scope: InsightScope): BehavioralInsight[] {
  const results: BehavioralInsight[] = [];
  const { visibleTransactions, visibleSubscriptions, monthlyIncome } = scope;

  const activeSubs = visibleSubscriptions.filter((s) => s.status === 'active' || s.status === 'trial');
  const monthlySubTotal = activeSubs.reduce((sum, s) => sum + s.monthlyCost, 0);
  const subLoadPercent = getSubscriptionLoadPercent(monthlySubTotal, monthlyIncome);

  if (subLoadPercent !== null && subLoadPercent > 10) {
    results.push({
      type: 'high_subscription_load',
      message: `${Math.round(subLoadPercent)}% of income on subscriptions.`,
    });
  }

  const thisMonth = thisMonthExpenses(visibleTransactions);
  const totalExpenses = expenseTotal(thisMonth);
  if (totalExpenses > 0) {
    const diningTotal = categoryTotal(thisMonth, 'dining');
    const diningRatio = (diningTotal / totalExpenses) * 100;
    if (diningRatio > 25) {
      results.push({
        type: 'high_dining_ratio',
        message: `Dining ${Math.round(diningRatio)}% of spending.`,
      });
    }
  }

  const feeTx = visibleTransactions.filter(
    (t) => t.type === 'expense' && t.category.toLowerCase().includes('fee')
  );
  const thisMonthFee = feeTx.filter((t) => {
    const d = new Date(t.date + 'T00:00:00');
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  if (thisMonthFee.length > 0) {
    results.push({
      type: 'fee_detected',
      message: 'Fees detected this month.',
    });
  }

  const thisMonthUtilities = categoryTotal(thisMonth, 'utilities');
  const lastMonth = lastMonthExpenses(visibleTransactions);
  const lastMonthUtilities = categoryTotal(lastMonth, 'utilities');
  if (lastMonthUtilities > 0 && thisMonthUtilities > lastMonthUtilities * 1.1) {
    results.push({
      type: 'rising_utilities',
      message: 'Utilities up vs last month.',
    });
  }

  if (monthlyIncome > 0) {
    const transferTotal = categoryTotal(thisMonth, 'transfer');
    const savingsRate = (transferTotal / monthlyIncome) * 100;
    if (savingsRate > 20) {
      results.push({
        type: 'strong_savings_rate',
        message: `${Math.round(savingsRate)}% of income to savings.`,
      });
    }
  }

  return results.slice(0, 3);
}
