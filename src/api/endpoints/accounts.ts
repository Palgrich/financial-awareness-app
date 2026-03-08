import { mockAccounts } from '../../data/mock';
import { apiDelay, fetchJson } from '../client';
import { USE_MOCK_API } from '../config';
import type { Account } from '../../types';

export const getAccounts = async (): Promise<Account[]> => {
  if (USE_MOCK_API) {
    await apiDelay(300);
    return [...mockAccounts];
  }
  return fetchJson<Account[]>('/accounts');
};
