import { BaseResource } from './base.js';
import type { FellohListResponse } from '../types/common.js';
import type { LedgerEntry, ListLedgerParams } from '../types/ledger.js';

export class LedgerResource extends BaseResource {
  /** Fetch a paginated list of ledger entries. Only available for managed trust accounts. Supports CSV export. */
  async list(params: ListLedgerParams): Promise<FellohListResponse<LedgerEntry>> {
    return this._list<LedgerEntry>('/ledger', params);
  }

  /** Auto-paginate through all ledger entries. Returns an `AsyncIterable`. */
  listAll(params: Omit<ListLedgerParams, 'skip' | 'take'>): AsyncIterable<LedgerEntry> {
    return this._paginate<LedgerEntry>('/ledger', params);
  }
}
