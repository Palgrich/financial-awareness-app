import { fetchJson } from '../client';

export const checkHealth = async (): Promise<{ status: string }> => {
  return fetchJson('/health');
};
