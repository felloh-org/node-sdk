import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeListResponse, makeSingleResponse } from '../helpers/mock-fetch.js';

afterEach(() => vi.restoreAllMocks());

const client = () => new FellohClient({ publicKey: 'pk', privateKey: 'sk' });

describe('BeneficiariesResource', () => {
  it('list() sends POST to /ledger/beneficiaries', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeListResponse([])]);
    await client().beneficiaries.list({ organisation: 'org1' });

    expect(calls[1].options?.method).toBe('POST');
    expect(calls[1].url).toContain('/ledger/beneficiaries');
  });

  it('create() sends PUT to /ledger/beneficiaries', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse({ id: 'ben1' })]);
    await client().beneficiaries.create({
      organisation: 'org1', account_name: 'Acme', account_number: '12345678', sort_code: '001122',
    });

    expect(calls[1].options?.method).toBe('PUT');
    expect(calls[1].url).toContain('/ledger/beneficiaries');
  });

  it('activate() sends PUT to /ledger/beneficiaries/:id/activate', async () => {
    const { calls } = mockFetch([TOKEN_RESPONSE, makeSingleResponse(null)]);
    await client().beneficiaries.activate('ben1');

    expect(calls[1].options?.method).toBe('PUT');
    expect(calls[1].url).toContain('/ledger/beneficiaries/ben1/activate');
  });
});
