import { Account } from '../../types';

/** Account ids: boa-checking, boa-savings, chase-credit, chase-checking, ally-savings */
export const mockAccounts: Account[] = [
  { id: 'boa-checking', institutionId: 'inst-boa', name: 'Checking', type: 'checking', balance: 4520.5 },
  { id: 'boa-savings', institutionId: 'inst-boa', name: 'Savings', type: 'savings', balance: 12500.0 },
  { id: 'chase-credit', institutionId: 'inst-chase', name: 'Credit Card', type: 'credit', balance: -892.0 },
  { id: 'chase-checking', institutionId: 'inst-chase', name: 'Checking', type: 'checking', balance: 2100.0 },
  { id: 'ally-savings', institutionId: 'inst-ally', name: 'Savings', type: 'savings', balance: 8400.0 },
];
