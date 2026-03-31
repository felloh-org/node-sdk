import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeListResponse, makeSingleResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

const client = () => new FellohClient({ publicKey: 'pk', privateKey: 'sk' });

describe('CreditNotesResource', () => {
  it('list() sends POST to /agent/credit-notes', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeListResponse([])]);
    await client().creditNotes.list({ organisation: 'org1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/agent/credit-notes');
  });

  it('get() sends GET to /agent/credit-notes/:id', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({ id: 'cn1' })]);
    await client().creditNotes.get('cn1');

    expect(calls[1].options?.method).toBe('GET');
    expect(calls[1].url).toContain('/agent/credit-notes/cn1');
  });
});
