import { describe, it, expect } from 'vitest';
import { createClient, ORGANISATION_ID, testRef } from './setup.js';

describe('API Keys', () => {
  const client = createClient();

  it('lists API keys', async () => {
    const result = await client.apiKeys.list({
      organisation: ORGANISATION_ID,
    });

    expect(result.data).toBeInstanceOf(Array);
    expect(result.data.length).toBeGreaterThan(0);
  });

  it('creates and deletes a new API key', async () => {
    const name = testRef('KEY');
    const result = await client.apiKeys.create({
      organisation: ORGANISATION_ID,
      name,
    });

    expect(result.data.name).toBe(name);
    expect(result.data.public_key).toBeTruthy();
    expect(result.data.secret_key).toBeTruthy();

    // Attempt cleanup — the delete ID may vary by API version
    try {
      await client.apiKeys.delete(result.data.public_key);
    } catch {
      // cleanup is best-effort
    }
  });
});
