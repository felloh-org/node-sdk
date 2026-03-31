import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeListResponse, makeSingleResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

const client = () => new FellohClient({ publicKey: 'pk', privateKey: 'sk' });

describe('SuppliersResource', () => {
  it('list() sends POST to /agent/suppliers', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeListResponse([])]);
    await client().suppliers.list({ organisation: 'org1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/agent/suppliers');
  });

  it('create() sends PUT to /agent/suppliers', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({ id: 's1' })]);
    await client().suppliers.create({ organisation: 'org1', supplier_name: 'Acme' });

    expect(calls[1].options?.method).toBe('PUT');
    expect(calls[1].url).toContain('/agent/suppliers');
  });
});
