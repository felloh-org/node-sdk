import { BaseResource } from './base.js';
import type { FellohResponse, FellohListResponse } from '../types/common.js';
import type { EcommerceSession, CreateEcommerceParams, ListEcommerceParams, AssignEcommerceParams } from '../types/ecommerce.js';

export class EcommerceResource extends BaseResource {
  /** Fetch a paginated list of ecommerce sessions. */
  async list(params: ListEcommerceParams): Promise<FellohListResponse<EcommerceSession>> {
    return this._list<EcommerceSession>('/agent/ecommerce', params);
  }

  /** Auto-paginate through all ecommerce sessions. Returns an `AsyncIterable`. */
  listAll(params: Omit<ListEcommerceParams, 'skip' | 'take'>): AsyncIterable<EcommerceSession> {
    return this._paginate<EcommerceSession>('/agent/ecommerce', params);
  }

  /** Fetch a single ecommerce session by ID. */
  async get(ecommerceId: string): Promise<FellohResponse<EcommerceSession>> {
    return this._get<EcommerceSession>(`/agent/ecommerce/${ecommerceId}`);
  }

  /** Create a new ecommerce session. Amount must be in the lowest currency denomination (e.g. pence). */
  async create(params: CreateEcommerceParams): Promise<FellohResponse<EcommerceSession>> {
    return this._create<EcommerceSession>('/agent/ecommerce', params);
  }

  /** Delete an ecommerce session by ID. */
  async delete(ecommerceId: string): Promise<FellohResponse<void>> {
    return this._remove<void>(`/agent/ecommerce/${ecommerceId}`);
  }

  /** Assign an ecommerce session to a booking. */
  async assign(ecommerceId: string, params: AssignEcommerceParams): Promise<FellohResponse<void>> {
    return this._update<void>(`/agent/ecommerce/${ecommerceId}/assign`, params);
  }
}
