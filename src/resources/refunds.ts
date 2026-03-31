import { BaseResource } from './base.js';
import type { FellohResponse, FellohListResponse } from '../types/common.js';
import type { Refund, ListRefundsParams } from '../types/refunds.js';

export class RefundsResource extends BaseResource {
  /** Fetch a paginated list of refunds. */
  async list(params: ListRefundsParams): Promise<FellohListResponse<Refund>> {
    return this._list<Refund>('/agent/refunds', params);
  }

  /** Auto-paginate through all refunds. Returns an `AsyncIterable`. */
  listAll(params: Omit<ListRefundsParams, 'skip' | 'take'>): AsyncIterable<Refund> {
    return this._paginate<Refund>('/agent/refunds', params);
  }

  /** Authorise a pending refund using its authorisation code. */
  async authorise(authorisationCode: string): Promise<FellohResponse<void>> {
    return this._get<void>(`/agent/refunds/${authorisationCode}/authorise`);
  }

  /** Decline a pending refund using its authorisation code. */
  async decline(authorisationCode: string): Promise<FellohResponse<void>> {
    return this._get<void>(`/agent/refunds/${authorisationCode}/decline`);
  }
}
