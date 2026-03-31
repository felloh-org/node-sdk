import { describe, it, expect } from 'vitest';
import { createClient, ORGANISATION_ID } from './setup.js';

describe('Beneficiaries', () => {
  const client = createClient();

  it('lists beneficiaries', async () => {
    const result = await client.beneficiaries.list({
      organisation: ORGANISATION_ID,
      take: 5,
    });

    expect(result.data).toBeInstanceOf(Array);
    expect(result.meta.count).toBeGreaterThanOrEqual(0);
  });

  // Note: create and activate are not tested here because they require
  // valid bank account details and may have side effects in sandbox.
  // They should be tested manually or with known sandbox test accounts.
});
