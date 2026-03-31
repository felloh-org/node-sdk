import { FellohClient } from '../../src/client.js';
import type { LogEntry } from '../../src/types/auth.js';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Set it in a .env file or export it before running integration tests.`,
    );
  }
  return value;
}

export const PUBLIC_KEY = requiredEnv('FELLOH_PUBLIC_KEY');
export const PRIVATE_KEY = requiredEnv('FELLOH_PRIVATE_KEY');
export const ORGANISATION_ID = requiredEnv('FELLOH_ORGANISATION_ID');

const SANDBOX_BASE_URL = 'https://sandbox.felloh.com';

export function createClient(): FellohClient {
  return new FellohClient({
    publicKey: PUBLIC_KEY,
    privateKey: PRIVATE_KEY,
    baseUrl: SANDBOX_BASE_URL,
    logger: (entry: LogEntry) => {
      const status = entry.statusCode ?? 'ERR';
      console.log(`  [felloh] ${entry.method} ${entry.url} → ${status} (${entry.durationMs}ms)`);
    },
  });
}

/** Generate a unique reference for test data to avoid collisions. */
export function testRef(prefix = 'SDK-TEST'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
