import type { Transaction, Budget } from '../types';

const NEEDS_CATEGORIES = ['rent', 'utilities', 'groceries', 'transportation', 'health', 'fees'];
const WANTS_CATEGORIES = ['dining', 'entertainment', 'shopping'];
const SAVINGS_CATEGORIES = ['transfer'];

function matchesBucket(category: string, bucket: 'needs' | 'wants' | 'savings'): boolean {
  const c = category.toLowerCase();
  if (bucket === 'needs') return NEEDS_CATEGORIES.some((n) => c.includes(n));
  if (bucket === 'wants') return WANTS_CATEGORIES.some((w) => c.includes(w));
  if (bucket === 'savings') return SAVINGS_CATEGORIES.some((s) => c.includes(s));
  return false;
}

export function getBudgetUsage(
  transactions: Transaction[],
  budget: Budget,
  year: number,
  month: number
): { needs: number; wants: number; savings: number } {
  const filtered = transactions.filter((t) => {
    if (t.type !== 'expense') return false;
    const d = new Date(t.date + 'T00:00:00');
    return d.getFullYear() === year && d.getMonth() === month;
  });

  let needs = 0;
  let wants = 0;
  let savings = 0;

  filtered.forEach((t) => {
    if (matchesBucket(t.category, 'needs')) needs += t.amount;
    else if (matchesBucket(t.category, 'wants')) wants += t.amount;
    else if (matchesBucket(t.category, 'savings')) savings += t.amount;
  });

  return { needs, wants, savings };
}

export function computeBudget(monthlyIncome: number): Budget {
  return {
    monthlyIncome,
    needsTarget: monthlyIncome * 0.5,
    wantsTarget: monthlyIncome * 0.3,
    savingsTarget: monthlyIncome * 0.2,
  };
}
