import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeListResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

describe('ChargesResource', () => {
  it('list() sends POST to /agent/charges', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeListResponse([])]);
    await new FellohClient({ publicKey: 'pk', privateKey: 'sk' }).charges.list({ organisation: 'org1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/agent/charges');
  });
});
