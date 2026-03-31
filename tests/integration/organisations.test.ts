import { describe, it, expect } from 'vitest';
import { createClient, ORGANISATION_ID } from './setup.js';

describe('Organisations', () => {
  const client = createClient();

  it('lists organisations and includes the test organisation', async () => {
    const result = await client.organisations.list();

    expect(result.meta.code).toBe(200);
    expect(result.data).toBeInstanceOf(Array);
    expect(result.data.length).toBeGreaterThan(0);

    const org = result.data.find(o => o.id === ORGANISATION_ID);
    expect(org).toBeDefined();
    expect(org!.name).toBeTruthy();
  });
});
