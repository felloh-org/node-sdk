import { describe, it, expect } from 'vitest';
import { createClient, ORGANISATION_ID } from './setup.js';

describe('Ledger', () => {
  const client = createClient();

  // Note: Ledger is only available for managed trust accounts.
  // This test may fail with a 403 if the organisation is not on managed trust.
  it('lists ledger entries (managed trust only)', async () => {
    try {
      const result = await client.ledger.list({
        organisation: ORGANISATION_ID,
        take: 5,
      });

      expect(result.data).toBeInstanceOf(Array);
      expect(result.meta.count).toBeGreaterThanOrEqual(0);
    } catch (err: any) {
      // 403 is expected if the org doesn't have managed trust
      if (err.statusCode === 403) {
        console.log('  [skip] Ledger not available — organisation is not on managed trust');
        return;
      }
      throw err;
    }
  });
});
