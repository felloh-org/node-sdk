import { describe, it, expect } from 'vitest';
import { createClient, ORGANISATION_ID } from './setup.js';

describe('Refunds', () => {
  const client = createClient();

  it('lists refunds', async () => {
    const result = await client.refunds.list({
      organisation: ORGANISATION_ID,
      take: 5,
    });

    expect(result.data).toBeInstanceOf(Array);
    expect(result.meta.count).toBeGreaterThanOrEqual(0);
  });
});
