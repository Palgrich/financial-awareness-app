import { Insight } from '../../types';

export const mockInsights: Insight[] = [
  { id: 'i1', title: 'Fees detected', message: '$12 in account fees this month.', severity: 'warn', relatedCategory: 'Fees', ctaLabel: 'Learn', ctaRoute: 'Learn' },
  { id: 'i2', title: 'Subscriptions', message: '$72.95/month recurring.', severity: 'info', relatedCategory: 'Subscriptions', ctaLabel: 'View', ctaRoute: 'Subscriptions' },
  { id: 'i3', title: 'Dining', message: '15% higher than last month.', severity: 'info', relatedCategory: 'Dining', ctaLabel: 'Tips', ctaRoute: 'Learn' },
  { id: 'i4', title: 'Savings', message: '62% toward $2,000 goal.', severity: 'info', ctaLabel: 'Tips', ctaRoute: 'Learn' },
  { id: 'i5', title: 'Recurring', message: '6 active, 1 in trial.', severity: 'info', ctaLabel: 'Manage', ctaRoute: 'Subscriptions' },
  { id: 'i6', title: 'Cash flow', message: 'Income exceeds expenses by $1,200.', severity: 'info' },
];
