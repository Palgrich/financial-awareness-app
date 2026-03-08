import { mockTransactions } from '../../data/mock';
import { apiDelay, fetchJson } from '../client';
import { USE_MOCK_API } from '../config';
import type { Transaction } from '../../types';

export const getTransactions = async (): Promise<Transaction[]> => {
  if (USE_MOCK_API) {
    await apiDelay(300);
    return [...mockTransactions];
  }
  return fetchJson<Transaction[]>('/transactions');
};
