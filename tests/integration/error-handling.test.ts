import { describe, it, expect } from 'vitest';
import { createClient } from './setup.js';
import {
  FellohNotFoundError,
  FellohError,
} from '../../src/errors.js';

describe('Error Handling', () => {
  const client = createClient();

  it('throws FellohNotFoundError for non-existent booking', async () => {
    try {
      await client.bookings.get('00000000-0000-0000-0000-000000000000');
      expect.fail('Expected FellohNotFoundError');
    } catch (err) {
      expect(err).toBeInstanceOf(FellohNotFoundError);
      expect(err).toBeInstanceOf(FellohError);

      const fellohErr = err as FellohNotFoundError;
      expect(fellohErr.statusCode).toBe(404);
      expect(fellohErr.meta.request_id).toBeTruthy();
    }
  });

  it('error includes structured error details', async () => {
    try {
      await client.bookings.get('00000000-0000-0000-0000-000000000000');
    } catch (err) {
      const fellohErr = err as FellohError;
      expect(fellohErr.errors).toBeInstanceOf(Array);
      expect(fellohErr.message).toBeTruthy();
    }
  });
});
