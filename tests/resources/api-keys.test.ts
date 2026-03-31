import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeListResponse, makeSingleResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

const client = () => new FellohClient({ publicKey: 'pk', privateKey: 'sk' });

describe('ApiKeysResource', () => {
  it('list() sends POST to /token/keys', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeListResponse([])]);
    await client().apiKeys.list({ organisation: 'org1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/token/keys');
  });

  it('create() sends POST to /token/key', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({ name: 'key1', public_key: 'pk', secret_key: 'sk' })]);
    await client().apiKeys.create({ organisation: 'org1', name: 'key1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/token/key');
  });

  it('delete() sends DELETE to /token/key/:id', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse(null)]);
    await client().apiKeys.delete('key-id');

    expect(calls[1].options?.method).toBe('DELETE');
    expect(calls[1].url).toContain('/token/key/key-id');
  });
});
