import type { PaginationParams } from './common.js';

export interface AuditEvent {
  id: string;
  type: string;
  entity_id: string;
  created_at: string;
  user: { id: string; email: string };
  organisation: { id: string; name: string };
}

export interface ListAuditParams extends PaginationParams {
  organisation: string;
}
