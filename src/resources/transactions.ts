import { BaseResource } from './base.js';
import type { FellohResponse, FellohListResponse } from '../types/common.js';
import type { Transaction, ListTransactionsParams, RefundTransactionParams, ReassignTransactionParams } from '../types/transactions.js';

export class TransactionsResource extends BaseResource {
  /** Fetch a paginated list of transactions. Supports keyword search, date range, status filter, and CSV export. */
  async list(params: ListTransactionsParams): Promise<FellohListResponse<Transaction>> {
    return this._list<Transaction>('/agent/transactions', params);
  }

  /** Auto-paginate through all transactions matching the given filters. Returns an `AsyncIterable`. */
  listAll(params: Omit<ListTransactionsParams, 'skip' | 'take'>): AsyncIterable<Transaction> {
    return this._paginate<Transaction>('/agent/transactions', params);
  }

  /** Fetch a single transaction by ID. */
  async get(transactionId: string): Promise<FellohResponse<Transaction>> {
    return this._get<Transaction>(`/agent/transactions/${transactionId}`);
  }

  /**
   * Issue a refund against a transaction.
   * @param transactionId - The transaction to refund.
   * @param params - Refund details. Amount must be in the lowest currency denomination (e.g. pence).
   */
  async refund(transactionId: string, params: RefundTransactionParams): Promise<FellohResponse<void>> {
    return this._update<void>(`/agent/transactions/${transactionId}/refund`, params);
  }

  /** Complete a pre-authorised transaction, capturing the held funds. */
  async complete(transactionId: string): Promise<FellohResponse<void>> {
    return this._get<void>(`/agent/transactions/${transactionId}/complete`);
  }

  /** Reverse a pre-authorised transaction, releasing the held funds. */
  async reverse(transactionId: string): Promise<FellohResponse<void>> {
    return this._get<void>(`/agent/transactions/${transactionId}/reverse`);
  }

  /**
   * Re-assign a transaction to a different booking.
   * @param transactionId - The transaction to move.
   * @param params - Must include the target `booking_id`.
   */
  async reassign(transactionId: string, params: ReassignTransactionParams): Promise<FellohResponse<void>> {
    return this._update<void>(`/agent/transactions/${transactionId}/re-assign`, params);
  }
}
