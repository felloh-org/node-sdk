import { BaseResource } from './base.js';
import type { FellohListResponse } from '../types/common.js';
import type { AuditEvent, ListAuditParams } from '../types/audit.js';

export class AuditResource extends BaseResource {
  /** Fetch a paginated list of audit events (e.g. booking:create, transaction:refund). */
  async list(params: ListAuditParams): Promise<FellohListResponse<AuditEvent>> {
    return this._list<AuditEvent>('/audit', params);
  }

  /** Auto-paginate through all audit events. Returns an `AsyncIterable`. */
  listAll(params: Omit<ListAuditParams, 'skip' | 'take'>): AsyncIterable<AuditEvent> {
    return this._paginate<AuditEvent>('/audit', params);
  }
}
