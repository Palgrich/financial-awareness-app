import { mockMetrics } from '../../data/mocks';
import { apiDelay, fetchJson } from '../client';
import { USE_MOCK_API } from '../config';
import type { MetricSnapshot } from '../../types/domain';

export const getMetrics = async (): Promise<MetricSnapshot> => {
  if (USE_MOCK_API) {
    await apiDelay(350);
    return mockMetrics;
  }
  const data = await fetchJson<MetricSnapshot>('/metrics');
  return data;
};
