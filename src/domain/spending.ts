/**
 * Spending breakdown calculations
 */

import type { Transaction } from '../types';

const INSTITUTIONAL_COLORS = [
  '#475569', // slate-600
  '#64748b', // slate-500
  '#94a3b8', // slate-400
  '#64748b',
  '#475569',
  '#94a3b8', // Other
];

export type ChartPeriod = 'this_month' | 'last_30_days';

export function getExpensesForPeriod(
  transactions: Transaction[],
  period: ChartPeriod
): Transaction[] {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  if (period === 'this_month') {
    const y = now.getFullYear();
    const m = now.getMonth();
    return transactions.filter((t) => {
      if (t.type !== 'expense') return false;
      const d = new Date(t.date + 'T00:00:00');
      return d.getFullYear() === y && d.getMonth() === m;
    });
  }

  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  return transactions.filter((t) => {
    if (t.type !== 'expense') return false;
    return t.date >= cutoffStr && t.date <= today;
  });
}

export interface CategoryBreakdown {
  name: string;
  amount: number;
  color: string;
}

export function getCategoryBreakdown(
  expenses: Transaction[],
  topN: number = 5
): { total: number; segments: CategoryBreakdown[] } {
  const byCategory: Record<string, number> = {};
  expenses.forEach((t) => {
    const amount = Math.abs(t.amount);
    byCategory[t.category] = (byCategory[t.category] || 0) + amount;
  });

  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, topN);
  const rest = sorted.slice(topN);
  const restAmount = rest.reduce((s, [, v]) => s + v, 0);
  const total = expenses.reduce((s, t) => s + Math.abs(t.amount), 0);

  const segments: CategoryBreakdown[] = top.map(([name, amount], i) => ({
    name,
    amount,
    color: INSTITUTIONAL_COLORS[i % INSTITUTIONAL_COLORS.length],
  }));

  if (restAmount > 0) {
    segments.push({
      name: 'Other',
      amount: restAmount,
      color: INSTITUTIONAL_COLORS[5],
    });
  }

  return { total, segments };
}
