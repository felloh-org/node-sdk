import { BaseResource } from './base.js';
import type { FellohResponse, FellohListResponse } from '../types/common.js';
import type { Customer, CreateCustomerParams, ListCustomersParams } from '../types/customers.js';

export class CustomersResource extends BaseResource {
  /** Fetch a paginated list of customers. Supports keyword search. */
  async list(params: ListCustomersParams): Promise<FellohListResponse<Customer>> {
    return this._list<Customer>('/agent/customers', params);
  }

  /** Auto-paginate through all customers matching the given filters. Returns an `AsyncIterable`. */
  listAll(params: Omit<ListCustomersParams, 'skip' | 'take'>): AsyncIterable<Customer> {
    return this._paginate<Customer>('/agent/customers', params);
  }

  /** Create a new customer record. */
  async create(params: CreateCustomerParams): Promise<FellohResponse<Customer>> {
    return this._create<Customer>('/agent/customers', params);
  }
}
