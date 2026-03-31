import { describe, it, expect } from 'vitest';
import { createClient, ORGANISATION_ID, testRef } from './setup.js';

describe('Customers', () => {
  const client = createClient();

  it('creates a customer', async () => {
    const result = await client.customers.create({
      organisation: ORGANISATION_ID,
      customer_name: testRef('CUSTOMER'),
      email: `sdk-${Date.now()}@example.com`,
      address_1: '123 Test Street',
      city: 'London',
      county: 'Greater London',
      country: 'GB',
      post_code: 'SW1A 1AA',
    });

    expect(result.data).toBeDefined();
    expect(result.data.id).toBeTruthy();
  });

  it('lists customers', async () => {
    const result = await client.customers.list({
      organisation: ORGANISATION_ID,
      take: 5,
    });

    expect(result.data).toBeInstanceOf(Array);
    expect(typeof result.meta.count).toBe('number');
  });

  it('listAll returns an async iterable', async () => {
    let count = 0;
    for await (const _ of client.customers.listAll({ organisation: ORGANISATION_ID })) {
      count++;
      if (count >= 3) break;
    }
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
