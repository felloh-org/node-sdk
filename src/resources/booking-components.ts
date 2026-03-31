import { BaseResource } from './base.js';
import type { FellohResponse } from '../types/common.js';
import type { BookingComponent } from '../types/bookings.js';
import type { CreateBookingComponentParams } from '../types/booking-components.js';

export class BookingComponentsResource extends BaseResource {
  /**
   * Add a component (e.g. flight, hotel) to a booking.
   * @param bookingId - The booking to add the component to.
   * @param params - Component details including supplier, amount, and currency.
   */
  async create(bookingId: string, params: CreateBookingComponentParams): Promise<FellohResponse<BookingComponent>> {
    return this._create<BookingComponent>(`/agent/booking/${bookingId}/component`, params);
  }

  /**
   * Remove a component from a booking.
   * @param bookingId - The parent booking ID.
   * @param componentId - The component ID to remove.
   */
  async delete(bookingId: string, componentId: string): Promise<FellohResponse<void>> {
    return this._remove<void>(`/agent/bookings/${bookingId}/component/${componentId}`);
  }
}
