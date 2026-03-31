import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeSingleResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

describe('OrganisationsResource', () => {
  it('list() sends GET to /user/organisations', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse([])]);
    await new FellohClient({ publicKey: 'pk', privateKey: 'sk' }).organisations.list();

    expect(calls[1].options?.method).toBe('GET');
    expect(calls[1].url).toContain('/user/organisations');
  });
});
