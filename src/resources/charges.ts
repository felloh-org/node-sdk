import { BaseResource } from './base.js';
import type { FellohListResponse } from '../types/common.js';
import type { Charge, ListChargesParams } from '../types/charges.js';

export class ChargesResource extends BaseResource {
  /** Fetch a paginated list of transaction charges. Supports date range filtering. */
  async list(params: ListChargesParams): Promise<FellohListResponse<Charge>> {
    return this._list<Charge>('/agent/charges', params);
  }

  /** Auto-paginate through all charges. Returns an `AsyncIterable`. */
  listAll(params: Omit<ListChargesParams, 'skip' | 'take'>): AsyncIterable<Charge> {
    return this._paginate<Charge>('/agent/charges', params);
  }
}
