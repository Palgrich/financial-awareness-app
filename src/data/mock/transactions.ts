import { Transaction } from '../../types';

const now = new Date();
const iso = (d: Date) => d.toISOString().split('T')[0];

const daysAgo = (n: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d;
};

/** accountIds: boa-checking, boa-savings, chase-credit, chase-checking, ally-savings */
export const mockTransactions: Transaction[] = [
  { id: 't1', date: iso(daysAgo(0)), merchant: 'Whole Foods', category: 'Groceries', amount: 87.42, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't2', date: iso(daysAgo(1)), merchant: 'Netflix', category: 'Entertainment', amount: 15.99, type: 'expense', accountId: 'chase-credit', isRecurring: true },
  { id: 't3', date: iso(daysAgo(1)), merchant: 'ACME Corp', category: 'Income', amount: 3200.0, type: 'income', accountId: 'boa-checking', isRecurring: true },
  { id: 't4', date: iso(daysAgo(2)), merchant: 'Spotify', category: 'Entertainment', amount: 10.99, type: 'expense', accountId: 'chase-credit', isRecurring: true },
  { id: 't5', date: iso(daysAgo(2)), merchant: 'Shell Gas', category: 'Transportation', amount: 52.0, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't6', date: iso(daysAgo(3)), merchant: 'Chipotle', category: 'Dining', amount: 14.25, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't7', date: iso(daysAgo(3)), merchant: 'Planet Fitness', category: 'Health', amount: 24.99, type: 'expense', accountId: 'boa-checking', isRecurring: true },
  { id: 't8', date: iso(daysAgo(4)), merchant: 'Amazon', category: 'Shopping', amount: 34.99, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't9', date: iso(daysAgo(5)), merchant: 'Electric Co', category: 'Utilities', amount: 89.0, type: 'expense', accountId: 'boa-checking', isRecurring: true },
  { id: 't10', date: iso(daysAgo(5)), merchant: 'Starbucks', category: 'Dining', amount: 6.5, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't11', date: iso(daysAgo(6)), merchant: 'Bank Fee', category: 'Fees', amount: 12.0, type: 'expense', accountId: 'boa-checking', isRecurring: false },
  { id: 't12', date: iso(daysAgo(7)), merchant: 'Transfer to Savings', category: 'Transfer', amount: 200.0, type: 'expense', accountId: 'boa-checking', isRecurring: false },
  { id: 't13', date: iso(daysAgo(8)), merchant: 'Trader Joe\'s', category: 'Groceries', amount: 62.3, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't14', date: iso(daysAgo(9)), merchant: 'HBO Max', category: 'Entertainment', amount: 15.99, type: 'expense', accountId: 'chase-credit', isRecurring: true },
  { id: 't15', date: iso(daysAgo(10)), merchant: 'Uber', category: 'Transportation', amount: 18.5, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't16', date: iso(daysAgo(11)), merchant: 'Apple iCloud', category: 'Technology', amount: 2.99, type: 'expense', accountId: 'chase-credit', isRecurring: true },
  { id: 't17', date: iso(daysAgo(12)), merchant: 'Olive Garden', category: 'Dining', amount: 42.0, type: 'expense', accountId: 'chase-checking', isRecurring: false },
  { id: 't18', date: iso(daysAgo(13)), merchant: 'Netflix', category: 'Entertainment', amount: 15.99, type: 'expense', accountId: 'chase-credit', isRecurring: true },
  { id: 't19', date: iso(daysAgo(14)), merchant: 'ACME Corp', category: 'Income', amount: 3200.0, type: 'income', accountId: 'boa-checking', isRecurring: true },
  { id: 't20', date: iso(daysAgo(15)), merchant: 'CVS', category: 'Health', amount: 28.5, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't21', date: iso(daysAgo(16)), merchant: 'Spotify', category: 'Entertainment', amount: 10.99, type: 'expense', accountId: 'chase-credit', isRecurring: true },
  { id: 't22', date: iso(daysAgo(17)), merchant: 'Costco', category: 'Groceries', amount: 125.0, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't23', date: iso(daysAgo(18)), merchant: 'Gym Membership', category: 'Health', amount: 24.99, type: 'expense', accountId: 'boa-checking', isRecurring: true },
  { id: 't24', date: iso(daysAgo(19)), merchant: 'Coffee Shop', category: 'Dining', amount: 5.25, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't25', date: iso(daysAgo(20)), merchant: 'Water Bill', category: 'Utilities', amount: 35.0, type: 'expense', accountId: 'boa-checking', isRecurring: true },
  { id: 't26', date: iso(daysAgo(21)), merchant: 'Amazon Prime', category: 'Shopping', amount: 14.99, type: 'expense', accountId: 'chase-credit', isRecurring: true },
  { id: 't27', date: iso(daysAgo(22)), merchant: 'McDonald\'s', category: 'Dining', amount: 11.0, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't28', date: iso(daysAgo(23)), merchant: 'Gas Station', category: 'Transportation', amount: 48.0, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't29', date: iso(daysAgo(24)), merchant: 'Phone Bill', category: 'Utilities', amount: 75.0, type: 'expense', accountId: 'boa-checking', isRecurring: true },
  { id: 't30', date: iso(daysAgo(25)), merchant: 'Target', category: 'Shopping', amount: 67.0, type: 'expense', accountId: 'chase-checking', isRecurring: false },
  { id: 't31', date: iso(daysAgo(26)), merchant: 'Freelance Payment', category: 'Income', amount: 500.0, type: 'income', accountId: 'boa-checking', isRecurring: false },
  { id: 't32', date: iso(daysAgo(27)), merchant: 'Pizza Hut', category: 'Dining', amount: 22.5, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't33', date: iso(daysAgo(28)), merchant: 'Bank Fee', category: 'Fees', amount: 12.0, type: 'expense', accountId: 'boa-checking', isRecurring: false },
  { id: 't34', date: iso(daysAgo(29)), merchant: 'Netflix', category: 'Entertainment', amount: 15.99, type: 'expense', accountId: 'chase-credit', isRecurring: true },
  { id: 't35', date: iso(daysAgo(29)), merchant: 'Grocery Store', category: 'Groceries', amount: 78.0, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't36', date: iso(daysAgo(28)), merchant: 'Lyft', category: 'Transportation', amount: 15.0, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't37', date: iso(daysAgo(27)), merchant: 'Disney+', category: 'Entertainment', amount: 13.99, type: 'expense', accountId: 'chase-credit', isRecurring: true },
  { id: 't38', date: iso(daysAgo(26)), merchant: 'Transfer to Savings', category: 'Transfer', amount: 150.0, type: 'expense', accountId: 'boa-checking', isRecurring: false },
  { id: 't39', date: iso(daysAgo(25)), merchant: 'Dentist', category: 'Health', amount: 85.0, type: 'expense', accountId: 'chase-credit', isRecurring: false },
  { id: 't40', date: iso(daysAgo(24)), merchant: 'Internet', category: 'Utilities', amount: 60.0, type: 'expense', accountId: 'boa-checking', isRecurring: true },
];
