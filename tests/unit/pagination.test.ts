import { describe, it, expect, vi, afterEach } from 'vitest';
import { toArray } from '../../src/pagination.js';
import { FellohClient } from '../../src/client.js';
import { mockFetch, TOKEN_RESPONSE, makeListResponse } from '../helpers/mock-fetch.js';

afterEach(() => {
  vi.restoreAllMocks();
});

const clientConfig = { publicKey: 'pk', privateKey: 'sk' };

describe('Paginator (via listAll)', () => {
  it('iterates through multiple pages', async () => {
    const page1 = Array.from({ length: 100 }, (_, i) => ({ id: `b${i}` }));
    const page2 = [{ id: 'b100' }, { id: 'b101' }];

    mockFetch([
      TOKEN_RESPONSE,
      makeListResponse(page1, 102),
      makeListResponse(page2, 102),
    ]);

    const client = new FellohClient(clientConfig);
    const items = await toArray(client.bookings.listAll({ organisation: 'org1' }));

    expect(items).toHaveLength(102);
    expect(items[0]).toEqual({ id: 'b0' });
    expect(items[101]).toEqual({ id: 'b101' });
  });

  it('handles single page result', async () => {
    mockFetch([
      TOKEN_RESPONSE,
      makeListResponse([{ id: 'b1' }], 1),
    ]);

    const client = new FellohClient(clientConfig);
    const items = await toArray(client.bookings.listAll({ organisation: 'org1' }));

    expect(items).toHaveLength(1);
  });

  it('handles empty result', async () => {
    mockFetch([
      TOKEN_RESPONSE,
      makeListResponse([], 0),
    ]);

    const client = new FellohClient(clientConfig);
    const items = await toArray(client.bookings.listAll({ organisation: 'org1' }));

    expect(items).toHaveLength(0);
  });

  it('works with for-await', async () => {
    mockFetch([
      TOKEN_RESPONSE,
      makeListResponse([{ id: 'a' }, { id: 'b' }], 2),
    ]);

    const client = new FellohClient(clientConfig);
    const ids: string[] = [];
    for await (const item of client.bookings.listAll({ organisation: 'org1' })) {
      ids.push((item as { id: string }).id);
    }

    expect(ids).toEqual(['a', 'b']);
  });
});
