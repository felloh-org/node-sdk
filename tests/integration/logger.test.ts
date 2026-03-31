import { describe, it, expect } from 'vitest';
import { FellohClient } from '../../src/client.js';
import type { LogEntry } from '../../src/types/auth.js';
import { PUBLIC_KEY, PRIVATE_KEY, ORGANISATION_ID } from './setup.js';

const SANDBOX_BASE_URL = 'https://sandbox.felloh.com';

describe('Logger Integration', () => {
  it('logger receives real request details', async () => {
    const logs: LogEntry[] = [];

    const client = new FellohClient({
      publicKey: PUBLIC_KEY,
      privateKey: PRIVATE_KEY,
      baseUrl: SANDBOX_BASE_URL,
      logger: (entry) => logs.push(entry),
    });

    await client.bookings.list({ organisation: ORGANISATION_ID, take: 1 });

    // Should have logged the bookings request (token request is internal, not via HttpClient)
    expect(logs.length).toBeGreaterThanOrEqual(1);

    const bookingLog = logs.find(l => l.url.includes('/agent/bookings'));
    expect(bookingLog).toBeDefined();
    expect(bookingLog!.method).toBe('POST');
    expect(bookingLog!.statusCode).toBe(200);
    expect(bookingLog!.durationMs).toBeGreaterThan(0);
    expect(bookingLog!.attempt).toBe(0);
  });
});
