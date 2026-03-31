import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeListResponse, makeSingleResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

const client = () => new FellohClient({ publicKey: 'pk', privateKey: 'sk' });

describe('CustomersResource', () => {
  it('list() sends POST to /agent/customers', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeListResponse([])]);
    await client().customers.list({ organisation: 'org1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/agent/customers');
  });

  it('create() sends PUT to /agent/customers', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({ id: 'c1' })]);
    await client().customers.create({ organisation: 'org1', customer_name: 'Test' });

    expect(calls[1].options?.method).toBe('PUT');
    expect(calls[1].url).toContain('/agent/customers');
  });
});
