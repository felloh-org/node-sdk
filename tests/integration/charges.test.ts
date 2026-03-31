import { describe, it, expect } from 'vitest';
import { createClient, ORGANISATION_ID } from './setup.js';

describe('Charges', () => {
  const client = createClient();

  it('lists charges', async () => {
    const result = await client.charges.list({
      organisation: ORGANISATION_ID,
      take: 5,
    });

    expect(result.data).toBeInstanceOf(Array);
    expect(typeof result.meta.count).toBe('number');
  });

  it('lists charges with date range', async () => {
    const result = await client.charges.list({
      organisation: ORGANISATION_ID,
      date_from: '2024-01-01',
      date_to: '2024-12-31',
      take: 5,
    });

    expect(result.data).toBeInstanceOf(Array);
  });
});
