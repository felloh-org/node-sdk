import { BaseResource } from './base.js';
import type { FellohResponse, FellohListResponse } from '../types/common.js';
import type { Disbursement, ListDisbursementsParams } from '../types/disbursements.js';

export class DisbursementsResource extends BaseResource {
  /** Fetch a paginated list of disbursements. Supports date range, keyword search, and CSV export. */
  async list(params: ListDisbursementsParams): Promise<FellohListResponse<Disbursement>> {
    return this._list<Disbursement>('/ledger/disbursements', params);
  }

  /** Auto-paginate through all disbursements. Returns an `AsyncIterable`. */
  listAll(params: Omit<ListDisbursementsParams, 'skip' | 'take'>): AsyncIterable<Disbursement> {
    return this._paginate<Disbursement>('/ledger/disbursements', params);
  }

  /** Fetch a single disbursement by ID, including its associated transactions. */
  async get(disbursementId: string): Promise<FellohResponse<Disbursement>> {
    return this._get<Disbursement>(`/ledger/disbursements/${disbursementId}`);
  }
}
