import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeSingleResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

describe('EnumsResource', () => {
  it('list() sends GET to /enums', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({})]);
    await new FellohClient({ publicKey: 'pk', privateKey: 'sk' }).enums.list();

    expect(calls[1].options?.method).toBe('GET');
    expect(calls[1].url).toContain('/enums');
  });
});
