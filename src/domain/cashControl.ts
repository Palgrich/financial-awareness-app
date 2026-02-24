/**
 * Cash Control: expenses (this month) + balance (current) with MoM deltas.
 * Used for the combined "Cash Control" card on the Progress screen.
 */

import type { Transaction, Account } from '../types';

/** Expenses for the current calendar month (expense transactions only). */
export function getThisMonthExpenses(transactions: Transaction[]): number {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return transactions
    .filter((t) => {
      if (t.type !== 'expense') return false;
      const d = new Date(t.date + 'T00:00:00');
      return d.getFullYear() === y && d.getMonth() === m;
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

/** Expenses for the previous calendar month. */
export function getLastMonthExpenses(transactions: Transaction[]): number {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const lastMonth = m === 0 ? 11 : m - 1;
  const lastYear = m === 0 ? y - 1 : y;
  return transactions
    .filter((t) => {
      if (t.type !== 'expense') return false;
      const d = new Date(t.date + 'T00:00:00');
      return d.getFullYear() === lastYear && d.getMonth() === lastMonth;
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

/** Available cash = sum of checking + savings balances. */
export function getCurrentBalance(accounts: Account[]): number {
  const cash = accounts.filter(
    (a) => a.type === 'checking' || a.type === 'savings'
  );
  return cash.reduce((sum, a) => sum + a.balance, 0);
}

/**
 * Estimate last month's balance when no history exists.
 * Replace with real balance history when available.
 */
export function estimateLastMonthBalance(currentBalance: number): number {
  if (currentBalance === 0) return 0;
  return currentBalance * 0.92;
}

/** MoM percent change; returns null if base is 0 (avoid div by zero). */
export function monthOverMonthPercent(
  current: number,
  previous: number
): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export type CashControlStatus = 'good' | 'moderate' | 'high';

/**
 * Status rules:
 * - high: expenses increased >10% MoM AND balance decreased
 * - moderate: expenses increased >10% MoM OR balance decreased
 * - good: else
 */
export function getCashControlStatus(
  expensesChangePct: number | null,
  balanceChangePct: number | null
): CashControlStatus {
  const expensesUp = expensesChangePct !== null && expensesChangePct > 10;
  const balanceDown = balanceChangePct !== null && balanceChangePct < 0;

  if (expensesUp && balanceDown) return 'high';
  if (expensesUp || balanceDown) return 'moderate';
  return 'good';
}

/**
 * Combined score for the single progress bar.
 * Score = clamp(50 + (balanceChangePct * 0.8) - (expensesChangePct * 0.8), 0, 100).
 * Higher balance change and lower expense change = better score.
 */
export function getCashControlCombinedScore(
  expensesChangePct: number | null,
  balanceChangePct: number | null
): number {
  const exp = expensesChangePct ?? 0;
  const bal = balanceChangePct ?? 0;
  const raw = 50 + bal * 0.8 - exp * 0.8;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

/** Map 0–100 score to 1–5 segments (same as Progress screen). */
export function scoreToFilledSegments(score: number): number {
  if (score <= 20) return 1;
  if (score <= 40) return 2;
  if (score <= 60) return 3;
  if (score <= 80) return 4;
  return 5;
}

export interface CashControlData {
  expensesThisMonth: number;
  expensesLastMonth: number;
  expensesChangePct: number | null;
  balanceCurrent: number;
  balanceLastMonth: number;
  balanceChangePct: number | null;
  status: CashControlStatus;
  combinedScore: number;
  filledSegments: number;
}

export function getCashControlData(
  transactions: Transaction[],
  accounts: Account[]
): CashControlData {
  const expensesThisMonth = getThisMonthExpenses(transactions);
  const expensesLastMonth = getLastMonthExpenses(transactions);
  const expensesChangePct = monthOverMonthPercent(
    expensesThisMonth,
    expensesLastMonth
  );

  const balanceCurrent = getCurrentBalance(accounts);
  const balanceLastMonth = estimateLastMonthBalance(balanceCurrent);
  const balanceChangePct = monthOverMonthPercent(
    balanceCurrent,
    balanceLastMonth
  );

  const status = getCashControlStatus(expensesChangePct, balanceChangePct);
  const combinedScore = getCashControlCombinedScore(
    expensesChangePct,
    balanceChangePct
  );
  const filledSegments = scoreToFilledSegments(combinedScore);

  return {
    expensesThisMonth,
    expensesLastMonth,
    expensesChangePct,
    balanceCurrent,
    balanceLastMonth,
    balanceChangePct,
    status,
    combinedScore,
    filledSegments,
  };
}
