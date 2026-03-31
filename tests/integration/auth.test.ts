import { describe, it, expect } from 'vitest';
import { FellohClient } from '../../src/client.js';
import { FellohAuthenticationError } from '../../src/errors.js';
import { PUBLIC_KEY, PRIVATE_KEY } from './setup.js';

const SANDBOX_BASE_URL = 'https://sandbox.felloh.com';

describe('Authentication', () => {
  it('acquires a token and makes an authenticated request', async () => {
    const client = new FellohClient({
      publicKey: PUBLIC_KEY,
      privateKey: PRIVATE_KEY,
      baseUrl: SANDBOX_BASE_URL,
    });

    const result = await client.enums.list();
    expect(result.meta.code).toBe(200);
    expect(result.data).toBeDefined();
  });

  it('throws FellohAuthenticationError with invalid credentials', async () => {
    const client = new FellohClient({
      publicKey: 'invalid-key',
      privateKey: 'invalid-secret',
      baseUrl: SANDBOX_BASE_URL,
    });

    await expect(client.enums.list()).rejects.toThrow(FellohAuthenticationError);
  });
});
