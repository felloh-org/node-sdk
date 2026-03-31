import { describe, it, expect, vi, afterEach } from 'vitest';
import { TokenManager } from '../../src/auth.js';
import { FellohAuthenticationError, FellohNetworkError } from '../../src/errors.js';

function mockFetchForAuth(responses: { ok: boolean; status: number; body: unknown }[]) {
  let callIndex = 0;
  const calls: { url: string; options?: RequestInit }[] = [];

  vi.stubGlobal('fetch', vi.fn(async (url: string, options?: RequestInit) => {
    calls.push({ url, options });
    const mock = responses[callIndex++];
    return {
      ok: mock.ok,
      status: mock.status,
      json: async () => mock.body,
    } as Response;
  }));

  return { calls };
}

afterEach(() => {
  vi.restoreAllMocks();
});

const config = { publicKey: 'pk_test', privateKey: 'sk_test' };

const tokenBody = {
  data: { token: 'jwt-123', expiry_time: Math.floor(Date.now() / 1000) + 3600, type: 'BEARER' },
  errors: [],
  meta: { code: 200, reason: 'OK', message: 'Success', request_id: 'r1' },
};

describe('TokenManager', () => {
  it('acquires a token on first call', async () => {
    const { calls } = mockFetchForAuth([{ ok: true, status: 200, body: tokenBody }]);
    const tm = new TokenManager(config);

    const token = await tm.getToken();

    expect(token).toBe('jwt-123');
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe('https://api.felloh.com/token');
    const body = JSON.parse(calls[0].options?.body as string);
    expect(body).toEqual({ public_key: 'pk_test', private_key: 'sk_test' });
  });

  it('returns cached token on subsequent calls', async () => {
    mockFetchForAuth([{ ok: true, status: 200, body: tokenBody }]);
    const tm = new TokenManager(config);

    await tm.getToken();
    const token2 = await tm.getToken();

    expect(token2).toBe('jwt-123');
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
  });

  it('refreshes when token is near expiry', async () => {
    const expiredBody = {
      ...tokenBody,
      data: { ...tokenBody.data, expiry_time: Math.floor(Date.now() / 1000) + 10 },
    };
    const freshBody = {
      ...tokenBody,
      data: { ...tokenBody.data, token: 'jwt-fresh' },
    };

    mockFetchForAuth([
      { ok: true, status: 200, body: expiredBody },
      { ok: true, status: 200, body: freshBody },
    ]);

    const tm = new TokenManager({ ...config, tokenRefreshBuffer: 60 });
    await tm.getToken();
    const token2 = await tm.getToken();

    expect(token2).toBe('jwt-fresh');
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
  });

  it('deduplicates concurrent refresh calls', async () => {
    mockFetchForAuth([{ ok: true, status: 200, body: tokenBody }]);
    const tm = new TokenManager(config);

    const [t1, t2, t3] = await Promise.all([
      tm.getToken(),
      tm.getToken(),
      tm.getToken(),
    ]);

    expect(t1).toBe('jwt-123');
    expect(t2).toBe('jwt-123');
    expect(t3).toBe('jwt-123');
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
  });

  it('throws FellohAuthenticationError on 401', async () => {
    mockFetchForAuth([{
      ok: false,
      status: 401,
      body: { errors: [], meta: { code: 401, message: 'Invalid credentials' } },
    }]);

    const tm = new TokenManager(config);
    await expect(tm.getToken()).rejects.toThrow(FellohAuthenticationError);
  });

  it('throws FellohNetworkError on fetch failure', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('ECONNREFUSED'); }));

    const tm = new TokenManager(config);
    await expect(tm.getToken()).rejects.toThrow(FellohNetworkError);
  });

  it('uses custom baseUrl', async () => {
    const { calls } = mockFetchForAuth([{ ok: true, status: 200, body: tokenBody }]);
    const tm = new TokenManager({ ...config, baseUrl: 'https://sandbox.felloh.com' });

    await tm.getToken();
    expect(calls[0].url).toBe('https://sandbox.felloh.com/token');
  });

  it('forceRefresh clears cached token', async () => {
    const freshBody = {
      ...tokenBody,
      data: { ...tokenBody.data, token: 'jwt-fresh' },
    };
    mockFetchForAuth([
      { ok: true, status: 200, body: tokenBody },
      { ok: true, status: 200, body: freshBody },
    ]);

    const tm = new TokenManager(config);
    const t1 = await tm.getToken();
    await tm.forceRefresh();
    const t2 = await tm.getToken();

    expect(t1).toBe('jwt-123');
    expect(t2).toBe('jwt-fresh');
  });
});
