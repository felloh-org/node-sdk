import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeListResponse, makeSingleResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

const client = () => new FellohClient({ publicKey: 'pk', privateKey: 'sk' });

describe('DisbursementsResource', () => {
  it('list() sends POST to /ledger/disbursements', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeListResponse([])]);
    await client().disbursements.list({ organisation: 'org1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/ledger/disbursements');
  });

  it('get() sends GET to /ledger/disbursements/:id', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({ id: 'd1' })]);
    await client().disbursements.get('d1');

    expect(calls[1].options?.method).toBe('GET');
    expect(calls[1].url).toContain('/ledger/disbursements/d1');
  });
});
