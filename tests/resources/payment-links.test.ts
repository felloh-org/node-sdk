import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeListResponse, makeSingleResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

const client = () => new FellohClient({ publicKey: 'pk', privateKey: 'sk' });

describe('PaymentLinksResource', () => {
  it('list() sends POST to /agent/payment-links', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeListResponse([])]);
    await client().paymentLinks.list({ organisation: 'org1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/agent/payment-links');
  });

  it('get() sends GET to /agent/payment-links/:id', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({ id: 'pl1' })]);
    await client().paymentLinks.get('pl1');

    expect(calls[1].options?.method).toBe('GET');
    expect(calls[1].url).toContain('/agent/payment-links/pl1');
  });

  it('create() sends PUT to /agent/payment-links', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({ id: 'pl-new' })]);
    await client().paymentLinks.create({
      customer_name: 'John', email: 'john@test.com', organisation: 'org1', amount: 10000, type: 'CARD',
    });

    expect(calls[1].options?.method).toBe('PUT');
    expect(calls[1].url).toContain('/agent/payment-links');
  });

  it('delete() sends DELETE to /agent/payment-links/:id', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse(null)]);
    await client().paymentLinks.delete('pl1');

    expect(calls[1].options?.method).toBe('DELETE');
    expect(calls[1].url).toContain('/agent/payment-links/pl1');
  });

  it('assign() sends POST to /agent/payment-links/:id/assign', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse(null)]);
    await client().paymentLinks.assign('pl1', { booking_id: 'b1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/agent/payment-links/pl1/assign');
  });
});
