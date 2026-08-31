/**
 * Subscription awareness calculations (scope = visible data passed in).
 */

import type { Subscription, Transaction, Account } from '../types';

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

export interface RecurringSummary {
  /** Number of distinct recurring merchants. */
  count: number;
  /** Estimated monthly recurring total (one representative charge per merchant). */
  monthly: number;
}

/** Median of the absolute amounts (representative recurring charge for a merchant). */
function representativeAmount(amounts: number[]): number {
  const abs = amounts.map((a) => Math.abs(a)).sort((x, y) => x - y);
  return abs[Math.floor(abs.length / 2)] ?? 0;
}

/** Subscription-like amount window; anything outside is rent/travel/transfers, not a sub. */
const MIN_SUB_AMOUNT = 2;
const MAX_SUB_AMOUNT = 150;

/** Categories that are never consumer subscriptions. */
const EXCLUDED_SUB_CATEGORIES = ['Transfer', 'Travel', 'Loan Payments', 'Income', 'Transport'];

/** Merchants containing one of these need only a single occurrence to count as a sub. */
const SUBSCRIPTION_KEYWORDS = [
  'netflix', 'spotify', 'hulu', 'disney', 'apple', 'google', 'amazon prime',
  'youtube', 'adobe', 'microsoft', 'icloud', 'dropbox', 'gym', 'fitness',
  'planet fitness', 'audible', 'paramount', 'peacock', 'hbo', 'hbo max',
];

function hasSubscriptionKeyword(merchant: string): boolean {
  const m = merchant.toLowerCase();
  return SUBSCRIPTION_KEYWORDS.some((k) => m.includes(k));
}

/** Whole-day distance between two ISO date strings (YYYY-MM-DD). */
function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00').getTime();
  const db = new Date(b + 'T00:00:00').getTime();
  return Math.abs(db - da) / 86400000;
}

/** A gap is subscription-like if it is roughly monthly (25–35d) or weekly (6–8d). */
function isSubscriptionGap(days: number): boolean {
  return (days >= 25 && days <= 35) || (days >= 6 && days <= 8);
}

/**
 * Detect recurring subscription merchants from transaction history.
 * Pre-filters out non-subscription noise (amount window + excluded categories),
 * then keeps a merchant when either:
 *  - its name matches a known subscription keyword (a single charge is enough), or
 *  - it charges 2+ times with near-identical amounts (within 5% or $1) spaced
 *    roughly monthly (25–35 days) or weekly (6–8 days).
 * Returns merchant -> the transactions that qualified.
 */
function detectByRepetition(expenses: Transaction[]): Map<string, Transaction[]> {
  // Group candidate charges by merchant, dropping out-of-range amounts and excluded categories.
  const byMerchant = new Map<string, Transaction[]>();
  for (const t of expenses) {
    if (EXCLUDED_SUB_CATEGORIES.includes(t.category)) continue;
    const amt = Math.abs(t.amount);
    if (amt < MIN_SUB_AMOUNT || amt > MAX_SUB_AMOUNT) continue;
    const key = t.merchant.trim().toLowerCase();
    const arr = byMerchant.get(key) ?? [];
    arr.push(t);
    byMerchant.set(key, arr);
  }

  const recurring = new Map<string, Transaction[]>();
  byMerchant.forEach((txns, key) => {
    const amounts = txns.map((t) => Math.abs(t.amount));

    // Keyword boost: a known subscription merchant needs only one occurrence.
    if (hasSubscriptionKeyword(key)) {
      recurring.set(key, txns);
      return;
    }

    // Otherwise require at least two occurrences.
    if (txns.length < 2) return;

    // Amount consistency: within 5% or $1 (whichever is larger).
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    if (max - min > Math.max(1, min * 0.05)) return;

    // Frequency: at least one adjacent pair spaced weekly or monthly apart.
    const sortedDates = txns.map((t) => t.date).sort();
    let hasSubscriptionCadence = false;
    for (let i = 1; i < sortedDates.length; i++) {
      if (isSubscriptionGap(daysBetween(sortedDates[i - 1], sortedDates[i]))) {
        hasSubscriptionCadence = true;
        break;
      }
    }
    if (!hasSubscriptionCadence) return;

    recurring.set(key, txns);
  });

  return recurring;
}

/**
 * Single source of truth for "which merchants are recurring subscriptions".
 * Primary: transactions explicitly flagged `isRecurring === true` (trusted as-is).
 * Fallback: if none are flagged, the repetition heuristic (detectByRepetition).
 * Both `detectRecurringFromTransactions` and `detectSubscriptionList` use this,
 * so the Progress and Subscriptions screens always agree.
 */
function groupRecurringMerchants(transactions: Transaction[]): Map<string, Transaction[]> {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const flagged = expenses.filter((t) => t.isRecurring === true);
  if (flagged.length > 0) {
    const byMerchant = new Map<string, Transaction[]>();
    for (const t of flagged) {
      const key = t.merchant.trim().toLowerCase();
      const arr = byMerchant.get(key) ?? [];
      arr.push(t);
      byMerchant.set(key, arr);
    }
    return byMerchant;
  }
  return detectByRepetition(expenses);
}

/** Add whole days to an ISO date string (YYYY-MM-DD), returning an ISO date string. */
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Estimate recurring subscriptions from live transactions.
 * Returns one representative (median) charge per merchant summed into `monthly`.
 */
export function detectRecurringFromTransactions(transactions: Transaction[]): RecurringSummary {
  const byMerchant = groupRecurringMerchants(transactions);
  let monthly = 0;
  byMerchant.forEach((txns) => {
    monthly += representativeAmount(txns.map((t) => Math.abs(t.amount)));
  });
  return { count: byMerchant.size, monthly: Math.round(monthly * 100) / 100 };
}

export interface SubscriptionListItem {
  id: string;
  merchant: string;
  monthlyAmount: number;
  accountName: string;
  accountType: string;
  lastChargeDate: string;
  /** Estimated next charge = last charge + 30 days. */
  nextChargeDate: string;
  category: string;
}

/**
 * Full recurring-subscription list for the Subscriptions screen.
 * Uses the exact same recurring detection as `detectRecurringFromTransactions`,
 * then enriches each merchant with account name/type (via `accounts`) and dates.
 */
export function detectSubscriptionList(
  transactions: Transaction[],
  accounts: Account[]
): SubscriptionListItem[] {
  const byMerchant = groupRecurringMerchants(transactions);
  const accountById = new Map<string, Account>();
  accounts.forEach((a) => accountById.set(a.id, a));

  const items: SubscriptionListItem[] = [];
  byMerchant.forEach((txns) => {
    // Latest charge represents the subscription (name, account, dates, category).
    const sorted = [...txns].sort((a, b) => a.date.localeCompare(b.date));
    const latest = sorted[sorted.length - 1];
    const account = accountById.get(latest.accountId);
    const monthlyAmount = Math.round(representativeAmount(txns.map((t) => Math.abs(t.amount))) * 100) / 100;
    items.push({
      id: latest.id,
      merchant: latest.merchant,
      monthlyAmount,
      accountName: account?.name ?? 'Unknown',
      accountType: account?.type ?? 'unknown',
      lastChargeDate: latest.date,
      nextChargeDate: addDays(latest.date, 30),
      category: latest.category,
    });
  });
  return items;
}
