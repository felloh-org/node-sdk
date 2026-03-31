import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeSingleResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

const client = () => new FellohClient({ publicKey: 'pk', privateKey: 'sk' });

describe('BookingComponentsResource', () => {
  it('create() sends PUT to /agent/booking/:id/component', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({ id: 'comp1' })]);
    await client().bookingComponents.create('b1', {
      supplier: 'sup1', amount: 1000, currency: 'GBX', booking_reference: 'REF1',
    });

    expect(calls[1].options?.method).toBe('PUT');
    expect(calls[1].url).toContain('/agent/booking/b1/component');
  });

  it('delete() sends DELETE to /agent/bookings/:bid/component/:cid', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse(null)]);
    await client().bookingComponents.delete('b1', 'comp1');

    expect(calls[1].options?.method).toBe('DELETE');
    expect(calls[1].url).toContain('/agent/bookings/b1/component/comp1');
  });
});
