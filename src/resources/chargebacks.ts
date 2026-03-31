import { BaseResource } from './base.js';
import type { FellohListResponse } from '../types/common.js';
import type { Chargeback, ListChargebacksParams } from '../types/chargebacks.js';

export class ChargebacksResource extends BaseResource {
  /** Fetch a paginated list of chargebacks. Supports CSV export. */
  async list(params: ListChargebacksParams): Promise<FellohListResponse<Chargeback>> {
    return this._list<Chargeback>('/agent/chargebacks', params);
  }

  /** Auto-paginate through all chargebacks. Returns an `AsyncIterable`. */
  listAll(params: Omit<ListChargebacksParams, 'skip' | 'take'>): AsyncIterable<Chargeback> {
    return this._paginate<Chargeback>('/agent/chargebacks', params);
  }
}
