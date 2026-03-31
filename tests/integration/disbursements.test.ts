import { describe, it, expect } from 'vitest';
import { createClient, ORGANISATION_ID } from './setup.js';

describe('Disbursements', () => {
  const client = createClient();

  it('lists disbursements', async () => {
    try {
      const result = await client.disbursements.list({
        organisation: ORGANISATION_ID,
        take: 5,
      });

      expect(result.data).toBeInstanceOf(Array);
    } catch (err: any) {
      // Sandbox may return 500 for disbursements if not configured
      if (err.statusCode === 500) {
        console.log('  [skip] Disbursements endpoint returned 500 on sandbox');
        return;
      }
      throw err;
    }
  });

  it('fetches a disbursement if any exist', async () => {
    try {
      const list = await client.disbursements.list({
        organisation: ORGANISATION_ID,
        take: 1,
      });

      if (list.data.length > 0) {
        const result = await client.disbursements.get(list.data[0].id);
        expect(result.data.id).toBe(list.data[0].id);
      }
    } catch (err: any) {
      if (err.statusCode === 500) {
        console.log('  [skip] Disbursements endpoint returned 500 on sandbox');
        return;
      }
      throw err;
    }
  });
});
