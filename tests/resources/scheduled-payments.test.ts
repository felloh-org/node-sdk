import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeListResponse, makeSingleResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

const client = () => new FellohClient({ publicKey: 'pk', privateKey: 'sk' });

describe('ScheduledPaymentsResource', () => {
  it('list() sends POST to /payment/scheduled-payment', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeListResponse([])]);
    await client().scheduledPayments.list({ organisation: 'org1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/payment/scheduled-payment');
  });

  it('availableTokens() sends GET to /payment/booking/:id/available-tokens', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse([])]);
    await client().scheduledPayments.availableTokens('b1');

    expect(calls[1].options?.method).toBe('GET');
    expect(calls[1].url).toContain('/payment/booking/b1/available-tokens');
  });

  it('createPayment() sends POST to /payment/booking/:id/payment', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({ id: 'sp1' })]);
    await client().scheduledPayments.createPayment('b1', { token: 'tok1', amount: 5000 });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/payment/booking/b1/payment');
  });

  it('approvalLink() sends POST to /agent/bookings/:id/approval-link', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({ url: 'https://...' })]);
    await client().scheduledPayments.approvalLink('b1', { amount: 5000, token: 'tok1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/agent/bookings/b1/approval-link');
  });

  it('delete() sends DELETE to /payment/scheduled-payment/:id', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse(null)]);
    await client().scheduledPayments.delete('sp1');

    expect(calls[1].options?.method).toBe('DELETE');
    expect(calls[1].url).toContain('/payment/scheduled-payment/sp1');
  });
});
