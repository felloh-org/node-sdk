import { describe, it, expect } from 'vitest';
import { createClient, ORGANISATION_ID } from './setup.js';

describe('Credit Notes', () => {
  const client = createClient();

  it('lists credit notes', async () => {
    const result = await client.creditNotes.list({
      organisation: ORGANISATION_ID,
      take: 5,
    });

    expect(result.data).toBeInstanceOf(Array);
    expect(result.meta.count).toBeGreaterThanOrEqual(0);
  });

  it('fetches a credit note if any exist', async () => {
    const list = await client.creditNotes.list({
      organisation: ORGANISATION_ID,
      take: 1,
    });

    if (list.data.length > 0) {
      const result = await client.creditNotes.get(list.data[0].id);
      expect(result.data.id).toBe(list.data[0].id);
    }
  });
});
