import { describe, it, expect } from 'vitest';
import { createClient, ORGANISATION_ID } from './setup.js';

describe('Chargebacks', () => {
  const client = createClient();

  it('lists chargebacks', async () => {
    const result = await client.chargebacks.list({
      organisation: ORGANISATION_ID,
      take: 5,
    });

    expect(result.data).toBeInstanceOf(Array);
    expect(result.meta.count).toBeGreaterThanOrEqual(0);
  });
});
