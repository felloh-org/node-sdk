import { BaseResource } from './base.js';
import type { FellohResponse, FellohListResponse } from '../types/common.js';
import type { Booking, CreateBookingParams, UpdateBookingParams, ListBookingsParams } from '../types/bookings.js';

export class BookingsResource extends BaseResource {
  /** Fetch a paginated list of bookings. Supports keyword search, date range, and CSV export. */
  async list(params: ListBookingsParams): Promise<FellohListResponse<Booking>> {
    return this._list<Booking>('/agent/bookings', params);
  }

  /** Auto-paginate through all bookings matching the given filters. Returns an `AsyncIterable`. */
  listAll(params: Omit<ListBookingsParams, 'skip' | 'take'>): AsyncIterable<Booking> {
    return this._paginate<Booking>('/agent/bookings', params);
  }

  /** Fetch a single booking by ID. */
  async get(bookingId: string): Promise<FellohResponse<Booking>> {
    return this._get<Booking>(`/agent/bookings/${bookingId}`);
  }

  /** Create a new booking. Amounts should be in the lowest currency denomination (e.g. pence). */
  async create(params: CreateBookingParams): Promise<FellohResponse<Booking>> {
    return this._create<Booking>('/agent/bookings', params);
  }

  /** Update an existing booking. Only provided fields will be changed. */
  async update(bookingId: string, params: UpdateBookingParams): Promise<FellohResponse<Booking>> {
    return this._update<Booking>(`/agent/bookings/${bookingId}`, params);
  }

  /** Delete a booking by ID. */
  async delete(bookingId: string): Promise<FellohResponse<void>> {
    return this._remove<void>(`/agent/bookings/${bookingId}`);
  }

  /** Update only the booking reference on an existing booking. */
  async updateReference(bookingId: string, bookingReference: string): Promise<FellohResponse<void>> {
    return this._update<void>(`/agent/bookings/${bookingId}/update-reference`, { booking_reference: bookingReference });
  }
}
