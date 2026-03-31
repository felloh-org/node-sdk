import { BaseResource } from './base.js';
import type { FellohResponse, FellohListResponse } from '../types/common.js';
import type { Supplier, CreateSupplierParams, ListSuppliersParams } from '../types/suppliers.js';

export class SuppliersResource extends BaseResource {
  /** Fetch a paginated list of suppliers. Supports keyword search. */
  async list(params: ListSuppliersParams): Promise<FellohListResponse<Supplier>> {
    return this._list<Supplier>('/agent/suppliers', params);
  }

  /** Auto-paginate through all suppliers. Returns an `AsyncIterable`. */
  listAll(params: Omit<ListSuppliersParams, 'skip' | 'take'>): AsyncIterable<Supplier> {
    return this._paginate<Supplier>('/agent/suppliers', params);
  }

  /** Create a new supplier. */
  async create(params: CreateSupplierParams): Promise<FellohResponse<Supplier>> {
    return this._create<Supplier>('/agent/suppliers', params);
  }
}
