import { describe, it, expect, afterAll } from 'vitest';
import { createClient, ORGANISATION_ID, testRef } from './setup.js';

describe('Payment Links CRUD', () => {
  const client = createClient();
  let paymentLinkId: string;
  let bookingId: string;

  afterAll(async () => {
    try { if (paymentLinkId) await client.paymentLinks.delete(paymentLinkId); } catch { /* cleanup */ }
    try { if (bookingId) await client.bookings.delete(bookingId); } catch { /* cleanup */ }
  });

  it('creates a payment link', async () => {
    const result = await client.paymentLinks.create({
      customer_name: 'PL Test',
      email: 'pl-test@example.com',
      organisation: ORGANISATION_ID,
      amount: 25000,
      type: 'CARD',
    });

    expect(result.data).toBeDefined();
    paymentLinkId = result.data.id;
    expect(paymentLinkId).toBeTruthy();
  });

  it('fetches the payment link by ID', async () => {
    const result = await client.paymentLinks.get(paymentLinkId);

    expect(result.data.id).toBe(paymentLinkId);
    expect(result.data.amount).toBe(25000);
    expect(result.data.customer_name).toBe('PL Test');
  });

  it('lists payment links and finds the created one', async () => {
    const result = await client.paymentLinks.list({
      organisation: ORGANISATION_ID,
      take: 25,
    });

    expect(result.data.some(pl => pl.id === paymentLinkId)).toBe(true);
  });

  it('assigns a payment link to a booking', async () => {
    const ref = testRef('PL-ASSIGN');
    await client.paymentLinks.assign(paymentLinkId, {
      organisation: ORGANISATION_ID,
      customer_name: 'PL Assign Test',
      email: 'pl-assign@example.com',
      booking_reference: ref,
    });

    const fetched = await client.paymentLinks.get(paymentLinkId);
    expect(fetched.data.booking).toBeDefined();
    bookingId = fetched.data.booking!.id;
  });

  it('deletes the payment link', async () => {
    await client.paymentLinks.delete(paymentLinkId);
    paymentLinkId = '';
  });
});
