import { describe, it, expect } from 'vitest';
import { createClient, ORGANISATION_ID } from './setup.js';

describe('Scheduled Payments', () => {
  const client = createClient();

  it('lists scheduled payments', async () => {
    const result = await client.scheduledPayments.list({
      organisation: ORGANISATION_ID,
      take: 5,
    });

    expect(result.data).toBeInstanceOf(Array);
    expect(result.meta.count).toBeGreaterThanOrEqual(0);
  });

  // Note: Creating scheduled payments requires a valid stored card token
  // on an existing booking, which requires a completed card transaction.
  // These are tested via the payment link / ecommerce flow in a real scenario.

  it('fetches available tokens for a booking if bookings exist', async () => {
    const bookings = await client.bookings.list({
      organisation: ORGANISATION_ID,
      take: 1,
    });

    if (bookings.data.length > 0) {
      const result = await client.scheduledPayments.availableTokens(bookings.data[0].id);
      expect(result.data).toBeInstanceOf(Array);
    }
  });
});
