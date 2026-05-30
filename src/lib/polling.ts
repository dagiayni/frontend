/**
 * NOTE: With OPTIMIZATION 1 (SSE), polling is no longer used for payment status.
 * This utility remains available for non-SSE use cases (e.g., order list refresh).
 */
export async function pollUntil<T>(
  fn: () => Promise<T>,
  predicate: (result: T) => boolean,
  intervalMs = 10000,
  maxAttempts = 36
): Promise<T | null> {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await fn();
    if (predicate(result)) return result;
    await new Promise(r => setTimeout(r, intervalMs));
  }
  return null;
}
