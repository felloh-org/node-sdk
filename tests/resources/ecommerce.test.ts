import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeListResponse, makeSingleResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

const client = () => new FellohClient({ publicKey: 'pk', privateKey: 'sk' });

describe('EcommerceResource', () => {
  it('list() sends POST to /agent/ecommerce', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeListResponse([])]);
    await client().ecommerce.list({ organisation: 'org1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/agent/ecommerce');
  });

  it('get() sends GET to /agent/ecommerce/:id', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({ id: 'e1' })]);
    await client().ecommerce.get('e1');

    expect(calls[1].options?.method).toBe('GET');
    expect(calls[1].url).toContain('/agent/ecommerce/e1');
  });

  it('create() sends PUT to /agent/ecommerce', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({ id: 'e-new' })]);
    await client().ecommerce.create({
      customer_name: 'John', email: 'john@test.com', organisation: 'org1', amount: 5000,
    });

    expect(calls[1].options?.method).toBe('PUT');
  });

  it('delete() sends DELETE', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse(null)]);
    await client().ecommerce.delete('e1');

    expect(calls[1].options?.method).toBe('DELETE');
  });

  it('assign() sends POST to /agent/ecommerce/:id/assign', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse(null)]);
    await client().ecommerce.assign('e1', { booking_id: 'b1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/agent/ecommerce/e1/assign');
  });
});
