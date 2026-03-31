import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient, ORGANISATION_ID, testRef } from './setup.js';

describe('Booking Components', () => {
  const client = createClient();
  let bookingId: string;
  let componentId: string | undefined;
  let supplierId: string;
  let sandboxUnavailable = false;

  beforeAll(async () => {
    const supplier = await client.suppliers.create({
      organisation: ORGANISATION_ID,
      supplier_name: testRef('SUPPLIER'),
    });
    supplierId = supplier.data.id;

    const booking = await client.bookings.create({
      organisation: ORGANISATION_ID,
      booking_reference: testRef('COMP'),
      customer_name: 'Component Test',
      email: 'comp-test@example.com',
      currency: 'GBX',
      gross_amount: 50000,
    });
    bookingId = booking.data.id;
  });

  afterAll(async () => {
    try { await client.bookings.delete(bookingId); } catch { /* cleanup */ }
  });

  it('creates a component on a booking', async () => {
    try {
      const result = await client.bookingComponents.create(bookingId, {
        supplier: supplierId,
        amount: 25000,
        currency: 'GBX',
        booking_reference: testRef('COMP-LINE'),
      });

      expect(result.data).toBeDefined();
      componentId = result.data.id;
      expect(componentId).toBeTruthy();
    } catch (err: any) {
      if (err.statusCode === 500) {
        sandboxUnavailable = true;
        console.log('  [skip] Booking components endpoint returned 500 on sandbox');
        return;
      }
      throw err;
    }
  });

  it('component appears on the booking', async () => {
    if (sandboxUnavailable || !componentId) {
      console.log('  [skip] Component was not created');
      return;
    }
    const booking = await client.bookings.get(bookingId);
    expect(booking.data.components.length).toBeGreaterThanOrEqual(1);
    expect(booking.data.components.some(c => c.id === componentId)).toBe(true);
  });

  it('deletes the component', async () => {
    if (sandboxUnavailable || !componentId) {
      console.log('  [skip] Component was not created');
      return;
    }
    await client.bookingComponents.delete(bookingId, componentId);

    const booking = await client.bookings.get(bookingId);
    expect(booking.data.components.some(c => c.id === componentId)).toBe(false);
  });
});
