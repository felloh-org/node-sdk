import { describe, it, expect } from 'vitest';
import { createClient, ORGANISATION_ID, testRef } from './setup.js';

describe('Suppliers', () => {
  const client = createClient();

  it('creates a supplier', async () => {
    const result = await client.suppliers.create({
      organisation: ORGANISATION_ID,
      supplier_name: testRef('SUPPLIER'),
    });

    expect(result.data).toBeDefined();
    expect(result.data.id).toBeTruthy();
  });

  it('lists suppliers', async () => {
    const result = await client.suppliers.list({
      organisation: ORGANISATION_ID,
      take: 5,
    });

    expect(result.data).toBeInstanceOf(Array);
    expect(result.data.length).toBeGreaterThan(0);
  });

  it('searches suppliers by keyword', async () => {
    const name = testRef('SEARCHABLE-SUPPLIER');
    await client.suppliers.create({
      organisation: ORGANISATION_ID,
      supplier_name: name,
    });

    const result = await client.suppliers.list({
      organisation: ORGANISATION_ID,
      keyword: name,
    });

    expect(result.data.length).toBeGreaterThanOrEqual(1);
  });
});
