import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeListResponse, makeSingleResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

const client = () => new FellohClient({ publicKey: 'pk', privateKey: 'sk' });

describe('RefundsResource', () => {
  it('list() sends POST to /agent/refunds', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeListResponse([])]);
    await client().refunds.list({ organisation: 'org1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/agent/refunds');
  });

  it('authorise() sends GET to /agent/refunds/:code/authorise', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse(null)]);
    await client().refunds.authorise('AUTH-CODE-1');

    expect(calls[1].options?.method).toBe('GET');
    expect(calls[1].url).toContain('/agent/refunds/AUTH-CODE-1/authorise');
  });

  it('decline() sends GET to /agent/refunds/:code/decline', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse(null)]);
    await client().refunds.decline('AUTH-CODE-1');

    expect(calls[1].options?.method).toBe('GET');
    expect(calls[1].url).toContain('/agent/refunds/AUTH-CODE-1/decline');
  });
});
