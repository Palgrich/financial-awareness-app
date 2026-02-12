/**
 * Mock API layer: simulates network delay and returns data.
 * No backend; all data is from mock modules or passed state.
 */

const MOCK_DELAY_MS = 700;

function delay(ms: number = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockFetch<T>(data: T, delayMs: number = MOCK_DELAY_MS): Promise<T> {
  await delay(delayMs);
  return data;
}

export async function mockFetchWithDelay<T>(fn: () => T, delayMs: number = 400): Promise<T> {
  await delay(delayMs);
  return fn();
}
