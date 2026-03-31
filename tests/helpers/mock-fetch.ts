import { vi } from 'vitest';

export interface MockResponse {
  ok?: boolean;
  status?: number;
  body: unknown;
}

export interface FetchCall {
  url: string | URL | Request;
  options?: RequestInit;
}

export function mockFetch(responses: MockResponse[]) {
  let callIndex = 0;
  const calls: FetchCall[] = [];

  const fetchMock = vi.fn(async (url: string | URL | Request, options?: RequestInit) => {
    calls.push({ url, options });
    const mock = responses[callIndex++];
    if (!mock) throw new Error(`No mock response for call #${callIndex}`);
    return {
      ok: mock.ok ?? (mock.status ? mock.status < 400 : true),
      status: mock.status ?? 200,
      json: async () => mock.body,
      headers: new Headers(),
    } as Response;
  });

  vi.stubGlobal('fetch', fetchMock);

  return { calls, fetchMock };
}

export const TOKEN_RESPONSE: MockResponse = {
  status: 200,
  body: {
    data: {
      token: 'test-jwt-token',
      expiry_time: Math.floor(Date.now() / 1000) + 3600,
      type: 'BEARER',
    },
    errors: [],
    meta: { code: 200, reason: 'OK', message: 'Success', request_id: 'test-req-id' },
  },
};

export function makeListResponse<T>(data: T[], count?: number): MockResponse {
  return {
    status: 200,
    body: {
      data,
      errors: [],
      meta: {
        code: 200,
        reason: 'OK',
        message: 'The request was successful',
        request_id: 'test-req-id',
        count: count ?? data.length,
      },
    },
  };
}

export function makeSingleResponse<T>(data: T): MockResponse {
  return {
    status: 200,
    body: {
      data,
      errors: [],
      meta: {
        code: 200,
        reason: 'OK',
        message: 'The request was successful',
        request_id: 'test-req-id',
      },
    },
  };
}
