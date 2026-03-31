import { describe, it, expect, vi, afterEach } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { FellohNotFoundError, FellohServerError } from '../../src/errors.js';
import type { LogEntry } from '../../src/types/auth.js';
import { mockFetch, TOKEN_RESPONSE, makeSingleResponse } from '../helpers/mock-fetch.js';

afterEach(() => {
  vi.restoreAllMocks();
});

const clientConfig = { publicKey: 'pk', privateKey: 'sk', maxRetries: 1 };

describe('HttpClient', () => {
  it('injects Authorization header', async () => {
    const { calls } = mockFetch([
      TOKEN_RESPONSE,
      makeSingleResponse({ id: 'b1' }),
    ]);

    const client = new FellohClient(clientConfig);
    await client.bookings.get('b1');

    const headers = calls[1].options?.headers as Record<string, string>;
    expect(headers['Authorization']).toBe('Bearer test-jwt-token');
  });

  it('retries on 5xx errors', async () => {
    const { calls } = mockFetch([
      TOKEN_RESPONSE,
      { status: 502, body: { errors: [], meta: { message: 'Bad Gateway' } } },
      makeSingleResponse({ id: 'b1' }),
    ]);

    const client = new FellohClient(clientConfig);
    const result = await client.bookings.get('b1');

    expect(calls).toHaveLength(3);
    expect(result.data).toEqual({ id: 'b1' });
  });

  it('does not retry 4xx errors', async () => {
    mockFetch([
      TOKEN_RESPONSE,
      { status: 404, body: { errors: [{ message: 'Not found', title: '', type: 'not_found', code: '', documentation_url: '' }], meta: {} } },
    ]);

    const client = new FellohClient(clientConfig);
    await expect(client.bookings.get('missing')).rejects.toThrow(FellohNotFoundError);
  });

  it('refreshes token on 401 and retries', async () => {
    const freshToken = {
      ...TOKEN_RESPONSE,
      body: {
        ...(TOKEN_RESPONSE.body as Record<string, unknown>),
        data: { token: 'fresh-token', expiry_time: Math.floor(Date.now() / 1000) + 3600, type: 'BEARER' },
      },
    };

    const { calls } = mockFetch([
      TOKEN_RESPONSE,
      { status: 401, body: { errors: [], meta: { message: 'Token expired' } } },
      freshToken,
      makeSingleResponse({ id: 'b1' }),
    ]);

    const client = new FellohClient(clientConfig);
    const result = await client.bookings.get('b1');

    expect(result.data).toEqual({ id: 'b1' });
    expect(calls).toHaveLength(4);
  });

  it('throws after max retries on persistent 5xx', async () => {
    mockFetch([
      TOKEN_RESPONSE,
      { status: 500, body: { errors: [], meta: { message: 'Server Error' } } },
      { status: 500, body: { errors: [], meta: { message: 'Server Error' } } },
    ]);

    const client = new FellohClient(clientConfig);
    await expect(client.bookings.get('b1')).rejects.toThrow(FellohServerError);
  });

  it('calls logger on successful request', async () => {
    mockFetch([TOKEN_RESPONSE, makeSingleResponse({ id: 'b1' })]);

    const logs: LogEntry[] = [];
    const client = new FellohClient({ ...clientConfig, logger: (entry) => logs.push(entry) });
    await client.bookings.get('b1');

    expect(logs).toHaveLength(1);
    expect(logs[0].method).toBe('GET');
    expect(logs[0].url).toContain('/agent/bookings/b1');
    expect(logs[0].statusCode).toBe(200);
    expect(logs[0].durationMs).toBeGreaterThanOrEqual(0);
    expect(logs[0].attempt).toBe(0);
  });

  it('calls logger on each retry attempt', async () => {
    mockFetch([
      TOKEN_RESPONSE,
      { status: 502, body: { errors: [], meta: { message: 'Bad Gateway' } } },
      makeSingleResponse({ id: 'b1' }),
    ]);

    const logs: LogEntry[] = [];
    const client = new FellohClient({ ...clientConfig, logger: (entry) => logs.push(entry) });
    await client.bookings.get('b1');

    expect(logs).toHaveLength(2);
    expect(logs[0].statusCode).toBe(502);
    expect(logs[0].attempt).toBe(0);
    expect(logs[1].statusCode).toBe(200);
    expect(logs[1].attempt).toBe(1);
  });

  it('calls logger with undefined statusCode on network failure', async () => {
    const logs: LogEntry[] = [];
    // First call succeeds (token), subsequent calls fail
    let callCount = 0;
    vi.stubGlobal('fetch', vi.fn(async () => {
      callCount++;
      if (callCount === 1) {
        return {
          ok: true,
          status: 200,
          json: async () => (TOKEN_RESPONSE.body),
          headers: new Headers(),
        } as Response;
      }
      throw new Error('ECONNREFUSED');
    }));

    const client = new FellohClient({ ...clientConfig, maxRetries: 0, logger: (entry) => logs.push(entry) });
    await expect(client.bookings.get('b1')).rejects.toThrow();

    expect(logs).toHaveLength(1);
    expect(logs[0].statusCode).toBeUndefined();
    expect(logs[0].method).toBe('GET');
  });
});
