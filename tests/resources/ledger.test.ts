import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeListResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

describe('LedgerResource', () => {
  it('list() sends POST to /ledger', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeListResponse([])]);
    await new FellohClient({ publicKey: 'pk', privateKey: 'sk' }).ledger.list({ organisation: 'org1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/ledger');
    expect(calls[1].url).not.toContain('/ledger/');
  });
});
