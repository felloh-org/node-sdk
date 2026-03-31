import { describe, it, expect } from 'vitest';
import { createClient, ORGANISATION_ID } from './setup.js';

describe('Acquirer Settlement Batches', () => {
  const client = createClient();

  it('lists batches', async () => {
    const result = await client.batches.list({
      organisation: ORGANISATION_ID,
      take: 5,
    });

    expect(result.data).toBeInstanceOf(Array);
    expect(result.meta.count).toBeGreaterThanOrEqual(0);
  });

  it('fetches a batch if any exist', async () => {
    const list = await client.batches.list({
      organisation: ORGANISATION_ID,
      take: 1,
    });

    if (list.data.length > 0) {
      const result = await client.batches.get(list.data[0].id);
      expect(result.data.id).toBe(list.data[0].id);
    }
  });
});
