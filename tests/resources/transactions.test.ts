import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeListResponse, makeSingleResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

const client = () => new FellohClient({ publicKey: 'pk', privateKey: 'sk' });

describe('TransactionsResource', () => {
  it('list() sends POST to /agent/transactions', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeListResponse([])]);
    await client().transactions.list({ organisation: 'org1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/agent/transactions');
  });

  it('get() sends GET to /agent/transactions/:id', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({ id: 't1' })]);
    await client().transactions.get('t1');

    expect(calls[1].options?.method).toBe('GET');
    expect(calls[1].url).toContain('/agent/transactions/t1');
  });

  it('refund() sends POST to /agent/transactions/:id/refund', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse(null)]);
    await client().transactions.refund('t1', { amount: 5000 });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/agent/transactions/t1/refund');
    expect(JSON.parse(calls[1].options?.body as string)).toEqual({ amount: 5000 });
  });

  it('complete() sends GET to /agent/transactions/:id/complete', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse(null)]);
    await client().transactions.complete('t1');

    expect(calls[1].options?.method).toBe('GET');
    expect(calls[1].url).toContain('/agent/transactions/t1/complete');
  });

  it('reverse() sends GET to /agent/transactions/:id/reverse', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse(null)]);
    await client().transactions.reverse('t1');

    expect(calls[1].options?.method).toBe('GET');
    expect(calls[1].url).toContain('/agent/transactions/t1/reverse');
  });

  it('reassign() sends POST to /agent/transactions/:id/re-assign', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse(null)]);
    await client().transactions.reassign('t1', { booking_id: 'b1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/agent/transactions/t1/re-assign');
  });
});
