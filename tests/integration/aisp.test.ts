import { describe, it, expect } from 'vitest';
import { createClient, ORGANISATION_ID } from './setup.js';

describe('AISP', () => {
  const client = createClient();

  // Note: AISP endpoints require linked bank accounts via Open Banking.
  // These may return empty results or 403 depending on organisation setup.

  it('fetches bank accounts', async () => {
    try {
      const result = await client.aisp.accounts(ORGANISATION_ID);

      expect(result.data).toBeInstanceOf(Array);
    } catch (err: any) {
      if (err.statusCode === 403) {
        console.log('  [skip] AISP accounts not available for this organisation');
        return;
      }
      throw err;
    }
  });

  it('fetches account statistics', async () => {
    try {
      const result = await client.aisp.statistics(ORGANISATION_ID);

      expect(result.data).toBeDefined();
    } catch (err: any) {
      if (err.statusCode === 403) {
        console.log('  [skip] AISP statistics not available for this organisation');
        return;
      }
      throw err;
    }
  });

  it('lists bank transactions', async () => {
    try {
      const result = await client.aisp.transactions({
        organisation: ORGANISATION_ID,
        take: 5,
      });

      expect(result.data).toBeInstanceOf(Array);
    } catch (err: any) {
      if (err.statusCode === 403) {
        console.log('  [skip] AISP transactions not available for this organisation');
        return;
      }
      throw err;
    }
  });
});
