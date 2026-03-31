import { describe, it, expect } from 'vitest';
import { createClient, ORGANISATION_ID } from './setup.js';
import { FellohNotFoundError } from '../../src/errors.js';

describe('Transactions', () => {
  const client = createClient();

  it('lists transactions', async () => {
    const result = await client.transactions.list({
      organisation: ORGANISATION_ID,
      take: 5,
    });

    expect(result.data).toBeInstanceOf(Array);
    expect(result.meta.count).toBeGreaterThanOrEqual(0);
  });

  it('lists transactions with date filter', async () => {
    const result = await client.transactions.list({
      organisation: ORGANISATION_ID,
      date_from: '2024-01-01',
      date_to: '2024-12-31',
      take: 5,
    });

    expect(result.data).toBeInstanceOf(Array);
  });

  it('lists transactions with status filter', async () => {
    const result = await client.transactions.list({
      organisation: ORGANISATION_ID,
      statuses: ['COMPLETE'],
      take: 5,
    });

    expect(result.data).toBeInstanceOf(Array);
  });

  it('returns 404 for a non-existent transaction', async () => {
    await expect(
      client.transactions.get('00000000-0000-0000-0000-000000000000'),
    ).rejects.toThrow(FellohNotFoundError);
  });

  it('fetches a transaction if any exist', async () => {
    const list = await client.transactions.list({
      organisation: ORGANISATION_ID,
      take: 1,
    });

    if (list.data.length > 0) {
      const result = await client.transactions.get(list.data[0].id);
      expect(result.data.id).toBe(list.data[0].id);
      expect(result.data.amount).toBeGreaterThan(0);
    }
  });
});
