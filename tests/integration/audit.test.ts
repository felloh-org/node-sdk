import { describe, it, expect } from 'vitest';
import { createClient, ORGANISATION_ID } from './setup.js';

describe('Audit', () => {
  const client = createClient();

  it('lists audit events', async () => {
    const result = await client.audit.list({
      organisation: ORGANISATION_ID,
      take: 5,
    });

    expect(result.data).toBeInstanceOf(Array);
    expect(result.meta.count).toBeGreaterThanOrEqual(0);

    if (result.data.length > 0) {
      const event = result.data[0];
      expect(event.id).toBeTruthy();
      expect(event.type).toBeTruthy();
      expect(event.created_at).toBeTruthy();
    }
  });
});
