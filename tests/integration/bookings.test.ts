import { describe, it, expect, afterAll } from 'vitest';
import { createClient, ORGANISATION_ID, testRef } from './setup.js';

describe('Bookings CRUD', () => {
  const client = createClient();
  const ref = testRef('BOOKING');
  let bookingId: string;

  afterAll(async () => {
    if (bookingId) {
      try {
        await client.bookings.delete(bookingId);
      } catch {
        // best-effort cleanup
      }
    }
  });

  it('creates a booking', async () => {
    const result = await client.bookings.create({
      organisation: ORGANISATION_ID,
      booking_reference: ref,
      customer_name: 'SDK Integration Test',
      email: 'sdk-test@example.com',
      currency: 'GBX',
      gross_amount: 100000,
    });

    expect(result.data).toBeDefined();
    bookingId = result.data.id;
    expect(bookingId).toBeTruthy();
  });

  it('fetches the created booking by ID', async () => {
    const result = await client.bookings.get(bookingId);

    expect(result.data.id).toBe(bookingId);
    expect(result.data.booking_reference).toBe(ref);
    expect(result.data.customer_name).toBe('SDK Integration Test');
    expect(result.data.email).toBe('sdk-test@example.com');
  });

  it('lists bookings and finds the created one', async () => {
    const result = await client.bookings.list({
      organisation: ORGANISATION_ID,
      booking_reference: ref,
    });

    expect(result.data.length).toBeGreaterThanOrEqual(1);
    expect(result.data.some(b => b.id === bookingId)).toBe(true);
    expect(typeof result.meta.count).toBe('number');
  });

  it('updates the booking', async () => {
    await client.bookings.update(bookingId, {
      customer_name: 'SDK Updated Name',
    });

    const fetched = await client.bookings.get(bookingId);
    expect(fetched.data.customer_name).toBe('SDK Updated Name');
  });

  it('updates the booking reference', async () => {
    const newRef = testRef('UPDATED');
    await client.bookings.updateReference(bookingId, newRef);

    const fetched = await client.bookings.get(bookingId);
    expect(fetched.data.booking_reference).toBe(newRef);
  });

  it('deletes the booking', async () => {
    await client.bookings.delete(bookingId);
    bookingId = '';
  });
});

describe('Bookings pagination', () => {
  const client = createClient();

  it('listAll returns an async iterable', async () => {
    let count = 0;
    for await (const _ of client.bookings.listAll({ organisation: ORGANISATION_ID })) {
      count++;
      if (count >= 3) break;
    }
    expect(count).toBeGreaterThanOrEqual(0);
  });

  it('list with take=1 returns at most 1 result', async () => {
    const result = await client.bookings.list({
      organisation: ORGANISATION_ID,
      take: 1,
    });

    expect(result.data.length).toBeLessThanOrEqual(1);
  });
});
