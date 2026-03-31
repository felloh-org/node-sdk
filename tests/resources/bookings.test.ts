import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeListResponse, makeSingleResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

const client = () => new FellohClient({ publicKey: 'pk', privateKey: 'sk' });

describe('BookingsResource', () => {
  it('list() sends POST to /agent/bookings', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeListResponse([{ id: 'b1' }])]);
    const result = await client().bookings.list({ organisation: 'org1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/agent/bookings');
    expect(JSON.parse(calls[1].options?.body as string)).toEqual({ organisation: 'org1' });
    expect(result.data).toHaveLength(1);
  });

  it('get() sends GET to /agent/bookings/:id', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({ id: 'b1' })]);
    await client().bookings.get('b1');

    expect(calls[1].options?.method).toBe('GET');
    expect(calls[1].url).toContain('/agent/bookings/b1');
  });

  it('create() sends PUT to /agent/bookings', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({ id: 'b-new' })]);
    const params = { organisation: 'org1', booking_reference: 'REF1', customer_name: 'John', email: 'john@test.com' };
    await client().bookings.create(params);

    expect(calls[1].options?.method).toBe('PUT');
    expect(calls[1].url).toContain('/agent/bookings');
    expect(JSON.parse(calls[1].options?.body as string)).toEqual(params);
  });

  it('update() sends POST to /agent/bookings/:id', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({ id: 'b1' })]);
    await client().bookings.update('b1', { customer_name: 'Jane' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/agent/bookings/b1');
  });

  it('delete() sends DELETE to /agent/bookings/:id', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse(null)]);
    await client().bookings.delete('b1');

    expect(calls[1].options?.method).toBe('DELETE');
    expect(calls[1].url).toContain('/agent/bookings/b1');
  });

  it('updateReference() sends POST to correct path', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse(null)]);
    await client().bookings.updateReference('b1', 'NEW-REF');

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/agent/bookings/b1/update-reference');
    expect(JSON.parse(calls[1].options?.body as string)).toEqual({ booking_reference: 'NEW-REF' });
  });
});
