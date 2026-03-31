import { describe, it, expect } from 'vitest';
import { createClient } from './setup.js';

describe('Enums', () => {
  const client = createClient();

  it('fetches all enum values', async () => {
    const result = await client.enums.list();

    expect(result.meta.code).toBe(200);
    expect(result.data.currency).toBeDefined();
    expect(Object.keys(result.data.currency).length).toBeGreaterThan(0);
    expect(result.data.transaction.method).toBeInstanceOf(Array);
    expect(result.data.transaction.status).toBeInstanceOf(Array);
    expect(result.data.transaction.type).toBeInstanceOf(Array);
  });

  it('currencies include GBX', async () => {
    const result = await client.enums.list();
    const gbx = result.data.currency['GBX'];

    expect(gbx).toBeDefined();
    expect(gbx.division_factor).toBe(100);
    expect(gbx.major_unit).toBe('GBP');
  });
});
