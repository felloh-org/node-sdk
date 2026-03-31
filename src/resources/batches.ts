import { BaseResource } from './base.js';
import type { FellohResponse, FellohListResponse } from '../types/common.js';
import type { Batch, ListBatchesParams } from '../types/batches.js';

export class BatchesResource extends BaseResource {
  /** Fetch a paginated list of acquirer settlement batches. */
  async list(params: ListBatchesParams): Promise<FellohListResponse<Batch>> {
    return this._list<Batch>('/bank/batch', params);
  }

  /** Auto-paginate through all settlement batches. Returns an `AsyncIterable`. */
  listAll(params: Omit<ListBatchesParams, 'skip' | 'take'>): AsyncIterable<Batch> {
    return this._paginate<Batch>('/bank/batch', params);
  }

  /** Fetch a single settlement batch by ID, including transaction and adjustment counts. */
  async get(batchId: string): Promise<FellohResponse<Batch>> {
    return this._update<Batch>(`/bank/batch/${batchId}`, {});
  }
}
