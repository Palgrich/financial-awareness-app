import type { Debt } from '../types';

export function getTotalDebt(debts: Debt[]): number {
  return debts
    .filter((d) => d.status !== 'paid_off')
    .reduce((s, d) => s + d.balance, 0);
}

export function getNextPayment(debts: Debt[]): { name: string; amount: number; dueDay: number } | undefined {
  const active = debts.filter(
    (d) => d.status === 'active' && d.dueDay != null && (d.minimumPayment ?? 0) > 0
  );
  if (active.length === 0) return undefined;

  const now = new Date();
  const day = now.getDate();

  const sorted = active
    .map((d) => ({
      name: d.name,
      amount: d.minimumPayment ?? 0,
      dueDay: d.dueDay!,
    }))
    .filter((x) => x.amount > 0)
    .sort((a, b) => {
      const distA = a.dueDay >= day ? a.dueDay - day : 30 - day + a.dueDay;
      const distB = b.dueDay >= day ? b.dueDay - day : 30 - day + b.dueDay;
      return distA - distB;
    });

  return sorted[0];
}
