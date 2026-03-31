import { describe, it, expect, afterAll } from 'vitest';
import { createClient, ORGANISATION_ID, testRef } from './setup.js';

describe('Ecommerce Sessions CRUD', () => {
  const client = createClient();
  let ecommerceId: string;
  let bookingId: string;

  afterAll(async () => {
    try { if (ecommerceId) await client.ecommerce.delete(ecommerceId); } catch { /* cleanup */ }
    try { if (bookingId) await client.bookings.delete(bookingId); } catch { /* cleanup */ }
  });

  it('creates an ecommerce session', async () => {
    const result = await client.ecommerce.create({
      customer_name: 'Ecom Test',
      email: 'ecom-test@example.com',
      organisation: ORGANISATION_ID,
      amount: 15000,
    });

    expect(result.data).toBeDefined();
    ecommerceId = result.data.id;
    expect(ecommerceId).toBeTruthy();
  });

  it('fetches the ecommerce session by ID', async () => {
    const result = await client.ecommerce.get(ecommerceId);

    expect(result.data.id).toBe(ecommerceId);
    expect(result.data.amount).toBe(15000);
  });

  it('lists ecommerce sessions', async () => {
    const result = await client.ecommerce.list({
      organisation: ORGANISATION_ID,
      take: 10,
    });

    expect(result.data).toBeInstanceOf(Array);
  });

  it('assigns ecommerce session to a booking', async () => {
    const booking = await client.bookings.create({
      organisation: ORGANISATION_ID,
      booking_reference: testRef('ECOM-ASSIGN'),
      customer_name: 'Ecom Assign',
      email: 'ecom-assign@example.com',
      currency: 'GBX',
      gross_amount: 15000,
    });
    bookingId = booking.data.id;

    await client.ecommerce.assign(ecommerceId, { booking_id: bookingId });

    const fetched = await client.ecommerce.get(ecommerceId);
    expect(fetched.data.booking).toBeDefined();
    expect(fetched.data.booking?.id).toBe(bookingId);
  });

  it('deletes the ecommerce session', async () => {
    await client.ecommerce.delete(ecommerceId);
    ecommerceId = ''; // prevent double-delete in afterAll
  });
});
