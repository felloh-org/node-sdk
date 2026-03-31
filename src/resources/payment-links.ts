import { BaseResource } from './base.js';
import type { FellohResponse, FellohListResponse } from '../types/common.js';
import type { PaymentLink, CreatePaymentLinkParams, ListPaymentLinksParams, AssignPaymentLinkParams } from '../types/payment-links.js';

export class PaymentLinksResource extends BaseResource {
  /** Fetch a paginated list of payment links. Supports keyword search and date range. */
  async list(params: ListPaymentLinksParams): Promise<FellohListResponse<PaymentLink>> {
    return this._list<PaymentLink>('/agent/payment-links', params);
  }

  /** Auto-paginate through all payment links matching the given filters. Returns an `AsyncIterable`. */
  listAll(params: Omit<ListPaymentLinksParams, 'skip' | 'take'>): AsyncIterable<PaymentLink> {
    return this._paginate<PaymentLink>('/agent/payment-links', params);
  }

  /** Fetch a single payment link by ID. */
  async get(paymentLinkId: string): Promise<FellohResponse<PaymentLink>> {
    return this._get<PaymentLink>(`/agent/payment-links/${paymentLinkId}`);
  }

  /** Create a new payment link. Amount must be in the lowest currency denomination (e.g. pence). */
  async create(params: CreatePaymentLinkParams): Promise<FellohResponse<PaymentLink>> {
    return this._create<PaymentLink>('/agent/payment-links', params);
  }

  /** Delete a payment link by ID. */
  async delete(paymentLinkId: string): Promise<FellohResponse<void>> {
    return this._remove<void>(`/agent/payment-links/${paymentLinkId}`);
  }

  /** Assign an existing payment link to a booking. */
  async assign(paymentLinkId: string, params: AssignPaymentLinkParams): Promise<FellohResponse<void>> {
    return this._update<void>(`/agent/payment-links/${paymentLinkId}/assign`, params);
  }
}
