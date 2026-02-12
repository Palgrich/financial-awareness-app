import { Subscription } from '../../types';

const now = new Date();
const iso = (d: Date) => d.toISOString().split('T')[0];
const daysAgo = (n: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d;
};

/** accountIds: boa-checking, boa-savings, chase-credit, chase-checking, ally-savings */
export const mockSubscriptions: Subscription[] = [
  { id: 's1', merchant: 'Netflix', monthlyCost: 15.99, lastChargeDate: iso(daysAgo(1)), status: 'active', category: 'Entertainment', accountId: 'chase-credit' },
  { id: 's2', merchant: 'Spotify', monthlyCost: 10.99, lastChargeDate: iso(daysAgo(2)), status: 'active', category: 'Entertainment', accountId: 'chase-credit' },
  { id: 's3', merchant: 'Planet Fitness', monthlyCost: 24.99, lastChargeDate: iso(daysAgo(3)), status: 'active', category: 'Health', accountId: 'boa-checking' },
  { id: 's4', merchant: 'HBO Max', monthlyCost: 15.99, lastChargeDate: iso(daysAgo(9)), status: 'active', category: 'Entertainment', accountId: 'chase-credit' },
  { id: 's5', merchant: 'New App Pro', monthlyCost: 9.99, lastChargeDate: iso(daysAgo(5)), status: 'trial', category: 'Technology', accountId: 'chase-checking' },
  { id: 's6', merchant: 'Old Magazine', monthlyCost: 5.99, lastChargeDate: iso(daysAgo(45)), status: 'cancelled', category: 'Entertainment', accountId: 'ally-savings' },
  { id: 's7', merchant: 'Disney+', monthlyCost: 13.99, lastChargeDate: iso(daysAgo(4)), status: 'active', category: 'Entertainment', accountId: 'chase-credit' },
  { id: 's8', merchant: 'Apple Music', monthlyCost: 10.99, lastChargeDate: iso(daysAgo(12)), status: 'active', category: 'Entertainment', accountId: 'chase-credit' },
  { id: 's9', merchant: 'iCloud+ 200GB', monthlyCost: 2.99, lastChargeDate: iso(daysAgo(11)), status: 'active', category: 'Technology', accountId: 'chase-credit' },
  { id: 's10', merchant: 'Amazon Prime', monthlyCost: 14.99, lastChargeDate: iso(daysAgo(18)), status: 'active', category: 'Shopping', accountId: 'chase-credit' },
  { id: 's11', merchant: 'Adobe Creative Cloud', monthlyCost: 54.99, lastChargeDate: iso(daysAgo(2)), status: 'active', category: 'Technology', accountId: 'boa-checking' },
  { id: 's12', merchant: 'Microsoft 365', monthlyCost: 9.99, lastChargeDate: iso(daysAgo(6)), status: 'active', category: 'Technology', accountId: 'boa-checking' },
  { id: 's13', merchant: 'YouTube Premium', monthlyCost: 13.99, lastChargeDate: iso(daysAgo(20)), status: 'active', category: 'Entertainment', accountId: 'chase-checking' },
  { id: 's14', merchant: 'Dropbox Plus', monthlyCost: 11.99, lastChargeDate: iso(daysAgo(8)), status: 'trial', category: 'Technology', accountId: 'ally-savings' },
  { id: 's15', merchant: 'Headspace', monthlyCost: 12.99, lastChargeDate: iso(daysAgo(25)), status: 'active', category: 'Health', accountId: 'boa-savings' },
  { id: 's16', merchant: 'NYT Digital', monthlyCost: 17.99, lastChargeDate: iso(daysAgo(14)), status: 'active', category: 'Entertainment', accountId: 'boa-checking' },
  { id: 's17', merchant: 'Peloton App', monthlyCost: 44.00, lastChargeDate: iso(daysAgo(3)), status: 'active', category: 'Health', accountId: 'chase-credit' },
  { id: 's18', merchant: 'Audible', monthlyCost: 14.95, lastChargeDate: iso(daysAgo(22)), status: 'cancelled', category: 'Entertainment', accountId: 'chase-credit' },
];
