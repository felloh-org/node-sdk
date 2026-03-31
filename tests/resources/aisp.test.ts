import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeListResponse, makeSingleResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

const client = () => new FellohClient({ publicKey: 'pk', privateKey: 'sk' });

describe('AispResource', () => {
  it('accounts() sends GET to /aisp/accounts', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse([])]);
    await client().aisp.accounts('org1');

    expect(calls[1].options?.method).toBe('GET');
    expect(calls[1].url).toContain('/aisp/accounts');
    expect(calls[1].url).toContain('organisation=org1');
  });

  it('transactions() sends POST to /aisp/transactions', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeListResponse([])]);
    await client().aisp.transactions({ organisation: 'org1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/aisp/transactions');
  });

  it('statistics() sends GET to /aisp/statistics', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({})]);
    await client().aisp.statistics('org1');

    expect(calls[1].options?.method).toBe('GET');
    expect(calls[1].url).toContain('/aisp/statistics');
    expect(calls[1].url).toContain('organisation=org1');
  });
});
