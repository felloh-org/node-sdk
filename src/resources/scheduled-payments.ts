import { BaseResource } from './base.js';
import type { FellohResponse, FellohListResponse } from '../types/common.js';
import type {
  ScheduledPayment,
  ListScheduledPaymentsParams,
  AvailableToken,
  CreateScheduledPaymentParams,
  CreateApprovalLinkParams,
} from '../types/scheduled-payments.js';

export class ScheduledPaymentsResource extends BaseResource {
  /** Fetch a paginated list of scheduled (MOTO) payments. */
  async list(params: ListScheduledPaymentsParams): Promise<FellohListResponse<ScheduledPayment>> {
    return this._list<ScheduledPayment>('/payment/scheduled-payment', params);
  }

  /** Auto-paginate through all scheduled payments. Returns an `AsyncIterable`. */
  listAll(params: Omit<ListScheduledPaymentsParams, 'skip' | 'take'>): AsyncIterable<ScheduledPayment> {
    return this._paginate<ScheduledPayment>('/payment/scheduled-payment', params);
  }

  /** Fetch stored card tokens available on a booking for use in scheduled payments. */
  async availableTokens(bookingId: string): Promise<FellohResponse<AvailableToken[]>> {
    return this.http.request<AvailableToken[]>({ method: 'GET', path: `/payment/booking/${bookingId}/available-tokens` });
  }

  /**
   * Create a new payment against a booking using a stored card token.
   * @param bookingId - The booking to charge.
   * @param params - Payment details including `token` and `amount`. Optionally schedule for a future `date`.
   */
  async createPayment(bookingId: string, params: CreateScheduledPaymentParams): Promise<FellohResponse<ScheduledPayment>> {
    return this._update<ScheduledPayment>(`/payment/booking/${bookingId}/payment`, params);
  }

  /**
   * Generate an approval link that a customer can use to authorise a stored-card payment.
   * @param bookingId - The booking the payment relates to.
   * @param params - Must include `amount` and `token`.
   */
  async approvalLink(bookingId: string, params: CreateApprovalLinkParams): Promise<FellohResponse<{ url: string }>> {
    return this._update<{ url: string }>(`/agent/bookings/${bookingId}/approval-link`, params);
  }

  /** Cancel a scheduled payment by ID. */
  async delete(paymentId: string): Promise<FellohResponse<void>> {
    return this._remove<void>(`/payment/scheduled-payment/${paymentId}`);
  }
}
