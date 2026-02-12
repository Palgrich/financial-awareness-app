/**
 * Financial Clarity score (0–100). Scope = visible data.
 */

import type { Account, Institution, Subscription, Transaction } from '../types';
import { getSubscriptionLoadPercent } from '../domain/subscriptions';

export interface ClarityScope {
  institutions: Institution[];
  accounts: Account[];
  visibleAccountIds: Set<string>;
  subscriptions: Subscription[];
  visibleTransactions: Transaction[];
  monthlyIncome: number;
}

export interface FinancialClarityResult {
  score: number;
  breakdown: {
    visibility: number;
    behavior: number;
    stability: number;
  };
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

export function calculateFinancialClarity(scope: ClarityScope): FinancialClarityResult {
  const {
    institutions,
    accounts,
    visibleAccountIds,
    subscriptions,
    visibleTransactions,
    monthlyIncome,
  } = scope;

  let visibility = 0;
  let behavior = 0;
  let stability = 0;

  const visibleAccounts = accounts.filter((a) => visibleAccountIds.has(a.id));
  const visibleInstitutionIds = new Set(visibleAccounts.map((a) => a.institutionId));
  const visibleSubs = subscriptions.filter((s) => visibleAccountIds.has(s.accountId));
  const activeSubs = visibleSubs.filter((s) => s.status === 'active' || s.status === 'trial');

  if (visibleInstitutionIds.size >= 2) visibility += 20;
  if (activeSubs.length > 0) visibility += 20;

  const monthlySubTotal = activeSubs.reduce((sum, s) => sum + s.monthlyCost, 0);
  const subLoadPercent = getSubscriptionLoadPercent(monthlySubTotal, monthlyIncome);
  const savingsRate =
    monthlyIncome > 0
      ? (categoryTotal(visibleTransactions, 'transfer') / monthlyIncome) * 100
      : 0;
  if (savingsRate > 10) behavior += 20;

  const expenses = thisMonthExpenses(visibleTransactions);
  const expenseTotal = expenses.reduce((s, t) => s + Math.abs(t.amount), 0);
  const feeTotal = expenses
    .filter((t) => t.category.toLowerCase().includes('fee'))
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  const feePercent = expenseTotal > 0 ? (feeTotal / expenseTotal) * 100 : 0;
  if (feePercent < 2) stability += 20;

  const incomeThisMonth = visibleTransactions
    .filter((t) => t.type === 'income')
    .filter((t) => {
      const d = new Date(t.date + 'T00:00:00');
      const now = new Date();
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((s, t) => s + t.amount, 0);
  const expenseSum = expenses.reduce((s, t) => s + Math.abs(t.amount), 0);
  const negativeCashFlow = incomeThisMonth < expenseSum;
  if (!negativeCashFlow) stability += 20;

  const score = Math.min(100, Math.max(0, visibility + behavior + stability));
  return {
    score,
    breakdown: { visibility, behavior, stability },
  };
}

function categoryTotal(transactions: Transaction[], category: string): number {
  return transactions
    .filter((t) => t.type === 'expense' && t.category.toLowerCase().includes(category.toLowerCase()))
    .reduce((s, t) => s + Math.abs(t.amount), 0);
}

/** Label for clarity score: Strong (80+), Moderate (50–79), Needs attention (<50). */
export function getClarityLabel(score: number): string {
  if (score >= 80) return 'Strong';
  if (score >= 50) return 'Moderate';
  return 'Needs attention';
}

/** One-line subtext for the clarity card. */
export function getClaritySubtext(
  result: FinancialClarityResult,
  subscriptionLoadPercent: number | null
): string {
  if (result.score >= 80) return 'Strong visibility and stability.';
  if (subscriptionLoadPercent !== null && subscriptionLoadPercent > 10) {
    return 'Reduce subscription load to improve.';
  }
  if (result.breakdown.visibility < 40) return 'Connect more accounts for better visibility.';
  if (result.breakdown.stability < 40) return 'Improve cash flow or reduce fees to improve.';
  return 'Good visibility. Review spending to improve.';
}
